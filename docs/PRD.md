# Product Requirements Document (PRD) - Kova

## 1. Product Overview

### Product Name
**Kova**

### Tagline
*The AI Journey Operating System*

### Mission
Kova is the operating system for travel. It plans, coordinates, manages, and executes journeys for individuals, groups, and businesses. Kova is **NOT** another booking website. It is an orchestration engine that sits on top of travel, financial, and AI infrastructure to manage the lifecycle of a journey from conception to post-trip settlement.

---

## 2. Core Philosophy

The primary entity in Kova is **not** the user. The primary entity is the **Journey**.
Everything in the platform belongs to a Journey. A user exists in Kova in relation to the Journeys they participate in, coordinate, or approve.

### Journey-Centric Data Model
The following modules are scoped under and belong to a `Journey`:
- **Members**: Travellers, coordinators, treasurers, and viewers.
- **Timeline**: Chronological events, flights, accommodation, activities, and transport.
- **Budget & Ledger**: Expenses, transaction confirmations, contributions, and balance settlements.
- **Bookings**: Flights, hotels, activities, and dining reservations.
- **Compliance & Docs**: Visas, insurance policies, passports, and packing checklists.
- **Collaboration**: Message threads, task boards, and member polls (voting).
- **AI Context**: Real-time itinerary suggestions, memory store, and context logs.

---

## 3. User & Journey Types

### User Types
Kova supports the following distinct user roles and profiles from Version 1:
1. **Personal Traveller**: Individual managing personal trips.
2. **Couples / Families / Friends**: Group travellers sharing timeline views and split expenses.
3. **Corporate Employees**: Travel requestors who follow corporate travel policies.
4. **Corporate Managers**: Approvers in the travel request workflow.
5. **Finance Teams**: Reviewers of budgets, cost centres, and expense exports.
6. **Travel Coordinators / Agencies**: Heavy users managing logistics for multiple third parties.
7. **System Administrators**: System-wide configuration, audit monitoring, and provider management.

### Journey Types
The system supports polymorphic journey types, and must allow additions dynamically:
- Holiday, Business Trip, Conference, Wedding, Retreat, Sports Tour, Family Vacation, School Tour, Group Getaway, Medical Travel, Relocation, Pilgrimage, Custom Journey.

---

## 4. Comprehensive Feature Set

### 4.1 Journey Workspace & Dashboards
- **Journey Workspace**: A unified desktop-class canvas featuring an interactive timeline, calendar, and map.
- **Global Command Palette**: Instant navigation and command execution via `Ctrl+K` / `Cmd+K`.
- **AI Concierge**: A persistent side-panel conversational agent linked to the Journey's context.

### 4.2 Payments & Ledger System (Non-Custodial)
- **Payment Philosophy**: Kova is **not** a bank, does **not** store customer money, and does **not** issue virtual cards.
- **The Treasurer Model**: Every journey designates exactly one member as the **Treasurer**. All contributions are made directly to the Treasurer's account.
- **Provider Integrations**:
  - **Stripe** (International credit/debit card, Apple Pay, Google Pay).
  - **Yoco** (South African card payments).
  - **Ozow** (Instant EFT).
- **Reconciliation**: Payments are verified using provider webhooks. Once confirmed, Kova automatically logs a credit in the Journey Ledger. Manual payment confirmation is supported for unsupported channels or local cash.

### 4.3 Receipt AI & Expense Management
- **Receipt Parsing Pipeline**: Users upload PDFs, screenshots, photos, or emails.
- **Extraction Schema**:
  - Merchant name, date, country, currency, total amount, tax amount.
  - Category, suggested cost-split, related booking, and journey timeline day.
- **Automated Settlement**: Generates settlement reports showing who owes whom and links to quick settlement options.

### 4.4 Corporate Mode
- **Organizational Hierarchies**: Companies can define Organizations, Departments, and Cost Centres.
- **Travel Policies**: Strict spending caps, allowed classes of travel (e.g., economy vs. business class), and approved booking regions.
- **Approval Workflows**: Multi-stage approval chains (Manager -> Finance Reviewer -> Booking Confirmation).
- **ERP Integration**: Abstract adapters for exporting travel data to ERP solutions (e.g., SAP, NetSuite).

### 4.5 AI Agent Orchestration
Kova runs a decentralized multi-agent system coordinating through a central **Orchestrator**:
- **Planner Agent**: Synthesizes custom timelines.
- **Visa Agent**: Audits member passports against destinations to alert about visa requirements.
- **Budget Agent**: Validates costs and split logic.
- **Policy Agent**: Checks employee actions against corporate travel guidelines.
- **Memory Agent**: Persists user preferences and habits across journeys.
- *Additional specialized agents*: Destination, Flight, Hotel, Activity, Weather, Finance, Ledger, Receipt, Approval, Recommendation, Notification, and Analytics.

---

## 5. Technical Non-negotiables

- **Security**: Zero storage of raw financial details; all file uploads encrypted at rest.
- **Performance**: Sub-100ms API response times for workspace actions; optimized caching of GDS/search results in Redis.
- **Offline Capabilities**: Local-first sync on the client for mobile travellers losing signal.
- **Clean Architecture**: Domain layer remains decoupled from libraries, database drivers, and frameworks.
