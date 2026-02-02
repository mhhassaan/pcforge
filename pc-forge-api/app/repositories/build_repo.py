from app.db import get_connection

def validate_build(build):
    conn = get_connection()
    cur = conn.cursor()

    sql = """
    SELECT
      (cpu.socket = mb.socket) AS cpu_mb_compatible,
      (ram.ram_type = mb.ram_type
       AND ram.total_capacity_gb <= mb.max_ram_gb
       AND ram.module_count <= mb.ram_slots) AS ram_mb_compatible,
      (gpu.length_mm <= c.max_gpu_length_mm) AS gpu_case_compatible,
      (mb.form_factor = ANY(c.supported_motherboard_form_factors)) AS mb_case_compatible,
      (psu.wattage >= (cpu.tdp_watts + gpu.tdp_watts + 100)) AS psu_wattage_ok,
      (psu.pcie_6_plus_2_pin >= gpu.pcie_8_pin
       AND psu.pcie_12vhpwr >= gpu.pcie_12vhpwr) AS psu_gpu_power_ok,
      (
        (ssd.nvme = true AND mb.m2_slots > 0)
        OR
        (ssd.nvme = false AND mb.sata_6gb_ports > 0)
      ) AS storage_compatible
    FROM cpu_specs cpu
    JOIN motherboard_specs mb ON mb.product_id = %s
    JOIN ram_specs ram ON ram.product_id = %s
    JOIN gpu_specs gpu ON gpu.product_id = %s
    JOIN psu_specs psu ON psu.product_id = %s
    JOIN case_specs c ON c.product_id = %s
    JOIN storage_specs ssd ON ssd.product_id = %s
    WHERE cpu.product_id = %s;
    """

    cur.execute(sql, (
        build.motherboard_id,
        build.ram_id,
        build.gpu_id,
        build.psu_id,
        build.case_id,
        build.storage_id,
        build.cpu_id
    ))

    row = cur.fetchone()
    cur.close()
    conn.close()

    return row
