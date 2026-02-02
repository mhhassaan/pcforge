def format_motherboards(rows):
    return [
        {
            "product_id": r[0],
            "product_name": r[1],
            "socket": r[2],
            "chipset": r[3],
            "form_factor": r[4],
            "ram_type": r[5],
            "max_ram_gb": r[6],
            "ram_slots": r[7],
            "price_pkr": r[8],
            "category": r[9],
        }
        for r in rows
    ]
