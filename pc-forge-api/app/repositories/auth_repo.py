from app.db import get_connection
import psycopg2.extras

def create_user(user_data):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        sql = """
        INSERT INTO users (username, email, hashed_password)
        VALUES (%s, %s, %s)
        RETURNING id, username, email;
        """
        cur.execute(sql, (
            user_data['username'],
            user_data['email'],
            user_data['hashed_password']
        ))
        user = cur.fetchone()
        conn.commit()
        return dict(user)
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def get_user_by_email(email):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = "SELECT * FROM users WHERE email = %s;"
    cur.execute(sql, (email,))
    user = cur.fetchone()
    
    cur.close()
    conn.close()
    return dict(user) if user else None
