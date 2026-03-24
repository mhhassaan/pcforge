from app.db import get_connection
import psycopg2.extras

def get_incomplete_products(category: str = None):
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
        "motherboard": ["motherboard"],
        "psu": ["psu"],
        "ram": ["ram"],
        "storage": ["ssd"],
        "case": ["case"]
    }

    results = []
    
    categories_to_check = [category] if category else table_map.keys()

    for cat in categories_to_check:
        if cat not in table_map: continue
        
        specs_table = table_map[cat]
        db_categories = category_db_map[cat]

        # Get all products in this category that either:
        # 1. Have no specs entry
        # 2. Have a specs entry with any NULL value
        
        # SQL Injection Prevention: table names cannot be parameterized, but we've validated 'specs_table' 
        # against a fixed map of known table names.
        
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = %s", (specs_table,))
        cols = [r[0] for r in cur.fetchall() if r[0] not in ['product_id', 'id']]
        
        null_checks = " OR ".join([f"s.{col} IS NULL" for col in cols])
        
        # Parameterize category placeholders
        placeholders = ', '.join(['%s'] * len(db_categories))
        
        sql = f"""
        SELECT 
            p.product_id,
            p.product_name,
            p.category,
            p.manufacturer,
            s.*
        FROM products p
        LEFT JOIN {specs_table} s ON p.product_id = s.product_id
        WHERE p.category IN ({placeholders})
        AND (s.product_id IS NULL OR {null_checks})
        LIMIT 100;
        """
        
        cur.execute(sql, list(db_categories))
        rows = cur.fetchall()
        
        for row in rows:
            res = dict(row)
            res['main_category'] = cat # The frontend category
            results.append(res)

    cur.close()
    conn.close()
    return results

def update_product_specs(product_id: str, category: str, specs: dict):
    conn = get_connection()
    cur = conn.cursor()

    table_map = {
        "cpu": "cpu_specs",
        "gpu": "gpu_specs",
        "motherboard": "motherboard_specs",
        "psu": "psu_specs",
        "ram": "ram_specs",
        "storage": "storage_specs",
        "case": "case_specs"
    }

    if category not in table_map:
        return False

    specs_table = table_map[category]
    
    # Check if entry exists
    cur.execute(f"SELECT 1 FROM {specs_table} WHERE product_id = %s", (product_id,))
    exists = cur.fetchone()

    # Clean specs dictionary of non-table columns if they sneaked in
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = %s", (specs_table,))
    valid_cols = [r[0] for r in cur.fetchall()]
    
    filtered_specs = {k: v for k, v in specs.items() if k in valid_cols and k != 'product_id'}

    if not exists:
        # INSERT
        cols = ['product_id'] + list(filtered_specs.keys())
        vals = [product_id] + list(filtered_specs.values())
        placeholders = ', '.join(['%s'] * len(vals))
        sql = f"INSERT INTO {specs_table} ({', '.join(cols)}) VALUES ({placeholders})"
        cur.execute(sql, vals)
    else:
        # UPDATE
        set_clause = ', '.join([f"{k} = %s" for k in filtered_specs.keys()])
        vals = list(filtered_specs.values()) + [product_id]
        sql = f"UPDATE {specs_table} SET {set_clause} WHERE product_id = %s"
        cur.execute(sql, vals)

    conn.commit()
    cur.close()
    conn.close()
    return True
