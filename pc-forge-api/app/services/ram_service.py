def format_ram_list(rows):
    return [
        {
            "product_id": r[0],
            "product_name": r[1],
            "ram_type": r[2],
            "capacity_gb": r[3],
            "modules": r[4],
            "speed_mhz": r[5],
            "cas_latency": r[6],
            "price_pkr": r[7],
            "category": r[8],
        }
        for r in rows
    ]
