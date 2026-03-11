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
    FROM products p
    LEFT JOIN cpu_specs c ON p.product_id = c.product_id
    LEFT JOIN (
        SELECT DISTINCT ON (product_id) product_id, price
        FROM vendor_prices
        ORDER BY product_id, price ASC
    ) v ON p.product_id = v.product_id
    WHERE p.category = 'cpu';
    """

    cur.execute(sql)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows
