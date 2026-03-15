from app.db import get_connection
import psycopg2.extras

def check_ssds():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    print("Checking products with category 'ssd':")
    cur.execute("SELECT product_id, product_name FROM products WHERE category = 'ssd' LIMIT 5")
    products = cur.fetchall()
    for p in products:
        print(f"Product: {p['product_name']} ({p['product_id']})")
        
    print("\nChecking storage_specs for these IDs:")
    for p in products:
        cur.execute("SELECT * FROM storage_specs WHERE product_id = %s", (p['product_id'],))
        spec = cur.fetchone()
        if spec:
            print(f"Spec found for {p['product_id']}: {dict(spec)}")
        else:
            print(f"NO SPEC FOUND for {p['product_id']}")
            
    print("\nChecking price existence:")
    for p in products:
        cur.execute("SELECT MIN(price) FROM vendor_prices WHERE product_id = %s", (p['product_id'],))
        price = cur.fetchone()[0]
        print(f"Price for {p['product_id']}: {price}")

    cur.close()
    conn.close()

if __name__ == '__main__':
    check_ssds()
