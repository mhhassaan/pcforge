import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def dump():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    cur.execute("SELECT product_id, supported_motherboard_form_factors FROM case_specs LIMIT 10;")
    for row in cur.fetchall():
        print(row)
    cur.close()
    conn.close()

if __name__ == "__main__":
    dump()
