import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def ensure_schema():
    conn = get_connection()
    cur = conn.cursor()
    
    # Check if is_admin column exists in users table
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_admin'
    """)
    if not cur.fetchone():
        print("Adding is_admin column to users table...")
        cur.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE")
        conn.commit()
    
    cur.close()
    conn.close()

# Run schema check on import
try:
    ensure_schema()
except Exception as e:
    print(f"Schema check failed: {e}")
