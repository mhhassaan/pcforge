from app.db import get_connection

def get_all_cpus():
    conn = get_connection()
    cur = conn.cursor()

    sql = """
    SELECT
        p.product_id,
        p.product_name,
        p.manufacturer,
        v.price as price_pkr
    FROM cpu_specs c
    JOIN products p ON c.product_id = p.product_id
    LEFT JOIN (
        SELECT DISTINCT ON (product_id) product_id, price
        FROM vendor_prices
        ORDER BY product_id, price ASC
    ) v ON p.product_id = v.product_id;
    """

    cur.execute(sql)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows
