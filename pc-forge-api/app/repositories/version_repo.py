from app.db import get_connection
import psycopg2.extras
import json

def get_latest_version_number(build_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT MAX(version_number) FROM build_versions WHERE build_id = %s", (build_id,))
    max_ver = cur.fetchone()[0]
    cur.close()
    conn.close()
    return max_ver or 0

def create_build_version(build_id: int, build_data: dict, label: str = None):
    version_number = get_latest_version_number(build_id) + 1
    
    conn = get_connection()
    cur = conn.cursor()
    
    sql = """
    INSERT INTO build_versions (build_id, version_number, build_data, label)
    VALUES (%s, %s, %s, %s)
    RETURNING version_id;
    """
    
    cur.execute(sql, (build_id, version_number, json.dumps(build_data), label))
    version_id = cur.fetchone()[0]
    
    conn.commit()
    cur.close()
    conn.close()
    return version_id

def get_build_timeline(build_id: int):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
    SELECT version_id, version_number, label, created_at
    FROM build_versions
    WHERE build_id = %s
    ORDER BY created_at ASC;
    """
    
    cur.execute(sql, (build_id,))
    rows = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return [dict(row) for row in rows]

def get_version_data(build_id: int, version_number: int):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
    SELECT build_data
    FROM build_versions
    WHERE build_id = %s AND version_number = %s;
    """
    
    cur.execute(sql, (build_id, version_number))
    row = cur.fetchone()
    
    cur.close()
    conn.close()
    
    return row['build_data'] if row else None

def resolve_product_names(product_ids):
    if not product_ids:
        return {}
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Filter out None and handle list for IN clause
    valid_ids = [pid for pid in product_ids if pid]
    if not valid_ids:
        return {}
        
    sql = "SELECT product_id, product_name FROM products WHERE product_id IN %s"
    cur.execute(sql, (tuple(valid_ids),))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return {row['product_id']: row['product_name'] for row in rows}

def diff_versions(build_id: int, v1: int, v2: int):
    data1 = get_version_data(build_id, v1)
    data2 = get_version_data(build_id, v2)
    
    if not data1 or not data2:
        return {"error": "One or both versions not found"}
        
    # Collect all product IDs to resolve names in one go
    all_pids = set()
    for pid in data1.values(): all_pids.add(pid)
    for pid in data2.values(): all_pids.add(pid)
    
    names_map = resolve_product_names(list(all_pids))
    
    diff = {}
    for component in data1:
        if data1[component] != data2.get(component):
            old_id = data1[component]
            new_id = data2.get(component)
            diff[component] = {
                "old": names_map.get(old_id, old_id) if old_id else None,
                "new": names_map.get(new_id, new_id) if new_id else None
            }
            
    # Check for keys in v2 that aren't in v1
    for component in data2:
        if component not in data1:
            new_id = data2[component]
            diff[component] = {
                "old": None,
                "new": names_map.get(new_id, new_id) if new_id else None
            }
            
    return diff
