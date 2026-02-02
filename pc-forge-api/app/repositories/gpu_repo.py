from app.db import get_connection

import psycopg2.extras

def get_compatible_gpus(case_id: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    sql = """
    SELECT
      p.product_id,
      p.product_name,
      p.manufacturer,
      p.category,
      v.price as price_pkr,
      g.*
    FROM gpu_specs g
    JOIN products p ON g.product_id = p.product_id
    JOIN case_specs c
      ON g.length_mm <= c.max_gpu_length_mm
     AND g.slot_width <= c.expansion_slots
    LEFT JOIN (
        SELECT DISTINCT ON (product_id) product_id, price
        FROM vendor_prices
        ORDER BY product_id, price ASC
    ) v ON g.product_id = v.product_id
    WHERE c.product_id = %s;
    """

    cur.execute(sql, (case_id,))
    rows = cur.fetchall()

    results = []
    for row in rows:
        spec_data = {}
        row_dict = dict(row)
        base_fields = ["product_id", "product_name", "manufacturer", "category", "price_pkr"]
        for key, value in row_dict.items():
            if key not in base_fields:
                spec_data[key] = value

        results.append({
            "product_id": row["product_id"],
            "product_name": row["product_name"],
            "manufacturer": row["manufacturer"],
            "category": row["category"],
            "price_pkr": row["price_pkr"],
            "specs": spec_data
        })

    cur.close()
    conn.close()

    return results
