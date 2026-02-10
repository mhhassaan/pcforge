from app.db import get_connection
import psycopg2.extras

def save_build(build_data: dict):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
    INSERT INTO gallery_builds (
        title, description, cpu_id, motherboard_id, ram_id, 
        gpu_id, psu_id, case_id, storage_id, user_name, total_price_pkr
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id;
    """
    
    cur.execute(sql, (
        build_data.get('title'),
        build_data.get('description'),
        build_data.get('cpu_id'),
        build_data.get('motherboard_id'),
        build_data.get('ram_id'),
        build_data.get('gpu_id'),
        build_data.get('psu_id'),
        build_data.get('case_id'),
        build_data.get('storage_id'),
        build_data.get('user_name'),
        build_data.get('total_price_pkr')
    ))
    
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return new_id

def get_all_builds():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # We want to fetch the builds along with some product info for display
    sql = """
    SELECT 
        g.*,
        p_cpu.product_name as cpu_name,
        p_gpu.product_name as gpu_name,
        p_case.product_name as case_name
    FROM gallery_builds g
    LEFT JOIN products p_cpu ON g.cpu_id = p_cpu.product_id
    LEFT JOIN products p_gpu ON g.gpu_id = p_gpu.product_id
    LEFT JOIN products p_case ON g.case_id = p_case.product_id
    ORDER BY g.created_at DESC;
    """
    
    cur.execute(sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [dict(row) for row in rows]

def get_build_by_id(build_id: int):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
    SELECT 
        g.*,
        p_cpu.product_name as cpu_name,
        p_mb.product_name as motherboard_name,
        p_ram.product_name as ram_name,
        p_gpu.product_name as gpu_name,
        p_psu.product_name as psu_name,
        p_case.product_name as case_name,
        p_storage.product_name as storage_name
    FROM gallery_builds g
    LEFT JOIN products p_cpu ON g.cpu_id = p_cpu.product_id
    LEFT JOIN products p_mb ON g.motherboard_id = p_mb.product_id
    LEFT JOIN products p_ram ON g.ram_id = p_ram.product_id
    LEFT JOIN products p_gpu ON g.gpu_id = p_gpu.product_id
    LEFT JOIN products p_psu ON g.psu_id = p_psu.product_id
    LEFT JOIN products p_case ON g.case_id = p_case.product_id
    LEFT JOIN products p_storage ON g.storage_id = p_storage.product_id
    WHERE g.id = %s;
    """
    
    cur.execute(sql, (build_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return dict(row) if row else None
