from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
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
from app.repositories.cpu_repo import get_all_cpus
from app.services.cpu_service import format_cpus
from app.repositories.case_repo import get_compatible_cases
from app.services.case_service import format_cases
from app.repositories.component_repo import get_components_by_category, get_filter_options, get_category_counts
from app.schemas import BuildRequest, BuildValidationResponse, PriceRequest, GalleryBuildCreate, UserCreate, UserLogin
from app.services.gallery_service import create_gallery_entry, fetch_gallery_builds, fetch_build_details, fetch_user_builds
from app.repositories.metrics_repo import get_system_metrics
from app.services.auth_service import register_user, authenticate_user
from app.repositories.admin_repo import get_incomplete_products, update_product_specs
from app.services.ai_service import generate_smart_build

import os

app = FastAPI(title="PC Forge API")

# Allow origins from environment variable or default to localhost
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/register")
def register(user: UserCreate):
    new_user = register_user(user.dict())
    if not new_user:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"message": "User registered successfully", "user": new_user}

@app.post("/api/auth/login")
def login(user: UserLogin):
    authenticated_user = authenticate_user(user.email, user.password)
    if not authenticated_user:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "message": "Login successful", 
        "user": {
            "id": authenticated_user['id'],
            "username": authenticated_user['username'], 
            "email": authenticated_user['email']
        }
    }

@app.get("/api/gallery")
def get_gallery():
    return fetch_gallery_builds()

@app.get("/api/gallery/user/{user_id}")
def get_user_builds_endpoint(user_id: int):
    return fetch_user_builds(user_id)

@app.get("/api/gallery/{build_id}")
def get_gallery_build(build_id: int):
    build = fetch_build_details(build_id)
    if not build:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Build not found")
    return build

@app.post("/api/gallery")
def save_to_gallery(build: GalleryBuildCreate):
    new_id = create_gallery_entry(build.dict())
    return {"id": new_id, "message": "Build saved to gallery"}

@app.get("/api/components")
def fetch_components(request: Request, category: str, q: str = None, sort_by: str = None, order: str = "asc"):
    # Extract arbitrary filters from query params, excluding 'category', 'q', 'sort_by', and 'order'
    filters = {}
    for key, value in request.query_params.items():
        if key not in ["category", "q", "sort_by", "order"]:
            filters[key] = value.split(",")
    
    return get_components_by_category(category, q, filters, sort_by, order)

@app.get("/api/components/filters")
def fetch_component_filters(category: str):
    return get_filter_options(category)

@app.get("/api/components/filters/all")
def fetch_all_component_filters():
    from app.repositories.component_repo import get_all_filters
    data = get_all_filters()
    return data

@app.get("/api/components/counts")
def fetch_category_counts():
    return get_category_counts()

@app.post("/api/ai/recommend")
def ai_recommend(payload: dict):
    # payload: { "prompt": "User input" }
    prompt = payload.get("prompt")
    if not prompt:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    return generate_smart_build(prompt)

@app.get("/api/cpus")
def get_cpus():
    rows = get_all_cpus()
    return {"cpus": format_cpus(rows)}

@app.get("/api/compatible/cases")
def compatible_cases(motherboard_id: str = None, gpu_id: str = None, sort_by: str = None, order: str = "asc"):
    if not motherboard_id and not gpu_id:
        rows = get_components_by_category("case", None, None, sort_by, order)
        return {
            "motherboard_id": motherboard_id,
            "gpu_id": gpu_id,
            "count": len(rows),
            "cases": rows
        }

    data = get_compatible_cases(motherboard_id, gpu_id, sort_by, order)
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
def compatible_ram(motherboard_id: str = None, sort_by: str = None, order: str = "asc"):
    if not motherboard_id:
        rows = get_components_by_category("ram", None, None, sort_by, order)
        return {
            "motherboard_id": motherboard_id,
            "count": len(rows),
            "ram": rows
        }
    data = get_compatible_ram(motherboard_id, sort_by, order)
    return {
        "motherboard_id": motherboard_id,
        "count": len(data),
        "ram": data
    }

@app.get("/api/compatible/motherboards")
def compatible_motherboards(cpu_id: str = None, sort_by: str = None, order: str = "asc"):
    if not cpu_id:
        rows = get_components_by_category("motherboard", None, None, sort_by, order)
        return {
            "cpu_id": cpu_id,
            "count": len(rows),
            "motherboards": rows
        }

    data = get_compatible_motherboards(cpu_id, sort_by, order)
    return {
        "cpu_id": cpu_id,
        "count": len(data),
        "motherboards": data
    }

@app.get("/api/compatible/gpus")
def compatible_gpus(case_id: str = None, sort_by: str = None, order: str = "asc"):
    if not case_id:
        rows = get_components_by_category("gpu", None, None, sort_by, order)
        return {
            "case_id": case_id,
            "count": len(rows),
            "gpus": rows
        }
    data = get_compatible_gpus(case_id, sort_by, order)
    return {
        "case_id": case_id,
        "count": len(data),
        "gpus": data
    }

@app.get("/api/compatible/psus")
def compatible_psus(cpu_id: str = None, gpu_id: str = None, sort_by: str = None, order: str = "asc"):
    if not cpu_id or not gpu_id:
        rows = get_components_by_category("psu", None, None, sort_by, order)
        return {
            "cpu_id": cpu_id,
            "gpu_id": gpu_id,
            "count": len(rows),
            "psus": rows
        }
    data = get_compatible_psus(cpu_id, gpu_id, sort_by, order)
    return {
        "cpu_id": cpu_id,
        "gpu_id": gpu_id,
        "count": len(data),
        "psus": data
    }

@app.get("/api/compatible/storage")
def compatible_storage(motherboard_id: str = None, sort_by: str = None, order: str = "asc"):
    if not motherboard_id:
        rows = get_components_by_category("storage", None, None, sort_by, order)
        return {
            "motherboard_id": motherboard_id,
            "count": len(rows),
            "storage": rows
        }
    data = get_compatible_storage(motherboard_id, sort_by, order)
    return {
        "motherboard_id": motherboard_id,
        "count": len(data),
        "storage": data
    }

@app.post("/api/build/price")

def build_price(req: PriceRequest):

    rows = get_cheapest_prices(req.product_ids)

    return format_price_summary(rows, req.product_ids)



@app.get("/api/admin/metrics")
def admin_metrics():
    return get_system_metrics()

@app.get("/api/admin/incomplete-products")
def fetch_incomplete(category: str = None):
    return get_incomplete_products(category)

@app.post("/api/admin/update-specs")
def update_specs(payload: dict):
    # payload: { product_id, category, specs: { ... } }
    success = update_product_specs(payload['product_id'], payload['category'], payload['specs'])
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Failed to update specs")
    return {"message": "Specs updated successfully"}

@app.get("/api/admin/category-schema")
def get_category_schema(category: str):
    from app.db import get_connection
    conn = get_connection()
    cur = conn.cursor()
    
    table_map = {
        "cpu": "cpu_specs",
        "gpu": "gpu_specs",
        "motherboard": "motherboard_specs",
        "psu": "psu_specs",
        "ram": "ram_specs",
        "storage": "storage_specs",
        "case": "case_specs"
    }
    
    if category not in table_map:
        return []
        
    cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_map[category]}' AND column_name NOT IN ('id', 'product_id')")
    cols = [{"name": r[0], "type": r[1]} for r in cur.fetchall()]
    
    cur.close()
    conn.close()
    return cols
