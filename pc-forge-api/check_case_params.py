import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    
    mb_id = '282c73bd-480d-4087-8376-df7fca9e9d50'
    gpu_id = '0d9dd560-08e9-4018-aab0-a4ab1ebde80f'
    
    cur.execute("SELECT product_id, length_mm FROM gpu_specs WHERE product_id = %s", (gpu_id,))
    print('GPU Details:', cur.fetchone())
    
    cur.execute("SELECT count(*) FROM case_specs WHERE %s = ANY(supported_motherboard_form_factors) AND max_gpu_length_mm >= %s", ('Micro ATX', 213))
    print('Compatible cases count:', cur.fetchone())

    # Full query test
    sql = """
    SELECT count(*)
    FROM case_specs c
    JOIN products p ON c.product_id = p.product_id
    JOIN motherboard_specs m ON m.product_id = %s AND m.form_factor = ANY(c.supported_motherboard_form_factors)
    JOIN gpu_specs g ON g.product_id = %s AND g.length_mm <= c.max_gpu_length_mm
    """
    cur.execute(sql, (mb_id, gpu_id))
    print('Full query count:', cur.fetchone())
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    check()
