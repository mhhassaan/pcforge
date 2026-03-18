from app.repositories.version_repo import create_build_version, get_build_timeline, diff_versions

def save_build_version(build_id: int, build_data: dict, label: str = None):
    return create_build_version(build_id, build_data, label)

def fetch_build_timeline(build_id: int):
    return get_build_timeline(build_id)

def fetch_version_diff(build_id: int, v1: int, v2: int):
    return diff_versions(build_id, v1, v2)
