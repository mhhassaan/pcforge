from app.db import get_connection

import psycopg2.extras

def get_compatible_motherboards(cpu_id: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # We join with products p for motherboard details
    # and join with cpu_specs c to get the socket of the selected CPU
    sql = """
    SELECT
      p.product_id,
      p.product_name,
      p.manufacturer,
      p.category,
      v.price as price_pkr,
      m.*
    FROM motherboard_specs m
    JOIN products p ON m.product_id = p.product_id
    JOIN cpu_specs c ON c.socket = m.socket
    LEFT JOIN (
        SELECT DISTINCT ON (product_id) product_id, price
        FROM vendor_prices
        ORDER BY product_id, price ASC
    ) v ON m.product_id = v.product_id
    WHERE c.product_id = %s;
    """

    cur.execute(sql, (cpu_id,))
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
