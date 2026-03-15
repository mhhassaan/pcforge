import os
import json
import re
from openai import OpenAI
from app.repositories.component_repo import get_components_by_category
from app.repositories.cpu_repo import get_all_cpus
from app.repositories.motherboard_repo import get_compatible_motherboards
from app.repositories.ram_repo import get_compatible_ram
from app.repositories.gpu_repo import get_compatible_gpus
from app.repositories.psu_repo import get_compatible_psus
from app.repositories.storage_repo import get_compatible_storage
from app.repositories.case_repo import get_compatible_cases

def parse_prompt(prompt: str):
    """
    Step 1: AI Prompt Parser
    Only use AI to extract structured intent from the user's natural language.
    """
    client = OpenAI(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url="https://api.deepseek.com"
    )

    system_prompt = """
    Extract structured data from the user's PC build request.
    Return ONLY a JSON object with:
    - budget: integer (in PKR, default to 150000 if not specified)
    - purpose: string (gaming, productivity, workstation, budget)
    - resolution: string (1080p, 1440p, 4k)
    - priority: string (performance, aesthetics, silence, value)
    
    If the user mentions a specific brand (Intel, AMD, NVIDIA), include it in 'purpose' or a new 'preferred_brands' list.
    """

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Prompt parsing failed: {e}")
        # Fallback to defaults
        return {"budget": 150000, "purpose": "gaming", "resolution": "1080p", "priority": "performance"}

def select_best_within_budget(items, budget_limit, price_key="price_pkr", id_key="product_id"):
    """
    Helper to safely select the best item within budget or the cheapest if none fit.
    """
    if not items:
        return None
    
    # Filter items that have a price
    valid_items = [item for item in items if item.get(price_key) is not None]
    if not valid_items:
        return None

    # Try to find items within budget
    in_budget = [item for item in valid_items if item[price_key] <= budget_limit]
    
    if in_budget:
        # Sort by price descending to get the 'best' (most expensive) within this bracket
        return sorted(in_budget, key=lambda x: x[price_key], reverse=True)[0]
    else:
        # Fallback: Cheapest available
        return sorted(valid_items, key=lambda x: x[price_key])[0]

