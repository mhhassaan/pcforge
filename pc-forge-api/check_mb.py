import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check_vendors():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    
    # Check all motherboards category distribution
    print("Motherboard Categories in products table:")
    cur.execute("SELECT category, count(*) FROM products WHERE category LIKE '%motherboard%' GROUP BY category;")
    print(cur.fetchall())
    
    # Check products with prices
    print("\nMotherboards with prices by vendor:")
    cur.execute("""
        SELECT v.vendor, count(*) 
        FROM products p 
        JOIN vendor_prices v ON p.product_id = v.product_id 
        WHERE p.category IN ('motherboard', 'motherboards') 
        GROUP BY v.vendor;
    """)
    print(cur.fetchall())
    
    # Check the 12 products in 'motherboard' category specifically
    print("\nProducts in 'motherboard' category:")
    cur.execute("SELECT p.product_id, p.product_name, v.vendor FROM products p LEFT JOIN vendor_prices v ON p.product_id = v.product_id WHERE p.category = 'motherboard';")
    for row in cur.fetchall():
        print(row)

    cur.close()
    conn.close()

if __name__ == "__main__":
    check_vendors()
