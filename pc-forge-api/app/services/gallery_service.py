from app.repositories.gallery_repo import (
    save_build, get_all_builds, get_build_by_id, 
    get_builds_by_user_id, get_builds_by_session_id, migrate_anonymous_builds, update_build, get_build_by_share_id, delete_build
)

def create_gallery_entry(data: dict):
    # Any business logic/validation before saving
    return save_build(data)

def modify_gallery_entry(build_id: int, data: dict):
    return update_build(build_id, data)

def remove_gallery_entry(build_id: int):
    return delete_build(build_id)

def fetch_gallery_builds():
    builds = get_all_builds()
    # Format or filter if needed
    for b in builds:
        if b['total_price_pkr']:
            b['total_price_pkr'] = float(b['total_price_pkr'])
    return builds

def fetch_user_builds(user_id: int):
    builds = get_builds_by_user_id(user_id)
    for b in builds:
        if b['total_price_pkr']:
            b['total_price_pkr'] = float(b['total_price_pkr'])
    return builds

def fetch_session_builds(session_id: str):
    builds = get_builds_by_session_id(session_id)
    for b in builds:
        if b['total_price_pkr']:
            b['total_price_pkr'] = float(b['total_price_pkr'])
    return builds

def transfer_anonymous_builds(session_id: str, user_id: int):
    return migrate_anonymous_builds(session_id, user_id)

def fetch_build_details(build_id: int):
    build = get_build_by_id(build_id)
    if build and build['total_price_pkr']:
        build['total_price_pkr'] = float(build['total_price_pkr'])
    return build

def fetch_build_by_share_id(share_id: str):
    build = get_build_by_share_id(share_id)
    if build and build['total_price_pkr']:
        build['total_price_pkr'] = float(build['total_price_pkr'])
    return build
