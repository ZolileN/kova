# Running Kova OS Locally

This guide provides instructions on how to set up and run the Kova OS project on your local machine for development and testing.

## Prerequisites

Ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python](https://www.python.org/) (3.10 or higher recommended)
- [Git](https://git-scm.com/)

## Environment Variables

Before starting the applications, you will need to set up your environment variables. 
Copy the example environment files if they exist and fill in your specific credentials (API keys, etc.).

For the backend, ensure variables like `DATABASE_URL`, `REDIS_URL`, and `OPENAI_API_KEY` are configured either in your `.env` file or exported in your shell. The `docker-compose.yml` file uses `.env` variables or falls back to mock keys.

---

## Method 1: Using Docker Compose (Recommended)

The easiest way to get the entire stack (Database, Redis, Backend, Celery Worker, Frontend) running is using Docker Compose.

1. Open a terminal in the root directory of the project (`kova-os`).
2. Run the following command to build and start all services:

   ```bash
   docker compose up --build
   ```

   *To run it in the background (detached mode), add the `-d` flag: `docker compose up -d --build`*

### Accessing the Services
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Backend API Docs (Swagger):** http://localhost:8000/docs
- **Database:** `localhost:5432`
- **Redis:** `localhost:6379`

### Stopping the Services
To stop the services, press `Ctrl+C` in the terminal where it's running, or if running in detached mode, run:
```bash
docker compose down
```

---

## Method 2: Local Development Setup (Without Docker for Apps)

If you prefer to run the applications directly on your host machine for faster debugging and development, follow these steps:

### 1. Start Infrastructure Services

First, start the PostgreSQL database and Redis cache using Docker Compose:

```bash
docker compose up -d db redis
```

### 2. Set Up the Backend (FastAPI)

Open a new terminal window:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (if Alembic is configured)
# alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*The backend API will be available at http://localhost:8000*

### 3. Set Up the Celery Worker

Open another terminal window to run the Celery background worker:

```bash
cd backend
source venv/bin/activate

# Start the Celery worker
celery -A app.infrastructure.celery.worker.celery_app worker --loglevel=info
```

### 4. Set Up the Frontend (Next.js)

Open a final terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will be available at http://localhost:3000*

## Troubleshooting

- **Docker Permission Denied:** If you get a `permission denied while trying to connect to the docker API` error, you either need to run docker commands with `sudo` (e.g., `sudo docker compose up --build`) or add your user to the docker group (`sudo usermod -aG docker $USER` and log out/in).
- **Ports already in use:** Ensure that ports 3000, 8000, 5432, and 6379 are not being used by other applications on your system.
- **Database connection errors:** Verify that the `DATABASE_URL` in your `.env` file correctly points to the running PostgreSQL container.
- **Missing dependencies:** If using the local setup method, ensure you have navigated to the `backend` directory and activated the python virtual environment (`source venv/bin/activate`) before running the backend or celery worker.
