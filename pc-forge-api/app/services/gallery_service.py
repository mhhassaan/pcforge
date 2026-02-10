from app.repositories.gallery_repo import save_build, get_all_builds, get_build_by_id

def create_gallery_entry(data: dict):
    # Any business logic/validation before saving
    return save_build(data)

def fetch_gallery_builds():
    builds = get_all_builds()
    # Format or filter if needed
    for b in builds:
        if b['total_price_pkr']:
            b['total_price_pkr'] = float(b['total_price_pkr'])
    return builds

def fetch_build_details(build_id: int):
    build = get_build_by_id(build_id)
    if build and build['total_price_pkr']:
        build['total_price_pkr'] = float(build['total_price_pkr'])
    return build
