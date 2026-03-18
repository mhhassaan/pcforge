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

def format_merchant_prices(rows):
    vendors = {}
    for r in rows:
        vendor_name = r[2]
        price = float(r[3]) if r[3] is not None else 0
        
        if vendor_name not in vendors:
            vendors[vendor_name] = {
                "name": vendor_name,
                "items": [],
                "subtotal": 0,
                "item_count": 0
            }
        
        vendors[vendor_name]["items"].append({
            "product_id": r[0],
            "product_name": r[1],
            "price": price,
            "url": r[4],
            "category": r[5]
        })
        vendors[vendor_name]["subtotal"] += price
        vendors[vendor_name]["item_count"] += 1
        
    return list(vendors.values())
