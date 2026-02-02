# PC Forge

PC Forge is a comprehensive full-stack application designed to simplify the PC building process. It features a robust compatibility engine that validates component selections in real-time, ensuring that every build is technically sound before a single part is purchased.

## Key Features

- **Real-time Compatibility Validation:** Checks socket types, form factors, power requirements, and physical dimensions.
- **Layered Architecture:** Follows a strict separation of concerns with API, Service, and Repository layers.
- **Dynamic Component Filtering:** Automatically filters compatible parts based on your current selections.
- **Price Summarization:** Aggregates current pricing for your entire build.
- **Modern UI/UX:** Interactive builder interface with assembly flows and component details.

## Project Structure

The repository is organized into two main components:

- **`pc-forge-api/`**: The FastAPI backend providing the compatibility logic and database integration.
- **`pc-forge-ui/`**: A high-performance React frontend built with Vite and Tailwind CSS.

## Tech Stack

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Language:** Python 3.9+
- **Database:** PostgreSQL (Hosted on [Neon](https://neon.tech/))
- **Validation:** [Pydantic](https://docs.pydantic.dev/)
- **Driver:** `psycopg2-binary`

### Frontend (Vite)
- **Framework:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (or Neon account)

### 1. Backend Setup (`pc-forge-api`)

1. Navigate to the backend directory:
   ```bash
   cd pc-forge-api
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Configure environment variables:
   Create a `.env` file in `pc-forge-api/` with:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup (`pc-forge-ui`)

1. Navigate to the frontend directory:
   ```bash
   cd pc-forge-ui
   ```
2. Install dependencies and run development server:
   ```bash
   npm install
   npm run dev
   ```

## Architecture Overview

The project adheres to a clean, layered architecture:

1. **API Layer (`app/main.py`)**: Handles HTTP requests/responses and Pydantic validation.
2. **Service Layer (`app/services/`)**: Orchestrates business logic and applies compatibility rules.
3. **Repository Layer (`app/repositories/`)**: Manages raw SQL queries for optimized data retrieval.
4. **Database**: relational schema optimized for many-to-many component relationships.

---

*Developed for PC Builders & Hobbyists.*