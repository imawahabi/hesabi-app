# Technical Specifications

## 1. 🛠️ Tech Stack

- **Frontend:** React Native (Expo) + NativeWind for styling
- **Authentication:** Clerk
- **Database (Online):** Neon (Postgres)
- **Offline Cache:** SQLite (using expo-sqlite or WatermelonDB)
- **State Management:** Zustand or React Query (for syncing with the DB)
- **Notifications:** Expo Notifications

## 2. 🗂️ Expanded Database Schema

### Users
- `id` (UUID, Primary Key) - Provided by Clerk
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `created_at` (TIMESTAMP, NOT NULL)

### Commitments
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to Users.id)
- `type` (ENUM: 'bank', 'company', 'personal', 'saving')
- `source` (VARCHAR(255), NOT NULL) - e.g., "NBK", "Zain", "Abdullah"
- `amount_total` (DECIMAL(10, 2), NOT NULL)
- `interest_rate` (DECIMAL(5, 2), NULLABLE)
- `monthly_payment` (DECIMAL(10, 2), NOT NULL)
- `start_date` (DATE, NOT NULL)
- `end_date` (DATE, NOT NULL)
- `status` (ENUM: 'active', 'closed')

### Payments
- `id` (UUID, Primary Key)
- `commitment_id` (UUID, Foreign Key to Commitments.id)
- `paid_amount` (DECIMAL(10, 2), NOT NULL)
- `paid_date` (DATE, NOT NULL)
- `status` (ENUM: 'on_time', 'late')

### Incomes
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to Users.id)
- `type` (ENUM: 'salary', 'freelance', 'investment')
- `amount` (DECIMAL(10, 2), NOT NULL)
- `date` (DATE, NOT NULL)

**Relationships:**
- A `User` can have many `Commitments` and many `Incomes` (one-to-many).
- A `Commitment` can have many `Payments` (one-to-many).

## 3. 🧩 Detailed API Endpoints

### POST /commitments

- **Description:** Adds a new commitment.
- **Request Body:**
```json
{
  "type": "bank",
  "source": "NBK",
  "amount_total": 10000.00,
  "interest_rate": 5.00,
  "monthly_payment": 250.00,
  "start_date": "2024-01-01",
  "end_date": "2028-01-01"
}
```
- **Response (201 Created):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "type": "bank",
  "source": "NBK",
  "amount_total": 10000.00,
  "interest_rate": 5.00,
  "monthly_payment": 250.00,
  "start_date": "2024-01-01",
  "end_date": "2028-01-01",
  "status": "active"
}
```

### GET /commitments

- **Description:** Retrieves all commitments for the authenticated user.
- **Response (200 OK):**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "type": "bank",
    "source": "NBK",
    "amount_total": 10000.00,
    "monthly_payment": 250.00,
    "remaining_amount": 7500.00
  }
]
```

### GET /commitments/{id}

- **Description:** Retrieves details for a specific commitment.
- **Response (200 OK):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "type": "bank",
  "source": "NBK",
  "amount_total": 10000.00,
  "interest_rate": 5.00,
  "monthly_payment": 250.00,
  "start_date": "2024-01-01",
  "end_date": "2028-01-01",
  "status": "active",
  "payments": [
    {
      "id": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
      "paid_amount": 250.00,
      "paid_date": "2024-02-01",
      "status": "on_time"
    }
  ]
}
```

### POST /commitments/{id}/payments

- **Description:** Adds a payment to a commitment.
- **Request Body:**
```json
{
  "paid_amount": 250.00,
  "paid_date": "2024-03-01"
}
```
- **Response (201 Created):**
```json
{
  "id": "12345678-90ab-cdef-1234-567890abcdef",
  "paid_amount": 250.00,
  "paid_date": "2024-03-01",
  "status": "on_time"
}
```