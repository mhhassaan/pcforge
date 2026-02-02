def format_psus(rows):
    return [
        {
            "product_id": r[0],
            "product_name": r[1],
            "wattage": r[2],
            "efficiency": r[3],
            "modular": r[4],
            "pcie_8_pin": r[5],
            "pcie_12vhpwr": r[6],
            "price_pkr": r[7],
            "category": r[8],
        }
        for r in rows
    ]
