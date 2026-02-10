from app.db import get_connection
import psycopg2.extras

def get_system_metrics():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # 1. Category Distribution
    cur.execute("""
        SELECT category, COUNT(*) as total 
        FROM products 
        GROUP BY category 
        ORDER BY total DESC;
    """)
    category_counts = [dict(row) for row in cur.fetchall()]
    
    # 2. Total Builds
    cur.execute("SELECT COUNT(*) FROM gallery_builds;")
    total_builds = cur.fetchone()[0]
    
    # 3. Vendor Coverage
    cur.execute("SELECT COUNT(DISTINCT vendor) FROM vendor_prices;")
    total_vendors = cur.fetchone()[0]
    
    # 4. Total Products
    cur.execute("SELECT COUNT(*) FROM products;")
    total_products = cur.fetchone()[0]

    # 5. Total Users
    cur.execute("SELECT COUNT(*) FROM users;")
    total_users = cur.fetchone()[0]

    # 6. Latest Builds
    cur.execute("""
        SELECT title, user_name, total_price_pkr, created_at 
        FROM gallery_builds 
        ORDER BY created_at DESC 
        LIMIT 5;
    """)
    recent_activity = [dict(row) for row in cur.fetchall()]

    # 7. Recent User Signups
    cur.execute("""
        SELECT username, email, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5;
    """)
    recent_users = [dict(row) for row in cur.fetchall()]

    cur.close()
    conn.close()
    
    return {
        "category_distribution": category_counts,
        "stats": {
            "total_products": total_products,
            "total_builds": total_builds,
            "total_users": total_users,
            "active_vendors": total_vendors
        },
        "recent_activity": recent_activity,
        "recent_users": recent_users
    }