def generate_smart_build(prompt: str):
    # 1. Parse intent
    intent = parse_prompt(prompt)
    budget = intent.get("budget", 150000)
    
    # 2. Budget Allocation (Deterministic)
    alloc = {
        "gpu": budget * 0.35,
        "cpu": budget * 0.20,
        "motherboard": budget * 0.12,
        "ram": budget * 0.08,
        "storage": budget * 0.08,
        "psu": budget * 0.07,
        "case": budget * 0.10
    }

    build = {}
    explanation = []
    selected_objs = {}

    # A. Select CPU
    all_cpus = get_all_cpus()
    # CPU repo returns tuples (id, name, manufacturer, price)
    cpu_list = [{"product_id": c[0], "product_name": c[1], "price_pkr": c[3]} for c in all_cpus]
    selected_objs["cpu"] = select_best_within_budget(cpu_list, alloc["cpu"])
    
    if not selected_objs["cpu"]:
        return {"error": "No CPUs found in database"}
        
    build["cpu"] = selected_objs["cpu"]["product_id"]
    explanation.append(f"Selected {selected_objs['cpu']['product_name']} (Rs. {selected_objs['cpu']['price_pkr']:,.0f})")

    # B. Select Motherboard
    mbs = get_compatible_motherboards(build["cpu"])
    selected_objs["motherboard"] = select_best_within_budget(mbs, alloc["motherboard"])
    if not selected_objs["motherboard"]:
        return {"error": "No compatible motherboards found"}
    
    build["motherboard"] = selected_objs["motherboard"]["product_id"]
    explanation.append(f"Paired with {selected_objs['motherboard']['product_name']} (Rs. {selected_objs['motherboard']['price_pkr']:,.0f})")

    # C. Select RAM
    rams = get_compatible_ram(build["motherboard"])
    selected_objs["ram"] = select_best_within_budget(rams, alloc["ram"])
    if not selected_objs["ram"]:
        # Broad fallback if compatibility filter returns nothing
        all_rams = get_components_by_category("ram")
        selected_objs["ram"] = select_best_within_budget(all_rams, alloc["ram"], price_key="price_pkr", id_key="id")
        if selected_objs["ram"]:
             selected_objs["ram"]["product_id"] = selected_objs["ram"]["id"]
             selected_objs["ram"]["product_name"] = selected_objs["ram"]["name"]

    if not selected_objs["ram"]:
        return {"error": "No RAM found"}

    build["ram"] = selected_objs["ram"]["product_id"]
    explanation.append(f"Added {selected_objs['ram']['product_name']} (Rs. {selected_objs['ram']['price_pkr']:,.0f})")

    # D. Select GPU
    gpus = get_components_by_category("gpu")
    gpu_list = [{"product_id": g["id"], "product_name": g["name"], "price_pkr": g["price_pkr"]} for g in gpus]
    selected_objs["gpu"] = select_best_within_budget(gpu_list, alloc["gpu"])
    if not selected_objs["gpu"]:
        return {"error": "No GPUs found"}
        
    build["gpu"] = selected_objs["gpu"]["product_id"]
    explanation.append(f"Graphics handled by {selected_objs['gpu']['product_name']} (Rs. {selected_objs['gpu']['price_pkr']:,.0f})")

    # E. Select Storage
    stors = get_compatible_storage(build["motherboard"])
    selected_objs["storage"] = select_best_within_budget(stors, alloc["storage"])
    if not selected_objs["storage"]:
        all_stors = get_components_by_category("storage")
        selected_objs["storage"] = select_best_within_budget(all_stors, alloc["storage"], price_key="price_pkr", id_key="id")
        if selected_objs["storage"]:
            selected_objs["storage"]["product_id"] = selected_objs["storage"]["id"]
            selected_objs["storage"]["product_name"] = selected_objs["storage"]["name"]

    if not selected_objs["storage"]:
        return {"error": "No storage found"}

    build["storage"] = selected_objs["storage"]["product_id"]
    explanation.append(f"Fast storage: {selected_objs['storage']['product_name']} (Rs. {selected_objs['storage']['price_pkr']:,.0f})")

    # F. Select PSU
    psus = get_compatible_psus(build["cpu"], build["gpu"])
    selected_objs["psu"] = select_best_within_budget(psus, alloc["psu"])
    if not selected_objs["psu"]:
        # Fallback to broad psu list
        all_psus = get_components_by_category("psu")
        selected_objs["psu"] = select_best_within_budget(all_psus, alloc["psu"], price_key="price_pkr", id_key="id")
        if selected_objs["psu"]:
            selected_objs["psu"]["product_id"] = selected_objs["psu"]["id"]
            selected_objs["psu"]["product_name"] = selected_objs["psu"]["name"]

    if not selected_objs["psu"]:
        return {"error": "No PSU found"}

    build["psu"] = selected_objs["psu"]["product_id"]
    explanation.append(f"Powered by {selected_objs['psu']['product_name']} (Rs. {selected_objs['psu']['price_pkr']:,.0f})")

    # G. Select Case
    cases = get_compatible_cases(build["motherboard"], build["gpu"])
    selected_objs["case"] = select_best_within_budget(cases, alloc["case"])
    if not selected_objs["case"]:
        all_cases = get_components_by_category("case")
        selected_objs["case"] = select_best_within_budget(all_cases, alloc["case"], price_key="price_pkr", id_key="id")
        if selected_objs["case"]:
            selected_objs["case"]["product_id"] = selected_objs["case"]["id"]
            selected_objs["case"]["product_name"] = selected_objs["case"]["name"]

    if not selected_objs["case"]:
        return {"error": "No case found"}

    build["case"] = selected_objs["case"]["product_id"]
    explanation.append(f"Housed in {selected_objs['case']['product_name']} (Rs. {selected_objs['case']['price_pkr']:,.0f})")

    # 4. Final Totals
    total_price = sum(obj["price_pkr"] for obj in selected_objs.values() if obj)

    return {
        "explanation": " ".join(explanation) + f" Total build cost: Rs. {total_price:,.0f}.",
        "total_price": float(total_price),
        "components": build,
        "intent": intent
    }
