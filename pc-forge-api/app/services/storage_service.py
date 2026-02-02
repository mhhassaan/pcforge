def format_storage(rows):
    return [
        {
            "product_id": r[0],
            "product_name": r[1],
            "type": r[2],
            "capacity_gb": r[3],
            "form_factor": r[4],
            "interface": r[5],
            "nvme": r[6],
            "price_pkr": r[7],
            "category": r[8],
        }
        for r in rows
    ]
