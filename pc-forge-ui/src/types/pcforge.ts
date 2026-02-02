export interface CPU {
  product_id: string;
  product_name: string;
  manufacturer: string;
  price_pkr: number | null;
}

export interface Motherboard {
  product_id: string;
  product_name: string;
  socket: string;
  chipset: string;
  form_factor: string;
  ram_type: string;
  max_ram_gb: number;
  ram_slots: number;
  price_pkr: number | null;
}

export interface RAM {
  product_id: string;
  product_name: string;
  ram_type: string;
  module_capacity_gb: number;
  module_count: number;
  speed_mhz: number;
  price_pkr: number | null;
}

export interface GPU {
  product_id: string;
  product_name: string;
  chipset: string;
  vram_gb: number;
  length_mm: number;
  price_pkr: number | null;
}

export interface Case {
  product_id: string;
  product_name: string;
  case_form_factor: string;
  side_panel_window: string;
  max_gpu_length_mm: number;
  price_pkr: number | null;
}

export interface PSU {
  product_id: string;
  product_name: string;
  wattage: number;
  efficiency_rating: string;
  modular: string;
  price_pkr: number | null;
}

export interface Storage {
  product_id: string;
  product_name: string;
  capacity_gb: number;
  type: string;
  form_factor: string;
  interface: string;
  price_pkr: number | null;
}

export interface PriceItem {
  product_id: string;
  product_name: string;
  vendor: string;
  price: number;
  url: string;
}

export interface PriceResponse {
  items: PriceItem[];
  total_price: number;
  missing_prices: string[];
}

export interface PriceListing {
  vendor: string;
  price: number;
  url: string;
}

export interface Component {
  id: string;
  category: string;
  name: string;
  specs: Record<string, any>;
  price_pkr: number | null;
  image_url: string | null;
  prices: PriceListing[];
}
