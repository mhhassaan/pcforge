def format_cases(rows):
    cases = []
    for row in rows:
        cases.append({
            "product_id": row[0],
            "product_name": row[1],
            "case_form_factor": row[2],
            "side_panel_window": row[3],
            "max_gpu_length_mm": row[4],
            "price_pkr": row[5]
        })
    return cases
