import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'case_specs';
    """)
    print("Columns in 'case_specs':")
    for row in cur.fetchall():
        print(row)
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")