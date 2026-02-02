from app.repositories.component_repo import get_all_filters
import json

try:
    print("Testing get_all_filters()...")
    data = get_all_filters()
    print(f"Keys returned: {list(data.keys())}")
    for cat, filters in data.items():
        print(f"Category: {cat}, Filter keys: {list(filters.keys())}")
        for f_key, opts in filters.items():
            print(f"  - {f_key}: {len(opts)} options")
except Exception as e:
    print(f"Error: {e}")
