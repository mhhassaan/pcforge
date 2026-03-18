# PC Forge

PC Forge is a sophisticated full-stack platform designed to revolutionize the PC building experience. Beyond a simple parts list, it features a **Real-time Compatibility Engine** that validates every electrical and physical constraint, an **AI-powered build assistant**, and a **multi-vendor price optimization** system.

Whether you're a first-time builder or a hardware enthusiast, PC Forge ensures your build is technically sound and economically optimized before you commit to a single purchase.

![Landing Page](./pc-forge-ui/screenshots/PCForge%20Build%20Your%20Dream%20PC.png)

## Key Features

### Intelligent Compatibility Engine
- **Socket & Chipset Validation:** Ensures CPU and Motherboard harmony (e.g., LGA1700, AM5).
- **Physical Clearance Checks:** Validates GPU length vs. Case clearance and RAM height vs. CPU Cooler.
- **Power Budgeting:** Automatically calculates Total TDP and recommends appropriate PSU wattage with safety margins.
- **Form Factor Verification:** Matches Motherboards (ATX, mATX, ITX) with compatible Chassis and PSUs.

### AI Build Assistant
- **Prompt-to-Build:** Describe your needs (e.g., "4K video editing for $2000") and receive a curated, compatible component list instantly.
- **Context-Aware Suggestions:** Recommends alternative parts based on current selections and budget.

### Market & Price Optimization
- **Multi-Vendor Aggregation:** Tracks prices across multiple merchants to find the absolute lowest cost for each component.
- **One-Click Merchant Routing:** Direct links to purchase components from the cheapest verified vendors.

### Build Versioning & Timeline
- **Revision History:** Save multiple versions of a single build and track changes over time.
- **Diff Tool:** Compare different versions of your build to see how specifications and prices have evolved.

### Community & Sharing
- **Gallery Showcase:** Share your completed or planned builds with the community.
- **Portable Share Links:** Generate unique, persistent IDs for sharing builds on forums or social media.
- **Anonymous Session Migration:** Start building as a guest and seamlessly transfer your work to a registered account.

### Professional Admin Tools
- **Data Integrity Dashboard:** Real-time metrics on product coverage and missing specifications.
- **Dynamic Spec Management:** Tools for administrators to update hardware specifications and maintain data accuracy.

## Architecture

PC Forge follows a **Layered Architecture** to ensure maintainability, scalability, and testability.

1.  **API Layer (`app/main.py`):** FastAPI-based RESTful interface with strict Pydantic validation.
2.  **Service Layer (`app/services/`):** Orchestrates complex business logic, including the compatibility engine and AI integration.
3.  **Repository Layer (`app/repositories/`):** High-performance Data Access Layer (DAL) using raw SQL for optimized PostgreSQL queries.
4.  **Database:** PostgreSQL (Hosted on **Neon**) with a relational schema optimized for many-to-many hardware relationships.

## Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.9+)
- **Database:** PostgreSQL (Neon)
- **AI Integration:** LLM-powered recommendations
- **Deployment:** Vercel (Python Runtime)

### Frontend
- **Framework:** React 19 (Vite)
- **Routing:** React Router 7
- **Styling:** Tailwind CSS + Radix UI
- **Animations:** Framer Motion + GSAP
- **State/Data:** Real-time API integration with persistent local sessions

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (or Neon account)

### 1. Backend Setup (`pc-forge-api`)

```bash
cd pc-forge-api
python -m venv venv
# On Windows: venv\Scripts\activate | On Unix: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `pc-forge-api/`:
```env
DATABASE_URL=your_postgresql_connection_string
ALLOWED_ORIGINS=http://localhost:5173
```

Run the API:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup (`pc-forge-ui`)

```bash
cd pc-forge-ui
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

*Engineered for builders, by builders.*