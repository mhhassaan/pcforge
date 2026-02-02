from app.db import get_connection
import psycopg2.extras

def get_compatible_psus(cpu_id: str, gpu_id: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    sql = """
    SELECT
      prod.product_id,
      prod.product_name,
      prod.manufacturer,
      prod.category,
      v.price as price_pkr,
      p.*
    FROM psu_specs p
    JOIN products prod ON p.product_id = prod.product_id
    JOIN cpu_specs c ON c.product_id = %s
    JOIN gpu_specs g ON g.product_id = %s
    LEFT JOIN (
        SELECT DISTINCT ON (product_id) product_id, price
        FROM vendor_prices
        ORDER BY product_id, price ASC
    ) v ON p.product_id = v.product_id
    WHERE p.wattage >= (c.tdp_watts + g.tdp_watts + 100)
      AND p.pcie_6_plus_2_pin >= g.pcie_8_pin
      AND p.pcie_12vhpwr >= g.pcie_12vhpwr;
    """

    cur.execute(sql, (cpu_id, gpu_id))
    rows = cur.fetchall()

    results = []
    for row in rows:
        spec_data = {}
        row_dict = dict(row)
        base_fields = ["product_id", "product_name", "manufacturer", "category", "price_pkr"]
        for key, value in row_dict.items():
            if key not in base_fields:
                spec_data[key] = value

        results.append({
            "product_id": row["product_id"],
            "product_name": row["product_name"],
            "manufacturer": row["manufacturer"],
            "category": row["category"],
            "price_pkr": row["price_pkr"],
            "specs": spec_data
        })

    cur.close()
    conn.close()

    return results
