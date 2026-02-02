from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import BuildRequest, BuildValidationResponse
from app.repositories.build_repo import validate_build
from app.services.build_validator import build_validation_result
from app.repositories.ram_repo import get_compatible_ram
from app.services.ram_service import format_ram_list
from app.repositories.motherboard_repo import get_compatible_motherboards
from app.services.motherboard_service import format_motherboards
from app.repositories.gpu_repo import get_compatible_gpus
from app.services.gpu_service import format_gpus
from app.repositories.psu_repo import get_compatible_psus
from app.services.psu_service import format_psus
from app.repositories.storage_repo import get_compatible_storage
from app.services.storage_service import format_storage
from app.repositories.price_repo import get_cheapest_prices
from app.services.price_service import format_price_summary
from app.schemas import PriceRequest
from app.repositories.cpu_repo import get_all_cpus
from app.services.cpu_service import format_cpus
from app.repositories.case_repo import get_compatible_cases
from app.services.case_service import format_cases
from app.repositories.component_repo import get_components_by_category, get_filter_options

app = FastAPI(title="PC Forge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/components")
def fetch_components(request: Request, category: str, q: str = None):
    # Extract arbitrary filters from query params, excluding 'category' and 'q'
    filters = {}
    for key, value in request.query_params.items():
        if key not in ["category", "q", "sort_by", "order"]:
            filters[key] = value.split(",")
    
    return get_components_by_category(category, q, filters)

@app.get("/api/components/filters")
def fetch_component_filters(category: str):
    return get_filter_options(category)

@app.get("/api/components/filters/all")
def fetch_all_component_filters():
    from app.repositories.component_repo import get_all_filters
    data = get_all_filters()
    return data

@app.get("/api/cpus")
def get_cpus():
    rows = get_all_cpus()
    return {"cpus": format_cpus(rows)}

@app.get("/api/compatible/cases")

def compatible_cases(motherboard_id: str = None, gpu_id: str = None):

    if not motherboard_id and not gpu_id:

        rows = get_components_by_category("case")

        return {

            "motherboard_id": motherboard_id,

            "gpu_id": gpu_id,

            "count": len(rows),

            "cases": rows

        }



        data = get_compatible_cases(motherboard_id, gpu_id)



        return {



            "motherboard_id": motherboard_id,



            "gpu_id": gpu_id,



            "count": len(data),



            "cases": data



        }

@app.post("/api/build/validate", response_model=BuildValidationResponse)
def validate_pc_build(build: BuildRequest):
    db_result = validate_build(build)

    if not db_result:
        return {
            "valid": False,
            "checks": {},
            "errors": ["Invalid product IDs provided"]
        }

    return build_validation_result(db_result)

@app.get("/api/compatible/ram")
def compatible_ram(motherboard_id: str = None):
    if not motherboard_id:
        rows = get_components_by_category("ram")
        return {
            "motherboard_id": motherboard_id,
            "count": len(rows),
            "ram": rows
        }
    data = get_compatible_ram(motherboard_id)
    return {
        "motherboard_id": motherboard_id,
        "count": len(data),
        "ram": data
    }


@app.get("/api/compatible/motherboards")


def compatible_motherboards(cpu_id: str = None):


    if not cpu_id:


        rows = get_components_by_category("motherboard")


        return {


            "cpu_id": cpu_id,


            "count": len(rows),


            "motherboards": rows


        }





    data = get_compatible_motherboards(cpu_id)


    return {


        "cpu_id": cpu_id,


        "count": len(data),


        "motherboards": data


    }

@app.get("/api/compatible/gpus")
def compatible_gpus(case_id: str = None):
    if not case_id:
        rows = get_components_by_category("gpu")
        return {
            "case_id": case_id,
            "count": len(rows),
            "gpus": rows
        }
    data = get_compatible_gpus(case_id)
    return {
        "case_id": case_id,
        "count": len(data),
        "gpus": data
    }

@app.get("/api/compatible/psus")
def compatible_psus(cpu_id: str = None, gpu_id: str = None):
    if not cpu_id or not gpu_id:
        rows = get_components_by_category("psu")
        return {
            "cpu_id": cpu_id,
            "gpu_id": gpu_id,
            "count": len(rows),
            "psus": rows
        }
    data = get_compatible_psus(cpu_id, gpu_id)
    return {
        "cpu_id": cpu_id,
        "gpu_id": gpu_id,
        "count": len(data),
        "psus": data
    }

@app.get("/api/compatible/storage")
def compatible_storage(motherboard_id: str = None):
    if not motherboard_id:
        rows = get_components_by_category("storage")
        return {
            "motherboard_id": motherboard_id,
            "count": len(rows),
            "storage": rows
        }
    data = get_compatible_storage(motherboard_id)
    return {
        "motherboard_id": motherboard_id,
        "count": len(data),
        "storage": data
    }

@app.post("/api/build/price")
def build_price(req: PriceRequest):
    rows = get_cheapest_prices(req.product_ids)
    return format_price_summary(rows, req.product_ids)