# 🧑‍💼 User Service - Banking System Microservice

Handles all operations related to user registration, profile management, and user data storage.

---

## 🧠 Responsibilities

- User registration with hashed password
- Fetching user profile data
- Stores KYC information like name, DOB, gender, and withdrawal methods
- Maintains wallet balance (read-only for now — modified by Payment Service)

---

## 📁 Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- bcryptjs
- dotenv

---

## 🚀 Setup

```bash
npm install
npm run start
