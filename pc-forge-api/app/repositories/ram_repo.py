from app.db import get_connection
import psycopg2.extras

def get_compatible_ram(motherboard_id: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    sql = """
    SELECT
        p.product_id,
        p.product_name,
        p.manufacturer,
        p.category,
        v.price as price_pkr,
        r.*
    FROM ram_specs r
    JOIN products p ON r.product_id = p.product_id
    JOIN motherboard_specs m
      ON r.ram_type = m.ram_type
     AND r.total_capacity_gb <= m.max_ram_gb
     AND r.module_count <= m.ram_slots
    LEFT JOIN (
        SELECT DISTINCT ON (product_id) product_id, price
        FROM vendor_prices
        ORDER BY product_id, price ASC
    ) v ON r.product_id = v.product_id
    WHERE m.product_id = %s;
    """
    cur.execute(sql, (motherboard_id,))
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
