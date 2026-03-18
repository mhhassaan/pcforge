import type { Component } from '../types/pcforge';

export const STARTER_PRESETS: Record<string, Component[]> = {
  "budget": [
    {
      "id": "64c550b0-aab9-450a-9804-349776113892",
      "name": "AMD Ryzen 5 5600 Tray",
      "manufacturer": "AMD",
      "category": "cpu",
      "price_pkr": 38500.0,
      "prices": [
        {
          "vendor": "walistech",
          "price": 38500.0,
          "url": "https://www.walistech.pk/processors/amd-ryzen-5-5600x-6-core-12-thread-unlocked-desktop-processor-tray"
        },
        {
          "vendor": "techarc",
          "price": 38900.0,
          "url": "https://techarc.pk/amd-ryzen-5-5600x-am4-processor-chip/"
        },
        {
          "vendor": "techmatched",
          "price": 38900.0,
          "url": "https://techmatched.pk/product/ryzen-5-5600x-tray-processor-in-pakistan-tm/"
        },
        {
          "vendor": "zahcomputers",
          "price": 39500.0,
          "url": "https://zahcomputers.pk/product/amd-ryzen-5-5600x-processor-6c-12t-35mb-cache-up-to-4-6-ghz-max-boost-tray/"
        }
      ],
      "image_url": null,
      "specs": {
        "socket": "AM4",
        "cores": 6,
        "threads": 12,
        "base_clock_ghz": 3.5,
        "boost_clock_ghz": 4.4,
        "tdp_watts": 65,
        "integrated_graphics": null,
        "lithography": "7"
      }
    },
    {
      "id": "36e28699-41b8-4553-a6f1-44452881d2d3",
      "name": "MSI B550M PRO-VDH",
      "manufacturer": "MSI",
      "category": "motherboard",
      "price_pkr": 36299.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 36299.0,
          "url": "https://zahcomputers.pk/product/msi-pro-b550m-pro-vdh-am4-amd-b550-sata-6gb-s-micro-atx-amd-motherboard/"
        },
        {
          "vendor": "techarc",
          "price": 36400.0,
          "url": "https://techarc.pk/msi-b550m-pro-vdh-ddr4-proseries-motherboard/"
        },
        {
          "vendor": "techmatched",
          "price": 36500.0,
          "url": "https://techmatched.pk/product/msi-b550m-pro-vdh-ddr4-motherboard-in-pak/"
        }
      ],
      "image_url": null,
      "specs": {
        "socket": "AM4",
        "chipset": "B550",
        "form_factor": "Micro ATX",
        "ram_type": "DDR4",
        "ram_slots": 4,
        "max_ram_gb": 128,
        "pcie_x16_slots": 1,
        "pcie_x1_slots": 2,
        "m2_slots": 2,
        "sata_6gb_ports": 4,
        "onboard_ethernet_gbps": 1.0,
        "ecc_support": false,
        "raid_support": true
      }
    },
    {
      "id": "73bd0868-5c18-4f33-9299-d28069bacc0b",
      "name": "Sapphire PULSE Radeon RX 6600",
      "manufacturer": "Sapphire",
      "category": "gpu",
      "price_pkr": 34999.0,
      "prices": [
        {
          "vendor": "junaidtech",
          "price": 34999.0,
          "url": "https://www.junaidtech.pk/product/sapphire-pulse-rx-6500-xt-gaming-oc-4gb-graphics-card-factory-refurbished"
        },
        {
          "vendor": "zahcomputers",
          "price": 45000.0,
          "url": "https://zahcomputers.pk/product/sapphire-pulse-radeon-rx-6400-4gb-gddr6-pci-express-4-0-low-profile-video-card/"
        },
        {
          "vendor": "techarc",
          "price": 58500.0,
          "url": "https://techarc.pk/sapphire-pulse-radeon-rx-6600-8gb-gddr6-pci-express-4-0-atx-gaming-graphics-card-used/"
        },
        {
          "vendor": "techmatched",
          "price": 175000.0,
          "url": "https://techmatched.pk/product/sapphire-pulse-rx-9060-xt-gaming-oc-gpu/"
        },
        {
          "vendor": "walistech",
          "price": 254999.0,
          "url": "https://www.walistech.pk/graphics-cards/sapphire-pulse-amd-radeon-rx-9070xt-16gb-gddr6-graphic-card"
        }
      ],
      "image_url": null,
      "specs": {
        "chipset_manufacturer": "AMD",
        "chipset": "Radeon RX 6600",
        "vram_gb": 8,
        "memory_type": "GDDR6",
        "core_base_clock_mhz": 2044,
        "core_boost_clock_mhz": 2491,
        "memory_bus_bit": 128,
        "interface": "PCIe 4.0 x16",
        "length_mm": 193,
        "slot_width": 2,
        "tdp_watts": 132,
        "pcie_6_pin": 0,
        "pcie_8_pin": 1,
        "pcie_12vhpwr": 0,
        "cooling": "Dual Fan",
        "hdmi_2_1": 1,
        "displayport_2_1": 0,
        "displayport_2_1a": 0
      }
    },
    {
      "id": "df7cfe82-a78a-4793-97ad-cec01ac95f1d",
      "name": "Samsung 980 Pro 2 TB M.2-2280 PCIe 4.0 X4 NVME Solid State Drive",
      "manufacturer": "Samsung",
      "category": "storage",
      "price_pkr": 80000.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 80000.0,
          "url": "https://zahcomputers.pk/product/samsung-980-pro-pcie-4-0-nvme-ssd-2tb/"
        }
      ],
      "image_url": null,
      "specs": {
        "storage_type": "SSD",
        "capacity_gb": 2000,
        "form_factor": "M.2-2280",
        "interface": "PCIe 4.0 x4",
        "nvme": true
      }
    },
    {
      "id": "28623779-cbf9-4d77-8e80-7da03c0e9c14",
      "name": "Corsair 4000D Airflow ATX Mid Tower Case",
      "manufacturer": "Corsair",
      "category": "case",
      "price_pkr": 29500.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 29500.0,
          "url": "https://zahcomputers.pk/product/corsair-frame-4000d-modular-mid-tower-pc-case-black/"
        }
      ],
      "image_url": null,
      "specs": {
        "case_form_factor": "ATX Mid Tower",
        "supported_motherboard_form_factors": [
          "ATX",
          "Micro ATX",
          "Mini ITX"
        ],
        "max_gpu_length_mm": 360,
        "max_cpu_cooler_height_mm": 170,
        "expansion_slots": 7,
        "internal_3_5_bays": 2,
        "internal_2_5_bays": 2,
        "has_transparent_side_panel": true,
        "side_panel_type": "Tempered Glass",
        "supported_psu_form_factors": [
          "ATX"
        ],
        "width_mm": 210,
        "height_mm": 453,
        "depth_mm": 466
      }
    },
    {
      "id": "079e2b6c-22a0-4f16-9d82-727d039e2377",
      "name": "Ease EB650W 650 W 80+ Bronze Certified Fully Modular ATX Power Supply",
      "manufacturer": "Ease",
      "category": "psu",
      "price_pkr": 10800.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 10800.0,
          "url": "https://zahcomputers.pk/product/ease-eb650-watt-80-plus-bronze/"
        }
      ],
      "image_url": null,
      "specs": {
        "wattage": 650,
        "form_factor": "ATX",
        "efficiency_rating": "80+ Bronze",
        "modular": true,
        "length_mm": 160,
        "fanless": false,
        "atx_24_pin": 1,
        "eps_8_pin": 1,
        "pcie_6_plus_2_pin": 2,
        "pcie_12vhpwr": 0,
        "sata_connectors": 6,
        "molex_connectors": 3
      }
    }
  ],
  "gaming": [
    {
      "id": "4cab9e32-8757-40ce-b165-f39de575574c",
      "name": "AMD Ryzen 5 7600 Boxed",
      "manufacturer": "AMD",
      "category": "cpu",
      "price_pkr": 73499.0,
      "prices": [
        {
          "vendor": "walistech",
          "price": 73499.0,
          "url": "https://www.walistech.pk/processors/amd-ryzen-5-7600x-6-core-12-thread-unlocked-desktop-processor"
        }
      ],
      "image_url": null,
      "specs": {
        "socket": "AM5",
        "cores": 6,
        "threads": 12,
        "base_clock_ghz": 3.8,
        "boost_clock_ghz": 5.1,
        "tdp_watts": 65,
        "integrated_graphics": "AMD Radeon Graphics",
        "lithography": "5"
      }
    },
    {
      "id": "8b0e1130-654d-4599-bf86-0bf61a934813",
      "name": "Asus PRIME B650M-A II",
      "manufacturer": "Asus",
      "category": "motherboard",
      "price_pkr": 43800.0,
      "prices": [
        {
          "vendor": "techarc",
          "price": 43800.0,
          "url": "https://techarc.pk/asus-prime-b550m-a-wifi-ii-am4-matx-motherboard/"
        },
        {
          "vendor": "techmatched",
          "price": 44000.0,
          "url": "https://techmatched.pk/product/asus-prime-b550m-a-wifi-ii-motherboard/"
        },
        {
          "vendor": "zahcomputers",
          "price": 47999.0,
          "url": "https://zahcomputers.pk/product/asus-prime-b650m-a-ii-micro-atx-with-ddr5-pcie-5-0-m-2-2-5gb-gaming-motherboard/"
        }
      ],
      "image_url": null,
      "specs": {
        "socket": "AM5",
        "chipset": "B650",
        "form_factor": "Micro ATX",
        "ram_type": "DDR5",
        "ram_slots": 4,
        "max_ram_gb": 192,
        "pcie_x16_slots": 1,
        "pcie_x1_slots": 2,
        "m2_slots": 2,
        "sata_6gb_ports": 4,
        "onboard_ethernet_gbps": 2.5,
        "ecc_support": false,
        "raid_support": true
      }
    },
    {
      "id": "7beed772-0ea3-4d29-be30-c9869a5df016",
      "name": "Asus DUAL OC GeForce RTX 4060 Ti",
      "manufacturer": "Asus",
      "category": "gpu",
      "price_pkr": 137990.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 137990.0,
          "url": "https://zahcomputers.pk/product/asus-dual-geforce-rtx-4060-ti-8gb-gddr6-pci-express-4-0-graphics-card/"
        },
        {
          "vendor": "walistech",
          "price": 162000.0,
          "url": "https://www.walistech.pk/graphics-cards/asus-dual-geforce-rtx-5060-ti-16gb-gddr7-oc-edition"
        },
        {
          "vendor": "techarc",
          "price": 164500.0,
          "url": "https://techarc.pk/asus-dual-geforce-rtx-5060-ti-8gb-gddr7-graphics-card/"
        }
      ],
      "image_url": null,
      "specs": {
        "chipset_manufacturer": "NVIDIA",
        "chipset": "GeForce RTX 4060 Ti",
        "vram_gb": 8,
        "memory_type": "GDDR6",
        "core_base_clock_mhz": 2310,
        "core_boost_clock_mhz": 2535,
        "memory_bus_bit": 128,
        "interface": "PCIe 4.0 x16",
        "length_mm": 227,
        "slot_width": 2,
        "tdp_watts": 160,
        "pcie_6_pin": 0,
        "pcie_8_pin": 1,
        "pcie_12vhpwr": 0,
        "cooling": "Dual Fan",
        "hdmi_2_1": 1,
        "displayport_2_1": 0,
        "displayport_2_1a": 3
      }
    },
    {
      "id": "df72849d-1d41-427d-bdd1-29e8177c2654",
      "name": "ADATA 32 GB (2 x 16 GB) DDR5-5600 CL46",
      "manufacturer": "ADATA",
      "category": "ram",
      "price_pkr": 30499.0,
      "prices": [
        {
          "vendor": "junaidtech",
          "price": 30499.0,
          "url": "https://www.junaidtech.pk/product/adata-8gb-5600mhz-desktop-ram-c46"
        },
        {
          "vendor": "techarc",
          "price": 91500.0,
          "url": "https://techarc.pk/adata-premier-ddr5-5600mhz-32gb-udimm-memory-ram-module/"
        },
        {
          "vendor": "zahcomputers",
          "price": 105000.0,
          "url": "https://zahcomputers.pk/product/adata-32gb-32gb-5600mhz-c46-ddr5-u-dimm-desktop-memory/"
        }
      ],
      "image_url": null,
      "specs": {
        "ram_type": "DDR5",
        "total_capacity_gb": 32,
        "module_count": 2,
        "module_capacity_gb": 16,
        "speed_mhz": 5600,
        "cas_latency": 46,
        "ecc": false,
        "registered": false,
        "form_factor": "DIMM",
        "voltage": null,
        "rgb": false,
        "heat_spreader": true
      }
    },
    {
      "id": "df7cfe82-a78a-4793-97ad-cec01ac95f1d",
      "name": "Samsung 980 Pro 2 TB M.2-2280 PCIe 4.0 X4 NVME Solid State Drive",
      "manufacturer": "Samsung",
      "category": "storage",
      "price_pkr": 80000.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 80000.0,
          "url": "https://zahcomputers.pk/product/samsung-980-pro-pcie-4-0-nvme-ssd-2tb/"
        }
      ],
      "image_url": null,
      "specs": {
        "storage_type": "SSD",
        "capacity_gb": 2000,
        "form_factor": "M.2-2280",
        "interface": "PCIe 4.0 x4",
        "nvme": true
      }
    },
    {
      "id": "28623779-cbf9-4d77-8e80-7da03c0e9c14",
      "name": "Corsair 4000D Airflow ATX Mid Tower Case",
      "manufacturer": "Corsair",
      "category": "case",
      "price_pkr": 29500.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 29500.0,
          "url": "https://zahcomputers.pk/product/corsair-frame-4000d-modular-mid-tower-pc-case-black/"
        }
      ],
      "image_url": null,
      "specs": {
        "case_form_factor": "ATX Mid Tower",
        "supported_motherboard_form_factors": [
          "ATX",
          "Micro ATX",
          "Mini ITX"
        ],
        "max_gpu_length_mm": 360,
        "max_cpu_cooler_height_mm": 170,
        "expansion_slots": 7,
        "internal_3_5_bays": 2,
        "internal_2_5_bays": 2,
        "has_transparent_side_panel": true,
        "side_panel_type": "Tempered Glass",
        "supported_psu_form_factors": [
          "ATX"
        ],
        "width_mm": 210,
        "height_mm": 453,
        "depth_mm": 466
      }
    },
    {
      "id": "079e2b6c-22a0-4f16-9d82-727d039e2377",
      "name": "Ease EB650W 650 W 80+ Bronze Certified Fully Modular ATX Power Supply",
      "manufacturer": "Ease",
      "category": "psu",
      "price_pkr": 10800.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 10800.0,
          "url": "https://zahcomputers.pk/product/ease-eb650-watt-80-plus-bronze/"
        }
      ],
      "image_url": null,
      "specs": {
        "wattage": 650,
        "form_factor": "ATX",
        "efficiency_rating": "80+ Bronze",
        "modular": true,
        "length_mm": 160,
        "fanless": false,
        "atx_24_pin": 1,
        "eps_8_pin": 1,
        "pcie_6_plus_2_pin": 2,
        "pcie_12vhpwr": 0,
        "sata_connectors": 6,
        "molex_connectors": 3
      }
    }
  ],
  "workstation": [
    {
      "id": "ed3dc658-7578-42d8-9db0-65091f1c9335",
      "name": "AMD Ryzen 5 7600X Boxed",
      "manufacturer": "AMD",
      "category": "cpu",
      "price_pkr": 73499.0,
      "prices": [
        {
          "vendor": "walistech",
          "price": 73499.0,
          "url": "https://www.walistech.pk/processors/amd-ryzen-5-7600x-6-core-12-thread-unlocked-desktop-processor"
        }
      ],
      "image_url": null,
      "specs": {
        "socket": "AM5",
        "cores": 6,
        "threads": 12,
        "base_clock_ghz": 4.7,
        "boost_clock_ghz": 5.3,
        "tdp_watts": 105,
        "integrated_graphics": "AMD Radeon Graphics",
        "lithography": "5"
      }
    },
    {
      "id": "c200a0c8-f362-40dd-b667-fcb6b7463467",
      "name": "Asus ROG STRIX X670E-F GAMING WIFI",
      "manufacturer": "Asus",
      "category": "motherboard",
      "price_pkr": 110000.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 110000.0,
          "url": "https://zahcomputers.pk/product/asus-rog-strix-x670e-f-gaming-wifi6e-socket-am5-lga-1718-ryzen-7000-gaming-motherboard/"
        },
        {
          "vendor": "techarc",
          "price": 167500.0,
          "url": "https://techarc.pk/asus-rog-strix-x870-f-gaming-wifi-am5-atx-motherboard/"
        }
      ],
      "image_url": null,
      "specs": {
        "socket": "AM5",
        "chipset": "X670E",
        "form_factor": "ATX",
        "ram_type": "DDR5",
        "ram_slots": 4,
        "max_ram_gb": 128,
        "pcie_x16_slots": 2,
        "pcie_x1_slots": 1,
        "m2_slots": 4,
        "sata_6gb_ports": 6,
        "onboard_ethernet_gbps": 2.5,
        "ecc_support": false,
        "raid_support": true
      }
    },
    {
      "id": "8fd424f1-bbd6-462e-857a-e5a1025b75aa",
      "name": "MSI VENTUS 2X OC GeForce RTX 4070 SUPER",
      "manufacturer": "MSI",
      "category": "gpu",
      "price_pkr": 66000.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 66000.0,
          "url": "https://zahcomputers.pk/product/msi-geforce-rtx-2060-super-ventus-gp-oc-8gb-ddr6-256-bit-graphic-card/"
        },
        {
          "vendor": "techmatched",
          "price": 72000.0,
          "url": "https://techmatched.pk/product/buy-msi-geforce-rtx-3050-ventus-2x-e-6gb-oc/"
        },
        {
          "vendor": "techarc",
          "price": 154500.0,
          "url": "https://techarc.pk/msi-rtx-4060-ti-ventus-2x-black-16g-oc-graphics-card/"
        },
        {
          "vendor": "walistech",
          "price": 279999.0,
          "url": "https://www.walistech.pk/graphics-cards/nvidia-geforce-rtx-4070-ti-super-16g-ventus-2x-oc"
        }
      ],
      "image_url": null,
      "specs": {
        "chipset_manufacturer": "NVIDIA",
        "chipset": "GeForce RTX 4070 SUPER",
        "vram_gb": 12,
        "memory_type": "GDDR6X",
        "core_base_clock_mhz": 1920,
        "core_boost_clock_mhz": 2475,
        "memory_bus_bit": 192,
        "interface": "PCIe 4.0 x16",
        "length_mm": 242,
        "slot_width": 2,
        "tdp_watts": 220,
        "pcie_6_pin": 0,
        "pcie_8_pin": 1,
        "pcie_12vhpwr": 0,
        "cooling": "Dual Fan",
        "hdmi_2_1": 1,
        "displayport_2_1": 0,
        "displayport_2_1a": 3
      }
    },
    {
      "id": "df72849d-1d41-427d-bdd1-29e8177c2654",
      "name": "ADATA 32 GB (2 x 16 GB) DDR5-5600 CL46",
      "manufacturer": "ADATA",
      "category": "ram",
      "price_pkr": 30499.0,
      "prices": [
        {
          "vendor": "junaidtech",
          "price": 30499.0,
          "url": "https://www.junaidtech.pk/product/adata-8gb-5600mhz-desktop-ram-c46"
        },
        {
          "vendor": "techarc",
          "price": 91500.0,
          "url": "https://techarc.pk/adata-premier-ddr5-5600mhz-32gb-udimm-memory-ram-module/"
        },
        {
          "vendor": "zahcomputers",
          "price": 105000.0,
          "url": "https://zahcomputers.pk/product/adata-32gb-32gb-5600mhz-c46-ddr5-u-dimm-desktop-memory/"
        }
      ],
      "image_url": null,
      "specs": {
        "ram_type": "DDR5",
        "total_capacity_gb": 32,
        "module_count": 2,
        "module_capacity_gb": 16,
        "speed_mhz": 5600,
        "cas_latency": 46,
        "ecc": false,
        "registered": false,
        "form_factor": "DIMM",
        "voltage": null,
        "rgb": false,
        "heat_spreader": true
      }
    },
    {
      "id": "df7cfe82-a78a-4793-97ad-cec01ac95f1d",
      "name": "Samsung 980 Pro 2 TB M.2-2280 PCIe 4.0 X4 NVME Solid State Drive",
      "manufacturer": "Samsung",
      "category": "storage",
      "price_pkr": 80000.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 80000.0,
          "url": "https://zahcomputers.pk/product/samsung-980-pro-pcie-4-0-nvme-ssd-2tb/"
        }
      ],
      "image_url": null,
      "specs": {
        "storage_type": "SSD",
        "capacity_gb": 2000,
        "form_factor": "M.2-2280",
        "interface": "PCIe 4.0 x4",
        "nvme": true
      }
    },
    {
      "id": "28623779-cbf9-4d77-8e80-7da03c0e9c14",
      "name": "Corsair 4000D Airflow ATX Mid Tower Case",
      "manufacturer": "Corsair",
      "category": "case",
      "price_pkr": 29500.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 29500.0,
          "url": "https://zahcomputers.pk/product/corsair-frame-4000d-modular-mid-tower-pc-case-black/"
        }
      ],
      "image_url": null,
      "specs": {
        "case_form_factor": "ATX Mid Tower",
        "supported_motherboard_form_factors": [
          "ATX",
          "Micro ATX",
          "Mini ITX"
        ],
        "max_gpu_length_mm": 360,
        "max_cpu_cooler_height_mm": 170,
        "expansion_slots": 7,
        "internal_3_5_bays": 2,
        "internal_2_5_bays": 2,
        "has_transparent_side_panel": true,
        "side_panel_type": "Tempered Glass",
        "supported_psu_form_factors": [
          "ATX"
        ],
        "width_mm": 210,
        "height_mm": 453,
        "depth_mm": 466
      }
    },
    {
      "id": "079e2b6c-22a0-4f16-9d82-727d039e2377",
      "name": "Ease EB650W 650 W 80+ Bronze Certified Fully Modular ATX Power Supply",
      "manufacturer": "Ease",
      "category": "psu",
      "price_pkr": 10800.0,
      "prices": [
        {
          "vendor": "zahcomputers",
          "price": 10800.0,
          "url": "https://zahcomputers.pk/product/ease-eb650-watt-80-plus-bronze/"
        }
      ],
      "image_url": null,
      "specs": {
        "wattage": 650,
        "form_factor": "ATX",
        "efficiency_rating": "80+ Bronze",
        "modular": true,
        "length_mm": 160,
        "fanless": false,
        "atx_24_pin": 1,
        "eps_8_pin": 1,
        "pcie_6_plus_2_pin": 2,
        "pcie_12vhpwr": 0,
        "sata_connectors": 6,
        "molex_connectors": 3
      }
    }
  ]
};
