def format_cpus(rows):
    cpus = []
    for row in rows:
        cpus.append({
            "product_id": row[0],
            "product_name": row[1],
            "manufacturer": row[2],
            "price_pkr": row[3]
        })
    return cpus
