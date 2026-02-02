from app.db import get_connection

def get_cheapest_prices(product_ids: list[str]):
    conn = get_connection()
    cur = conn.cursor()

    sql = """
    SELECT DISTINCT ON (v.product_id)
      v.product_id,
      p.product_name,
      v.vendor,
      v.price,
      v.url
    FROM vendor_prices v
    JOIN products p ON v.product_id = p.product_id
    WHERE v.product_id = ANY(%s)
    ORDER BY v.product_id, v.price ASC;
    """

    cur.execute(sql, (product_ids,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows
