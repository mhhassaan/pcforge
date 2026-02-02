from pydantic import BaseModel

class BuildRequest(BaseModel):
    cpu_id: str
    motherboard_id: str
    ram_id: str
    gpu_id: str
    psu_id: str
    case_id: str
    storage_id: str


class BuildValidationResponse(BaseModel):
    valid: bool
    checks: dict
    errors: list[str]

class PriceRequest(BaseModel):
    product_ids: list[str]
