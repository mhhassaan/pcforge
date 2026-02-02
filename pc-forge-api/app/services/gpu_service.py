def format_gpus(rows):
    return [
        {
            "product_id": r[0],
            "product_name": r[1],
            "chipset_manufacturer": r[2],
            "chipset": r[3],
            "vram_gb": r[4],
            "length_mm": r[5],
            "slot_width": r[6],
            "price_pkr": r[7],
            "category": r[8],
        }
        for r in rows
    ]
