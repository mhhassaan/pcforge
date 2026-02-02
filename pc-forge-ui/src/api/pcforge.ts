import type { CPU, Motherboard, RAM, GPU, Case, PSU, Storage, PriceResponse, Component } from "../types/pcforge";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchComponents(
  category: string, 
  query?: string,
  sortBy?: string,
  order?: string,
  extraParams?: Record<string, string>
): Promise<Component[]> {
  const url = new URL(`${API}/api/components`);
  url.searchParams.append("category", category);
  if (query) url.searchParams.append("q", query);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);

  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchFilters(category: string): Promise<Record<string, string[]>> {
  const res = await fetch(`${API}/api/components/filters?category=${category}`);
  return res.json();
}

export async function fetchAllFilters(): Promise<Record<string, Record<string, string[]>>> {
  const res = await fetch(`${API}/api/components/filters/all`);
  return res.json();
}

export async function fetchCPUs(): Promise<{ cpus: CPU[] }> {
  const res = await fetch(`${API}/api/cpus`);
  return res.json();
}

export async function fetchMotherboards(cpuId?: string | null): Promise<{ motherboards: Motherboard[] }> {
  const url = new URL(`${API}/api/compatible/motherboards`);
  if (cpuId) url.searchParams.append("cpu_id", cpuId);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchRAM(motherboardId?: string | null): Promise<{ ram: RAM[] }> {
  const url = new URL(`${API}/api/compatible/ram`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchStorage(motherboardId?: string | null): Promise<{ storage: Storage[] }> {
  const url = new URL(`${API}/api/compatible/storage`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchCases(motherboardId?: string | null, gpuId?: string | null): Promise<{ cases: Case[] }> {
  const url = new URL(`${API}/api/compatible/cases`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  if (gpuId) url.searchParams.append("gpu_id", gpuId);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchGPUs(caseId?: string | null): Promise<{ gpus: GPU[] }> {
  const url = new URL(`${API}/api/compatible/gpus`);
  if (caseId) url.searchParams.append("case_id", caseId);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchPSUs(cpuId?: string | null, gpuId?: string | null): Promise<{ psus: PSU[] }> {
  const url = new URL(`${API}/api/compatible/psus`);
  if (cpuId) url.searchParams.append("cpu_id", cpuId);
  if (gpuId) url.searchParams.append("gpu_id", gpuId);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchPrice(productIds: string[]): Promise<PriceResponse> {
  const res = await fetch(`${API}/api/build/price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids: productIds }),
  });
  return res.json();
}
