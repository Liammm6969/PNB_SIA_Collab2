# 🧑‍💼 User Service - Account Registration Example


**Example Request Body:**
```json
{
  "fullName": "JaneDoe",
  "email": "jane.doe@example.com",
  "password": "1234A5678#",
  "address": "456 Elm St, City, Country",
  "gender": "Female",
  "dateOfBirth": "12-31-2024",
  "withdrawalMethods": [
    {
      "type": "Bank Transfer",
      "cardNumber": "121232345678",
      "local": true
    }
  ]
}
```

> **Note:** The password is never stored in plain text. It is hashed automatically by the backend service during registration.

# 🔐 Access Control by Department

| Resource / Function         | Admin                                 | Finance                        | Business Owner           |
|----------------------------|---------------------------------------|-------------------------------|--------------------------|
| **User Service**           | ✅ Full Access (all users)             | 🔎 View users (read-only)      | 👤 View own profile      |
| ➕ Register Users           | ✅ Yes                                 | ❌ No                          | ❌ No                    |
| 🔄 Assign Roles / Update   | ✅ Yes                                 | ❌ No                          | ❌ No                    |
| 🗂 Get All Users            | ✅ Yes                                 | 🔎 Filter by role              | ❌ No                    |
| 👤 Get User by ID           | ✅ Any                                 | ✅ Any                         | ✅ Only self             |
|                            |                                       |                               |                          |
| **Transaction Service**    | 🔎 View All                            | ✅ Full Access                 | 👀 View own transactions |
| 📝 Create Transaction Logs | ✅ Yes                                 | ✅ Yes                         | ✅ Yes (via Payment)     |
| 📊 View Transaction Reports| ✅ All Users                            | ✅ All Users                   | ✅ Only Self             |
|                            |                                       |                               |                          |
| **Payment Service**        | 🔎 Audit Only                          | ✅ Full Access                 | ✅ Can Send Payments     |
| 🔄 Make Payments           | ❌ No                                  | ✅ On behalf of others         | ✅ To vendors or users   |
| 🧾 View All Payments       | ✅ Yes                                 | ✅ Yes                         | ✅ Own history           |
| 🧮 Balance Update Rights   | ❌ No                                  | ✅ Yes                         | ⚠️ Indirect via API      |

# 🧑‍💼 User Service - Login Example

Use the following credentials to log in (the password is securely hashed and not stored in plain text):

**Example Login Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "password": "1234A5678#"
}
```

> **Note:** The password is hashed by the backend during registration and compared securely during login.
