from app.db import get_connection
import psycopg2.extras

def check():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    items = ['Ryzen 5 7600', 'PRO B650M-A WIFI', 'RX 6600', 'Lancool 216', '16GB DDR5', '1TB NVMe', '650W']
    total = 0
    for item in items:
        cur.execute("""
            SELECT p.product_name, MIN(v.price) as price 
            FROM products p 
            JOIN vendor_prices v ON p.product_id = v.product_id 
            WHERE p.product_name ILIKE %s 
            GROUP BY p.product_id, p.product_name
            LIMIT 1
        """, (f'%{item}%',))
        row = cur.fetchone()
        if row:
            print(f"{row['product_name']}: {row['price']}")
            total += row['price']
    print(f"Calculated Total: {total}")
    cur.close()
    conn.close()

if __name__ == '__main__':
    check()
