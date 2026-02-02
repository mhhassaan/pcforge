def build_validation_result(db_result):
    checks = {
        "cpu_mb": db_result[0],
        "ram_mb": db_result[1],
        "gpu_case": db_result[2],
        "mb_case": db_result[3],
        "psu_wattage": db_result[4],
        "psu_gpu_power": db_result[5],
        "storage": db_result[6],
    }

    errors = []

    if not checks["cpu_mb"]:
        errors.append("CPU socket does not match motherboard socket")

    if not checks["ram_mb"]:
        errors.append("RAM is not compatible with the selected motherboard")

    if not checks["gpu_case"]:
        errors.append("GPU does not fit inside the selected case")

    if not checks["psu_wattage"]:
        errors.append("PSU wattage is insufficient")

    if not checks["psu_gpu_power"]:
        errors.append("PSU does not have required GPU power connectors")

    if not checks["storage"]:
        errors.append("Storage device is not compatible with motherboard")

    return {
        "valid": len(errors) == 0,
        "checks": checks,
        "errors": errors
    }
