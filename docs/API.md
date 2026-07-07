# API Documentation - Kova

This document defines the REST API endpoints, request schemas, and responses for Kova. The API is versioned under `/api/v1`.

---

## 1. Authentication

### Register a User
- **Method**: `POST`
- **Path**: `/api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "email": "traveller@example.com",
    "password": "SecurePassword123",
    "first_name": "John",
    "last_name": "Doe",
    "country_code": "USA"
  }
  ```
- **Response** (Status `201 Created`):
  ```json
  {
    "id": "e4b37063-455b-4c07-b08e-5bdf8e9868e4",
    "email": "traveller@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "system_role": "user"
  }
  ```

### Generate JWT Token
- **Method**: `POST`
- **Path**: `/api/v1/auth/token`
- **Request Form Data**:
  - `username`: `traveller@example.com`
  - `password`: `SecurePassword123`
- **Response** (Status `200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```

---

## 2. Journey Endpoints

### Create a Journey
- **Method**: `POST`
- **Path**: `/api/v1/journeys`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "Summer Holiday in Italy",
    "journey_type_code": "holiday",
    "start_date": "2026-08-01",
    "end_date": "2026-08-15"
  }
  ```
- **Response** (Status `201 Created`):
  ```json
  {
    "id": "7bf31758-a83d-4c3e-8bc8-888de136ee18",
    "title": "Summer Holiday in Italy",
    "status": "planning",
    "start_date": "2026-08-01",
    "end_date": "2026-08-15",
    "created_at": "2026-07-07T14:00:00Z"
  }
  ```

### Fetch Journeys
- **Method**: `GET`
- **Path**: `/api/v1/journeys`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (Status `200 OK`):
  ```json
  [
    {
      "id": "7bf31758-a83d-4c3e-8bc8-888de136ee18",
      "title": "Summer Holiday in Italy",
      "status": "planning",
      "start_date": "2026-08-01",
      "end_date": "2026-08-15"
    }
  ]
  ```

---

## 3. Expense & Ledger Endpoints

### Create Expense
- **Method**: `POST`
- **Path**: `/api/v1/journeys/{journey_id}/expenses`
- **Request Body**:
  ```json
  {
    "description": "Team Dinner in Florence",
    "amount": 250.00,
    "currency": "EUR",
    "category": "food",
    "expense_date": "2026-08-03",
    "splits": [
      {
        "user_id": "e4b37063-455b-4c07-b08e-5bdf8e9868e4",
        "share_amount": 125.00
      },
      {
        "user_id": "9bc32345-565b-4a07-c08f-6bdf9e9878f5",
        "share_amount": 125.00
      }
    ]
  }
  ```
- **Response** (Status `201 Created`):
  ```json
  {
    "id": "4ac88e99-4c12-4043-982d-425cc02d0cf1",
    "journey_id": "7bf31758-a83d-4c3e-8bc8-888de136ee18",
    "amount": 250.00,
    "currency": "EUR",
    "category": "food",
    "description": "Team Dinner in Florence"
  }
  ```

### Payment Webhooks
Used for receiving payments from Stripe, Ozow, or Yoco, updating the Journey ledger.
- **Method**: `POST`
- **Path**: `/api/v1/payments/webhook/{provider}` (e.g. `/api/v1/payments/webhook/stripe`)
- **Headers**: Signature headers (e.g., `Stripe-Signature`)
- **Request Body**: Raw payment payload.
- **Response** (Status `200 OK`):
  ```json
  {
    "received": true
  }
  ```

---

## 4. AI & Voice Assistant

### Send Message to Journey Concierge
- **Method**: `POST`
- **Path**: `/api/v1/journeys/{journey_id}/concierge`
- **Request Body**:
  ```json
  {
    "message": "Find a flight to Florence from London on August 1st."
  }
  ```
- **Response** (Status `200 OK`):
  ```json
  {
    "reply": "I found 3 economy flight options from London (LHR) to Florence (FLR) departing on August 1st. Direct options start at €120 on British Airways.",
    "timeline_updates": [
      {
        "title": "Suggested Flight: LHR to FLR",
        "carrier": "BA",
        "flight_number": "BA0524",
        "departure": "2026-08-01T08:15:00Z"
      }
    ]
  }
  ```

---

## 5. Receipt Scanning (Receipt AI)

### Upload Receipt File
- **Method**: `POST`
- **Path**: `/api/v1/receipts/upload`
- **Request Body**: Multipart form data with file attachment.
- **Response** (Status `202 Accepted`):
  ```json
  {
    "receipt_id": "9ac18e22-4c22-4043-982d-425cc02d0cf9",
    "status": "pending",
    "message": "Receipt processing queued."
  }
  ```
