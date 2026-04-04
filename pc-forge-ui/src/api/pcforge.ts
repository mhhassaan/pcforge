// PC Forge API client - v1.0.3
import type { CPU, Motherboard, RAM, GPU, Case, PSU, Storage, PriceResponse, Component, GalleryBuild, GalleryBuildCreate } from "../types/pcforge";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export function getSessionId(): string {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(url: string | URL, options?: RequestInit): Promise<T> {
  const res = await fetch(url.toString(), options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function fetchGallery(): Promise<GalleryBuild[]> {
  return fetchAPI<GalleryBuild[]>(`${API}/api/gallery`);
}

export async function fetchUserBuilds(userId: number): Promise<GalleryBuild[]> {
  return fetchAPI<GalleryBuild[]>(`${API}/api/gallery/user/${userId}`);
}

export async function fetchSessionBuilds(sessionId: string): Promise<GalleryBuild[]> {
  return fetchAPI<GalleryBuild[]>(`${API}/api/gallery/session/${sessionId}`);
}

export async function fetchBuildTimeline(buildId: number): Promise<any[]> {
  return fetchAPI<any[]>(`${API}/api/build/${buildId}/timeline`);
}

export async function fetchVersionDiff(buildId: number, v1: number, v2: number): Promise<any> {
  return fetchAPI<any>(`${API}/api/build/${buildId}/diff?v1=${v1}&v2=${v2}`);
}

export async function fetchGalleryBuild(id: number): Promise<GalleryBuild> {
  return fetchAPI<GalleryBuild>(`${API}/api/gallery/${id}`);
}

export async function getSharedBuild(shareId: string): Promise<GalleryBuild> {
  return fetchAPI<GalleryBuild>(`${API}/api/gallery/share/${shareId}`);
}

export async function saveToGallery(build: GalleryBuildCreate): Promise<{ id: number; share_id: string; message: string }> {
  const buildWithSession = { ...build, session_id: getSessionId() };
  return fetchAPI<{ id: number; share_id: string; message: string }>(`${API}/api/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildWithSession),
  });
}

export async function updateBuild(buildId: number, build: GalleryBuildCreate): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>(`${API}/api/gallery/${buildId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(build),
  });
}

export async function fetchComponentById(productId: string): Promise<Component> {
  return fetchAPI<Component>(`${API}/api/components/${productId}`);
}

export async function deleteBuild(buildId: number): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>(`${API}/api/gallery/${buildId}`, {
    method: "DELETE",
  });
}

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

  return fetchAPI<Component[]>(url);
}

export async function fetchFilters(category: string): Promise<Record<string, string[]>> {
  return fetchAPI<Record<string, string[]>>(`${API}/api/components/filters?category=${category}`);
}

export async function fetchAllFilters(): Promise<Record<string, Record<string, string[]>>> {
  return fetchAPI<Record<string, Record<string, string[]>>>(`${API}/api/components/filters/all`);
}

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  return fetchAPI<Record<string, number>>(`${API}/api/components/counts`);
}

export async function fetchCPUs(): Promise<{ cpus: CPU[] }> {
  return fetchAPI<{ cpus: CPU[] }>(`${API}/api/cpus`);
}

export async function fetchMotherboards(cpuId?: string | null, sortBy?: string, order?: string): Promise<{ motherboards: Motherboard[] }> {
  const url = new URL(`${API}/api/compatible/motherboards`);
  if (cpuId) url.searchParams.append("cpu_id", cpuId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  return fetchAPI<{ motherboards: Motherboard[] }>(url);
}

export async function fetchRAM(motherboardId?: string | null, sortBy?: string, order?: string): Promise<{ ram: RAM[] }> {
  const url = new URL(`${API}/api/compatible/ram`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  return fetchAPI<{ ram: RAM[] }>(url);
}

export async function fetchStorage(motherboardId?: string | null, sortBy?: string, order?: string): Promise<{ storage: Storage[] }> {
  const url = new URL(`${API}/api/compatible/storage`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  return fetchAPI<{ storage: Storage[] }>(url);
}

export async function fetchCases(motherboardId?: string | null, gpuId?: string | null, sortBy?: string, order?: string): Promise<{ cases: Case[] }> {
  const url = new URL(`${API}/api/compatible/cases`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  if (gpuId) url.searchParams.append("gpu_id", gpuId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  return fetchAPI<{ cases: Case[] }>(url);
}

export async function fetchGPUs(caseId?: string | null, sortBy?: string, order?: string): Promise<{ gpus: GPU[] }> {
  const url = new URL(`${API}/api/compatible/gpus`);
  if (caseId) url.searchParams.append("case_id", caseId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  return fetchAPI<{ gpus: GPU[] }>(url);
}

export async function fetchPSUs(cpuId?: string | null, gpuId?: string | null, sortBy?: string, order?: string): Promise<{ psus: PSU[] }> {
  const url = new URL(`${API}/api/compatible/psus`);
  if (cpuId) url.searchParams.append("cpu_id", cpuId);
  if (gpuId) url.searchParams.append("gpu_id", gpuId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  return fetchAPI<{ psus: PSU[] }>(url);
}

export async function fetchPrice(productIds: string[]): Promise<PriceResponse> {
  return fetchAPI<PriceResponse>(`${API}/api/build/price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids: productIds }),
  });
}

export async function fetchMerchantPrices(productIds: string[]): Promise<any[]> {
  return fetchAPI<any[]>(`${API}/api/build/merchant-prices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids: productIds }),
  });
}

export async function fetchAdminMetrics(): Promise<any> {
  const token = localStorage.getItem("pcforge_token");
  return fetchAPI<any>(`${API}/api/admin/metrics`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export async function fetchVendorAudit(): Promise<any[]> {
  const token = localStorage.getItem("pcforge_token");
  return fetchAPI<any[]>(`${API}/api/admin/vendor-audit`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export async function fetchIncompleteProducts(category?: string): Promise<any[]> {
  const token = localStorage.getItem("pcforge_token");
  const url = new URL(`${API}/api/admin/incomplete-products`);
  if (category) url.searchParams.append("category", category);
  return fetchAPI<any[]>(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export async function fetchCategorySchema(category: string): Promise<any[]> {
  const token = localStorage.getItem("pcforge_token");
  return fetchAPI<any[]>(`${API}/api/admin/category-schema?category=${category}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export async function updateProductSpecs(payload: { product_id: string; category: string; specs: any }): Promise<any> {
  const token = localStorage.getItem("pcforge_token");
  return fetchAPI<any>(`${API}/api/admin/update-specs`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchAIRecommendation(prompt: string): Promise<any> {
  return fetchAPI<any>(`${API}/api/ai/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
}
