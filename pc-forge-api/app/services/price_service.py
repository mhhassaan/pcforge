def format_price_summary(rows, product_ids):
    price_map = {
        r[0]: {
            "product_name": r[1],
            "vendor": r[2],
            "price": r[3],
            "url": r[4],
        }
        for r in rows
    }

    items = []
    total = 0
    missing = []

    for pid in product_ids:
        if pid in price_map:
            total += price_map[pid]["price"]
            items.append({
                "product_id": pid,
                **price_map[pid]
            })
        else:
            missing.append(pid)

    return {
        "items": items,
        "total_price": total,
        "missing_prices": missing
    }
