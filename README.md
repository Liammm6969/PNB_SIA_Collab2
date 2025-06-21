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
