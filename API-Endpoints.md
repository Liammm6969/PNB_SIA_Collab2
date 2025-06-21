# API Endpoints

## General
- `GET /api/Philippine-National-Bank/` — Welcome/info
- `GET /api/Philippine-National-Bank/health` — Health check

## Payments (`http://localhost:4000/api/Philippine-National-Bank/payments`)
- `POST /` — Create a payment
- `GET /user-payments/:userId` — Get all payments for a user
- `GET /:id` — Get payment by ID
- `PUT /:id` — Transfer (update) a payment by ID
- `DELETE /:id` — Delete a payment by ID
- `POST /transfer` — Transfer money

## Transactions (`http://localhost:4000/api/Philippine-National-Bank/transactions`)
- `POST /` — Create a transaction
- `GET /user/:userId` — Get all transactions for a user
- `GET /transaction/:id` — Get transaction by ID
- `PATCH /:id/status` — Update transaction status
- `DELETE /:id` — Delete a transaction by ID

## Users (`http://localhost:4000/api/Philippine-National-Bank/users`)
- `POST /register` — Register a new user
- `POST /login` — Login a user
- `GET /:id` — Get user profile by ID
- `GET /` — List all users

**Note:** All endpoints (except register/login) require authentication.
