from app.db import get_connection
import psycopg2.extras

# Simple in-memory cache
_filter_cache = {}

def get_filter_options(category: str):
    # Use global cache
    if category in _filter_cache and _filter_cache[category]:
        return _filter_cache[category]

    conn = get_connection()
    cur = conn.cursor()

    # Define filterable columns per category
    filter_map = {
        "cpu": ["socket", "cores", "manufacturer"],
        "gpu": ["chipset", "vram_gb", "chipset_manufacturer"],
        "motherboard": ["socket", "chipset", "form_factor", "ram_type"],
        "psu": ["efficiency_rating", "modular"],
        "ram": ["ram_type", "total_capacity_gb", "speed_mhz"],
        "storage": ["storage_type", "capacity_gb", "interface", "nvme"],
        "case": ["case_form_factor", "side_panel_type"]
    }

    if category not in filter_map:
        return {}

    # Map category to its specs table
    table_map = {
        "cpu": "cpu_specs",
        "gpu": "gpu_specs",
        "motherboard": "motherboard_specs",
        "psu": "psu_specs",
        "ram": "ram_specs",
        "storage": "storage_specs",
        "case": "case_specs"
    }

    specs_table = table_map[category]
    columns = filter_map[category]
    options = {}

    for col in columns:
        # Some columns come from 'products' table, others from 'specs'
        table = "products" if col in ["manufacturer", "category"] else specs_table
        
        # Mapping frontend category to DB category list
        category_db_map = {
            "cpu": ["cpu"],
            "gpu": ["gpu"],
            "motherboard": ["motherboards"],
            "psu": ["psu"],
            "ram": ["ram"],
            "storage": ["ssd"],
            "case": ["case"]
        }
        db_categories = category_db_map.get(category, [category])

        sql = f"SELECT DISTINCT {col} FROM {table} "
        if table == specs_table:
            sql += f"JOIN products p ON {table}.product_id = p.product_id WHERE p.category IN ({','.join(['%s'] * len(db_categories))})"
        else:
            sql += f"WHERE category IN ({','.join(['%s'] * len(db_categories))})"
        
        sql += f" AND {col} IS NOT NULL ORDER BY {col} ASC"
        
        cur.execute(sql, list(db_categories))
        options[col] = [str(r[0]) for r in cur.fetchall()]

    cur.close()
    conn.close()
    
    _filter_cache[category] = options
    return options

def get_all_filters():
    categories = ["cpu", "gpu", "motherboard", "psu", "ram", "storage", "case"]
    result = {}
    for cat in categories:
        result[cat] = get_filter_options(cat)
    return result

def get_components_by_category(category: str, search_query: str = None, filters: dict = None):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    table_map = {
        "cpu": "cpu_specs",
        "gpu": "gpu_specs",
        "motherboard": "motherboard_specs",
        "psu": "psu_specs",
        "ram": "ram_specs",
        "storage": "storage_specs",
        "case": "case_specs"
    }

    category_db_map = {
        "cpu": ["cpu"],
        "gpu": ["gpu"],
        "motherboard": ["motherboards"],
        "psu": ["psu"],
        "ram": ["ram"],
        "storage": ["ssd"],
        "case": ["case"]
    }

    if category not in table_map:
        return []

    specs_table = table_map[category]
    db_categories = category_db_map[category]

    sql = f"""
    SELECT 
        p.product_id,
        p.product_name,
        p.manufacturer,
        p.category,
        MIN(v.price) as price_pkr,
        json_agg(
            json_build_object(
                'vendor', v.vendor,
                'price', v.price,
                'url', v.url
            ) ORDER BY v.price ASC
        ) FILTER (WHERE v.price IS NOT NULL) as all_prices,
        s.*
    FROM products p
    JOIN {specs_table} s ON p.product_id = s.product_id
    LEFT JOIN vendor_prices v ON p.product_id = v.product_id
    WHERE p.category IN ({','.join(['%s'] * len(db_categories))})
    """

    params = list(db_categories)
    
    if search_query:
        sql += " AND p.product_name ILIKE %s"
        params.append(f"%{search_query}%")

    if filters:
        for col, values in filters.items():
            if not values: continue
            # Handle if col is in products or specs
            prefix = "p" if col in ["manufacturer"] else "s"
            sql += f" AND {prefix}.{col} IN ({','.join(['%s'] * len(values))})"
            params.extend(values)

    sql += " GROUP BY p.product_id, s.product_id"

    cur.execute(sql, params)
    rows = cur.fetchall()

    results = []
    for row in rows:
        # Extract specs (everything from the specs table columns)
        spec_data = {}
        row_dict = dict(row)
        
        # Identification fields to keep at top level
        base_fields = ["product_id", "product_name", "manufacturer", "category", "price_pkr", "all_prices"]
        
        for key, value in row_dict.items():
            if key not in base_fields:
                spec_data[key] = value

        results.append({
            "id": row["product_id"],
            "name": row["product_name"],
            "manufacturer": row["manufacturer"],
            "category": row["category"],
            "price_pkr": row["price_pkr"],
            "prices": row["all_prices"] or [],
            "image_url": None, 
            "specs": spec_data
        })

    cur.close()
    conn.close()
    return results
