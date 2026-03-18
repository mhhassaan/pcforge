from app.db import get_connection
import psycopg2.extras

def save_build(build_data: dict):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
    INSERT INTO gallery_builds (
        title, description, cpu_id, motherboard_id, ram_id, 
        gpu_id, psu_id, case_id, storage_id, user_id, session_id, is_public, total_price_pkr
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id, share_id;
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
        build_data.get('user_id'),
        build_data.get('session_id'),
        build_data.get('is_public', False),
        build_data.get('total_price_pkr')
    ))
    
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return {"id": row[0], "share_id": str(row[1])}

def update_build(build_id: int, build_data: dict):
    conn = get_connection()
    cur = conn.cursor()
    
    sql = """
    UPDATE gallery_builds
    SET 
        title = %s,
        description = %s,
        cpu_id = %s,
        motherboard_id = %s,
        ram_id = %s,
        gpu_id = %s,
        psu_id = %s,
        case_id = %s,
        storage_id = %s,
        total_price_pkr = %s,
        is_public = %s
    WHERE id = %s;
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
        build_data.get('total_price_pkr'),
        build_data.get('is_public', False),
        build_id
    ))
    
    conn.commit()
    cur.close()
    conn.close()
    return True

def delete_build(build_id: int):
    conn = get_connection()
    cur = conn.cursor()
    
    # Due to CASCADE on build_versions, versions will also be deleted
    sql = "DELETE FROM gallery_builds WHERE id = %s;"
    cur.execute(sql, (build_id,))
    
    conn.commit()
    cur.close()
    conn.close()
    return True

def get_builds_by_user_id(user_id: int):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
    SELECT 
        g.*,
        u.username as user_name,
        p_cpu.product_name as cpu_name,
        p_gpu.product_name as gpu_name,
        p_case.product_name as case_name
    FROM gallery_builds g
    LEFT JOIN users u ON g.user_id = u.id
    LEFT JOIN products p_cpu ON g.cpu_id = p_cpu.product_id
    LEFT JOIN products p_gpu ON g.gpu_id = p_gpu.product_id
    LEFT JOIN products p_case ON g.case_id = p_case.product_id
    WHERE g.user_id = %s AND g.is_public = FALSE
    ORDER BY g.created_at DESC;
    """
    
    cur.execute(sql, (user_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [dict(row) for row in rows]

def get_builds_by_session_id(session_id: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
    SELECT 
        g.*,
        'Anonymous' as user_name,
        p_cpu.product_name as cpu_name,
        p_gpu.product_name as gpu_name,
        p_case.product_name as case_name
    FROM gallery_builds g
    LEFT JOIN products p_cpu ON g.cpu_id = p_cpu.product_id
    LEFT JOIN products p_gpu ON g.gpu_id = p_gpu.product_id
    LEFT JOIN products p_case ON g.case_id = p_case.product_id
    WHERE g.session_id = %s AND g.user_id IS NULL AND g.is_public = FALSE
    ORDER BY g.created_at DESC;
    """
    
    cur.execute(sql, (session_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [dict(row) for row in rows]

def migrate_anonymous_builds(session_id: str, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    
    sql = """
    UPDATE gallery_builds
    SET user_id = %s, session_id = NULL
    WHERE session_id = %s AND user_id IS NULL;
    """
    
    cur.execute(sql, (user_id, session_id))
    conn.commit()
    cur.close()
    conn.close()
    return True

def get_all_builds():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # We want to fetch only PUBLIC builds
    sql = """
    SELECT 
        g.*,
        COALESCE(u.username, 'Anonymous') as user_name,
        p_cpu.product_name as cpu_name,
        p_gpu.product_name as gpu_name,
        p_case.product_name as case_name
    FROM gallery_builds g
    LEFT JOIN users u ON g.user_id = u.id
    LEFT JOIN products p_cpu ON g.cpu_id = p_cpu.product_id
    LEFT JOIN products p_gpu ON g.gpu_id = p_gpu.product_id
    LEFT JOIN products p_case ON g.case_id = p_case.product_id
    WHERE g.is_public = TRUE
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
        COALESCE(u.username, 'Anonymous') as user_name,
        p_cpu.product_name as cpu_name,
        p_mb.product_name as motherboard_name,
        p_ram.product_name as ram_name,
        p_gpu.product_name as gpu_name,
        p_psu.product_name as psu_name,
        p_case.product_name as case_name,
        p_storage.product_name as storage_name
    FROM gallery_builds g
    LEFT JOIN users u ON g.user_id = u.id
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

def get_build_by_share_id(share_id: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
    SELECT 
        g.*,
        u.username as user_name,
        p_cpu.product_name as cpu_name,
        p_gpu.product_name as gpu_name,
        p_case.product_name as case_name,
        p_mb.product_name as motherboard_name,
        p_ram.product_name as ram_name,
        p_psu.product_name as psu_name,
        p_storage.product_name as storage_name
    FROM gallery_builds g
    LEFT JOIN users u ON g.user_id = u.id
    LEFT JOIN products p_cpu ON g.cpu_id = p_cpu.product_id
    LEFT JOIN products p_gpu ON g.gpu_id = p_gpu.product_id
    LEFT JOIN products p_case ON g.case_id = p_case.product_id
    LEFT JOIN products p_mb ON g.motherboard_id = p_mb.product_id
    LEFT JOIN products p_ram ON g.ram_id = p_ram.product_id
    LEFT JOIN products p_psu ON g.psu_id = p_psu.product_id
    LEFT JOIN products p_storage ON g.storage_id = p_storage.product_id
    WHERE g.share_id = %s;
    """
    
    cur.execute(sql, (share_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return dict(row) if row else None
