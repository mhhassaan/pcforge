from app.db import get_connection

import psycopg2.extras

def get_compatible_cases(motherboard_id: str = None, gpu_id: str = None):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Base query
    sql = """
    SELECT
        p.product_id,
        p.product_name,
        p.manufacturer,
        p.category,
        v.price as price_pkr,
        c.case_form_factor,
        c.side_panel_type,
        c.max_gpu_length_mm
    FROM case_specs c
    JOIN products p ON c.product_id = p.product_id
    LEFT JOIN (
        SELECT DISTINCT ON (product_id) product_id, price
        FROM vendor_prices
        ORDER BY product_id, price ASC
    ) v ON c.product_id = v.product_id
    WHERE 1=1
    """
    
    params = []
    
    if motherboard_id:
        # Filter for cases that support this specific motherboard's form factor
        sql += """ AND EXISTS (
            SELECT 1 FROM motherboard_specs m 
            WHERE m.product_id = %s 
            AND m.form_factor = ANY(c.supported_motherboard_form_factors)
        )"""
        params.append(motherboard_id)
        
    if gpu_id:
        # Filter for cases that can fit this specific GPU
        sql += """ AND EXISTS (
            SELECT 1 FROM gpu_specs g 
            WHERE g.product_id = %s 
            AND g.length_mm <= c.max_gpu_length_mm
        )"""
        params.append(gpu_id)

    cur.execute(sql, tuple(params))
    rows = cur.fetchall()

    results = []
    for row in rows:
        results.append({
            "product_id": row["product_id"],
            "product_name": row["product_name"],
            "manufacturer": row["manufacturer"],
            "category": row["category"],
            "price_pkr": row["price_pkr"],
            "specs": {
                "case_form_factor": row["case_form_factor"],
                "side_panel_type": row["side_panel_type"],
                "max_gpu_length_mm": row["max_gpu_length_mm"]
            }
        })

    cur.close()
    conn.close()

    return results
