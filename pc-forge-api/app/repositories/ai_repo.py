from app.db import get_connection
import psycopg2.extras

def get_all_components_summary():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    categories = ["cpu", "gpu", "motherboard", "psu", "ram", "storage", "case"]
    table_map = {
        "cpu": "cpu_specs",
        "gpu": "gpu_specs",
        "motherboard": "motherboard_specs",
        "psu": "psu_specs",
        "ram": "ram_specs",
        "storage": "storage_specs",
        "case": "case_specs"
    }

    # ID Mapping to save tokens
    # { 'cpu': { 'C1': 'UUID-...' } }
    id_map = {}
    
    results = {}
    for cat in categories:
        specs_table = table_map[cat]
        id_map[cat] = {}
        
        # We fetch ALL components first, then sample them locally to get a good price spread
        # To optimize, we'll fetch ordered by price
        sql = f"""
        SELECT 
            p.product_id,
            p.product_name,
            MIN(v.price) as price_pkr,
            s.*
        FROM products p
        LEFT JOIN {specs_table} s ON p.product_id = s.product_id
        LEFT JOIN vendor_prices v ON p.product_id = v.product_id
        WHERE p.category::TEXT IN (
            SELECT unnest(CASE 
                WHEN '{cat}' = 'cpu' THEN ARRAY['cpu']
                WHEN '{cat}' = 'gpu' THEN ARRAY['gpu']
                WHEN '{cat}' = 'motherboard' THEN ARRAY['motherboard']
                WHEN '{cat}' = 'psu' THEN ARRAY['psu']
                WHEN '{cat}' = 'ram' THEN ARRAY['ram']
                WHEN '{cat}' = 'storage' THEN ARRAY['ssd']
                WHEN '{cat}' = 'case' THEN ARRAY['case']
                ELSE ARRAY['{cat}']
            END)
        )
        GROUP BY p.product_id, s.product_id
        HAVING MIN(v.price) IS NOT NULL
        ORDER BY price_pkr ASC;
        """
        
        cur.execute(sql)
        rows = cur.fetchall()
        
        if not rows:
            results[cat] = []
            continue

        # SAMPLING STRATEGY: 
        # Total 25 per category: 5 cheapest, 5 most expensive, 15 spread in middle
        total_count = len(rows)
        target_limit = 25
        
        selected_rows = []
        if total_count <= target_limit:
            selected_rows = rows
        else:
            # 5 Cheapest
            selected_rows.extend(rows[:5])
            # 5 Most expensive
            selected_rows.extend(rows[-5:])
            # 15 from the middle (calculated step)
            middle_rows = rows[5:-5]
            if middle_rows:
                step = len(middle_rows) // 15
                if step == 0: step = 1
                selected_rows.extend(middle_rows[::step][:15])

        results[cat] = []
        prefix = cat[0].upper() # C, G, M, P, R, S, K
        if cat == "case": prefix = "K"
        
        for i, row in enumerate(selected_rows):
            alias = f"{prefix}{i+1}"
            id_map[cat][alias] = row["product_id"]
            
            specs = dict(row)
            summary_spec = {}
            # Minimalist specs to save tokens
            if cat == "cpu":
                summary_spec = {"sk": specs.get("socket"), "w": specs.get("tdp_watts")}
            elif cat == "gpu":
                summary_spec = {"v": specs.get("vram_gb"), "w": specs.get("tdp_watts"), "l": specs.get("length_mm")}
            elif cat == "motherboard":
                summary_spec = {"sk": specs.get("socket"), "r": specs.get("ram_type"), "f": specs.get("form_factor")}
            elif cat == "psu":
                summary_spec = {"w": specs.get("wattage")}
            elif cat == "ram":
                summary_spec = {"t": specs.get("ram_type"), "c": specs.get("total_capacity_gb")}
            elif cat == "storage":
                summary_spec = {"n": specs.get("nvme"), "c": specs.get("capacity_gb")}
            elif cat == "case":
                summary_spec = {"f": specs.get("case_form_factor"), "gl": specs.get("max_gpu_length_mm")}

            results[cat].append({
                "i": alias,
                "n": row["product_name"][:40], # Shorten names
                "p": int(row["price_pkr"]),
                "s": summary_spec
            })

    cur.close()
    conn.close()
    return results, id_map
