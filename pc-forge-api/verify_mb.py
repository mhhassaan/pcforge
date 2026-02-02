import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def verify():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    
    cur.execute("SELECT count(*) FROM products WHERE category IN ('motherboard', 'motherboards');")
    print('Total MB products:', cur.fetchone()[0])
    
    cur.execute("SELECT count(*) FROM motherboard_specs;")
    print('Total MB specs:', cur.fetchone()[0])
    
    cur.execute("SELECT p.product_id, p.product_name FROM products p JOIN motherboard_specs m ON p.product_id = m.product_id LIMIT 3;")
    print('Sample joined:', cur.fetchall())

    cur.close()
    conn.close()

if __name__ == "__main__":
    verify()
