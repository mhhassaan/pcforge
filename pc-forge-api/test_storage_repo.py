from app.repositories.component_repo import get_components_by_category

def test_storage():
    print("Testing get_components_by_category('storage'):")
    results = get_components_by_category("storage")
    print(f"Count: {len(results)}")
    if results:
        print(f"First item: {results[0]['name']}")
    else:
        print("NO RESULTS for 'storage'")

    print("\nTesting get_components_by_category('ssd'):")
    results_ssd = get_components_by_category("ssd")
    print(f"Count: {len(results_ssd)}")
    if results_ssd:
        print(f"First item: {results_ssd[0]['name']}")
    else:
        print("NO RESULTS for 'ssd'")

if __name__ == '__main__':
    test_storage()
