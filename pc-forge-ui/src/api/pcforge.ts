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

export async function fetchGallery(): Promise<GalleryBuild[]> {
  const res = await fetch(`${API}/api/gallery`);
  return res.json();
}

export async function fetchUserBuilds(userId: number): Promise<GalleryBuild[]> {
  const res = await fetch(`${API}/api/gallery/user/${userId}`);
  return res.json();
}

export async function fetchSessionBuilds(sessionId: string): Promise<GalleryBuild[]> {
  const res = await fetch(`${API}/api/gallery/session/${sessionId}`);
  return res.json();
}

export async function fetchBuildTimeline(buildId: number): Promise<any[]> {
  const res = await fetch(`${API}/api/build/${buildId}/timeline`);
  return res.json();
}

export async function fetchVersionDiff(buildId: number, v1: number, v2: number): Promise<any> {
  const res = await fetch(`${API}/api/build/${buildId}/diff?v1=${v1}&v2=${v2}`);
  return res.json();
}

export async function fetchGalleryBuild(id: number): Promise<GalleryBuild> {
  const res = await fetch(`${API}/api/gallery/${id}`);
  return res.json();
}

export async function getSharedBuild(shareId: string): Promise<GalleryBuild> {
  const res = await fetch(`${API}/api/gallery/share/${shareId}`);
  return res.json();
}

export async function saveToGallery(build: GalleryBuildCreate): Promise<{ id: number; share_id: string; message: string }> {
  const buildWithSession = { ...build, session_id: getSessionId() };
  const res = await fetch(`${API}/api/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildWithSession),
  });
  return res.json();
}

export async function updateBuild(buildId: number, build: GalleryBuildCreate): Promise<{ message: string }> {
  const res = await fetch(`${API}/api/gallery/${buildId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(build),
  });
  return res.json();
}

export async function fetchComponentById(productId: string): Promise<Component> {
  const res = await fetch(`${API}/api/components/${productId}`);
  return res.json();
}

export async function deleteBuild(buildId: number): Promise<{ message: string }> {

  const res = await fetch(`${API}/api/gallery/${buildId}`, {
    method: "DELETE",
  });
  return res.json();
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

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  const res = await fetch(`${API}/api/components/counts`);
  return res.json();
}

export async function fetchCPUs(): Promise<{ cpus: CPU[] }> {
  const res = await fetch(`${API}/api/cpus`);
  return res.json();
}

export async function fetchMotherboards(cpuId?: string | null, sortBy?: string, order?: string): Promise<{ motherboards: Motherboard[] }> {
  const url = new URL(`${API}/api/compatible/motherboards`);
  if (cpuId) url.searchParams.append("cpu_id", cpuId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchRAM(motherboardId?: string | null, sortBy?: string, order?: string): Promise<{ ram: RAM[] }> {
  const url = new URL(`${API}/api/compatible/ram`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchStorage(motherboardId?: string | null, sortBy?: string, order?: string): Promise<{ storage: Storage[] }> {
  const url = new URL(`${API}/api/compatible/storage`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchCases(motherboardId?: string | null, gpuId?: string | null, sortBy?: string, order?: string): Promise<{ cases: Case[] }> {
  const url = new URL(`${API}/api/compatible/cases`);
  if (motherboardId) url.searchParams.append("motherboard_id", motherboardId);
  if (gpuId) url.searchParams.append("gpu_id", gpuId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchGPUs(caseId?: string | null, sortBy?: string, order?: string): Promise<{ gpus: GPU[] }> {
  const url = new URL(`${API}/api/compatible/gpus`);
  if (caseId) url.searchParams.append("case_id", caseId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchPSUs(cpuId?: string | null, gpuId?: string | null, sortBy?: string, order?: string): Promise<{ psus: PSU[] }> {
  const url = new URL(`${API}/api/compatible/psus`);
  if (cpuId) url.searchParams.append("cpu_id", cpuId);
  if (gpuId) url.searchParams.append("gpu_id", gpuId);
  if (sortBy) url.searchParams.append("sort_by", sortBy);
  if (order) url.searchParams.append("order", order);
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

export async function fetchMerchantPrices(productIds: string[]): Promise<any[]> {
  const res = await fetch(`${API}/api/build/merchant-prices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids: productIds }),
  });
  return res.json();
}

export async function fetchAdminMetrics(): Promise<any> {
  const token = localStorage.getItem("pcforge_token");
  const res = await fetch(`${API}/api/admin/metrics`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchVendorAudit(): Promise<any[]> {
  const token = localStorage.getItem("pcforge_token");
  const res = await fetch(`${API}/api/admin/vendor-audit`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchIncompleteProducts(category?: string): Promise<any[]> {
  const token = localStorage.getItem("pcforge_token");
  const url = new URL(`${API}/api/admin/incomplete-products`);
  if (category) url.searchParams.append("category", category);
  const res = await fetch(url.toString(), {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchCategorySchema(category: string): Promise<any[]> {
  const token = localStorage.getItem("pcforge_token");
  const res = await fetch(`${API}/api/admin/category-schema?category=${category}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function updateProductSpecs(payload: { product_id: string; category: string; specs: any }): Promise<any> {
  const token = localStorage.getItem("pcforge_token");
  const res = await fetch(`${API}/api/admin/update-specs`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchAIRecommendation(prompt: string): Promise<any> {
  const res = await fetch(`${API}/api/ai/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}
