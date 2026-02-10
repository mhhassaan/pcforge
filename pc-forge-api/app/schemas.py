from pydantic import BaseModel

class BuildRequest(BaseModel):
    cpu_id: str
    motherboard_id: str
    ram_id: str
    gpu_id: str
    psu_id: str
    case_id: str
    storage_id: str

class GalleryBuildCreate(BaseModel):
    title: str
    description: str | None = None
    cpu_id: str
    motherboard_id: str
    ram_id: str
    gpu_id: str
    psu_id: str
    case_id: str
    storage_id: str
    user_name: str | None = "Anonymous"
    user_id: int | None = None
    total_price_pkr: float | None = 0

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class BuildValidationResponse(BaseModel):
    valid: bool
    checks: dict
    errors: list[str]

class PriceRequest(BaseModel):
    product_ids: list[str]
