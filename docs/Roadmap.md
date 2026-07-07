# Development Roadmap - Kova

This document defines the release phases, major milestones, and execution timeline for the Kova Travel Operating System.

---

## 1. Milestones Overview

```
Milestone 1 (Scaffolding & Core DB) ──> Milestone 2 (Clean Architecture API) ──> Milestone 3 (AI Orchestration Engine) ──> Milestone 4 (Premium Web Client)
```

---

## 2. Release Milestones

### Milestone 1: Foundation & Shared Infrastructure (Weeks 1-2)
* **Goal**: Establish the development workspace, docker services, schema blueprints, and basic migration controls.
* **Deliverables**:
  - Full system documentation under `/docs`.
  - Base Next.js app scaffolding with CSS variables and shadcn core setup.
  - FastAPI scaffolding with modular directory structures.
  - SQLAlchemy model bindings and Alembic migration scripts.
  - Docker & Docker Compose setup representing `PostgreSQL`, `Redis`, and `Celery`.

### Milestone 2: Core Domain Logic & Ledger Systems (Weeks 3-4)
* **Goal**: Complete the application controllers, domain logic, and financial ledger services.
* **Deliverables**:
  - User profiles and JWT authentication endpoints.
  - Journey crud operations and dynamic journey type configuration.
  - Expense Ledger logic, including multi-party splits.
  - Stripe/Ozow/Yoco payment handlers, webhook routes, and balance settlement matching.
  - Audit logging middleware for compliance tracking.

### Milestone 3: Specialized AI Agent Orchestration (Weeks 5-6)
* **Goal**: Implement the specialized travel AI agents and LangGraph router.
* **Deliverables**:
  - Central OpenAI provider adapter.
  - Planner, Destination, Budget, and Visa agents implemented in Python.
  - LangGraph state models coordinating requests.
  - AI Receipt processing pipeline (OCR parsing uploaded PDFs/images and triggering ledger updates).

### Milestone 4: Command Palette & Premium UI Dashboard (Weeks 7-8)
* **Goal**: Deliver a premium desktop client with interactive workspace canvases.
* **Deliverables**:
  - Global `Cmd+K` command palette for rapid navigation and search.
  - Workspace Canvas: Journey timeline slider, interactive vector maps, and expense ledger boards.
  - Corporate Portal: Department spending reports, policy configurations, and approval actions.
  - Client state optimization using React Query.

### Milestone 5: Quality Assurance & Production Release (Week 9)
* **Goal**: End-to-end testing, security audits, and production container builds.
* **Deliverables**:
  - Backend integration test suites (`pytest`).
  - Webhook simulation scripts validating ledger auto-balancing.
  - Nginx configurations and production Docker builds.
