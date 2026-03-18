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
from app.repositories.price_repo import get_cheapest_prices, get_all_vendor_prices
from app.services.price_service import format_price_summary, format_merchant_prices
from app.repositories.cpu_repo import get_all_cpus
from app.services.cpu_service import format_cpus
from app.repositories.case_repo import get_compatible_cases
from app.services.case_service import format_cases
from app.repositories.component_repo import get_components_by_category, get_filter_options, get_category_counts
from app.schemas import BuildRequest, BuildValidationResponse, PriceRequest, GalleryBuildCreate, UserCreate, UserLogin, BuildVersionCreate
from app.services.gallery_service import create_gallery_entry, modify_gallery_entry, fetch_gallery_builds, fetch_build_details, fetch_user_builds, fetch_session_builds, transfer_anonymous_builds, fetch_build_by_share_id, remove_gallery_entry
from app.services.version_service import save_build_version, fetch_build_timeline, fetch_version_diff
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
    
    # Migrate anonymous builds if session_id is provided
    if user.session_id:
        transfer_anonymous_builds(user.session_id, authenticated_user['id'])
        
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

@app.get("/api/gallery/session/{session_id}")
def get_session_builds_endpoint(session_id: str):
    return fetch_session_builds(session_id)

@app.get("/api/gallery/{build_id}")
def get_gallery_build(build_id: int):
    build = fetch_build_details(build_id)
    if not build:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Build not found")
    return build

@app.get("/api/gallery/share/{share_id}")
def get_shared_build(share_id: str):
    build = fetch_build_by_share_id(share_id)
    if not build:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Build not found")
    return build

@app.delete("/api/gallery/{build_id}")
def delete_gallery_build(build_id: int):
    success = remove_gallery_entry(build_id)
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Failed to delete build")
    return {"message": "Build deleted successfully"}

@app.post("/api/gallery")
def save_to_gallery(build: GalleryBuildCreate):
    result = create_gallery_entry(build.dict())
    new_id = result['id']
    share_id = result['share_id']
    
    # Save initial version if label is provided or automatically
    build_data_for_version = {
        "cpu": build.cpu_id,
        "motherboard": build.motherboard_id,
        "ram": build.ram_id,
        "gpu": build.gpu_id,
        "psu": build.psu_id,
        "case": build.case_id,
        "storage": build.storage_id
    }
    save_build_version(new_id, build_data_for_version, build.version_label or "Initial build")
    
    return {"id": new_id, "share_id": share_id, "message": "Build saved to gallery"}

@app.put("/api/gallery/{build_id}")
def update_gallery_build(build_id: int, build: GalleryBuildCreate):
    success = modify_gallery_entry(build_id, build.dict())
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Failed to update build")
    
    # Save new version when updating
    build_data_for_version = {
        "cpu": build.cpu_id,
        "motherboard": build.motherboard_id,
        "ram": build.ram_id,
        "gpu": build.gpu_id,
        "psu": build.psu_id,
        "case": build.case_id,
        "storage": build.storage_id
    }
    save_build_version(build_id, build_data_for_version, build.version_label or f"Update v{build_id}")
    
    return {"message": "Build updated and new version recorded"}

@app.post("/api/build/{build_id}/version")
def add_build_version(build_id: int, version: BuildVersionCreate):
    version_id = save_build_version(build_id, version.build_data, version.label)
    return {"version_id": version_id, "message": "Version created successfully"}

@app.get("/api/build/{build_id}/timeline")
def get_timeline(build_id: int):
    return fetch_build_timeline(build_id)

@app.get("/api/build/{build_id}/diff")
def get_version_diff(build_id: int, v1: int, v2: int):
    return fetch_version_diff(build_id, v1, v2)

@app.get("/api/components/{product_id}")
def fetch_component_by_id(product_id: str):
    from app.repositories.component_repo import get_component_details
    comp = get_component_details(product_id)
    if not comp:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Component not found")
    return comp

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

@app.post("/api/build/merchant-prices")
def merchant_prices(req: PriceRequest):
    rows = get_all_vendor_prices(req.product_ids)
    return format_merchant_prices(rows)



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
