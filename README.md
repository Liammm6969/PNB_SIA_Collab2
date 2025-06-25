# 🏦 Philippine National Bank - Multi-Role Banking System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5+-orange.svg)](https://expressjs.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3+-purple.svg)](https://getbootstrap.com/)

> A comprehensive multi-role banking system with centralized balance logic, role-based dashboards, and secure financial operations management.

## 📌 Project Overview

This banking system implements a **centralized balance architecture** where all financial operations are managed through a central bank reserve system. The application supports multiple user roles with dedicated dashboards and specialized functionalities for different banking operations.

### 🎯 Key Features
- 🏦 **Centralized Bank Reserve Management** - All deposits/withdrawals affect the central bank balance
- 👤 **Multi-Role Authentication** - Separate interfaces for Users, Finance Staff, and Administrators  
- 📈 **Real-time Financial Analytics** - Live dashboards with transaction monitoring
- 🛠️ **Role-Based Access Control** - Department-specific permissions and workflows
- 💰 **Secure Money Transfers** - User-to-user transfers with balance validation
- 📊 **Comprehensive Reporting** - Financial reports and transaction statements

## 🛠️ Tech Stack

| **Layer** | **Technology** | **Purpose** |
|-----------|---------------|-------------|
| **Frontend** | React 19 + Vite | Modern UI with fast development |
| **UI Framework** | React Bootstrap 5.3 | Responsive design components |
| **Backend** | Node.js + Express 5 | RESTful API server |
| **Database** | MongoDB + Mongoose | NoSQL document storage |
| **Authentication** | JWT + Session-based | Secure user authentication |
| **Styling** | Bootstrap + Custom CSS | Professional banking interface |
| **State Management** | React Hooks | Component state management |
| **API Client** | Axios | HTTP request handling |
| **Development** | Nodemon + ESLint | Development tools |

## 🎭 Features by Department

### 👥 **User Features** (Customer Portal)
#### Functional Features:
- ✅ **Account Dashboard** - Balance overview and account information
- ✅ **Money Transfers** - Send money to other users with beneficiary management
- ✅ **Deposit Requests** - Request deposits (requires finance approval)
- ✅ **Transaction History** - Detailed transaction statements with filtering
- ✅ **Profile Management** - Personal/business account information
- ✅ **Balance Visibility Toggle** - Privacy control for balance display

#### Non-Functional Features:
- 🔒 **Security** - JWT-based authentication with session management
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Live balance and transaction updates
- 🎨 **Modern UI** - Glass morphism design with smooth animations

### 💼 **Finance Department Features** (Staff Portal)
#### Functional Features:
- ✅ **Finance Dashboard** - Overview of deposit requests and bank reserve
- ✅ **Deposit Management** - Approve/reject customer deposit requests
- ✅ **Bank Reserve Management** - Monitor and manage central bank balance
- ✅ **Transaction Monitoring** - View all system transactions
- ✅ **Financial Reports** - Generate various financial reports (PDF, Excel, CSV)
- ✅ **Analytics** - Deposit statistics and success ratios

#### Non-Functional Features:
- 📊 **Advanced Analytics** - Real-time financial metrics and KPIs
- 🔐 **Role-based Access** - Finance-only features and permissions
- 📋 **Audit Trail** - Complete logging of all financial operations
- 🎯 **Workflow Management** - Structured approval processes

### 🛡️ **Admin Features** (Administrative Portal)
#### Functional Features:
- ✅ **Admin Dashboard** - System overview with user and transaction statistics
- ✅ **User Management** - Create, view, and manage customer accounts
- ✅ **Staff Management** - Add/remove staff members across departments
- ✅ **System Statistics** - Monitor total users, transactions, and revenue
- ✅ **Security Alerts** - System security monitoring
- ✅ **Department Management** - Organize staff by Finance/Admin/Loan departments

#### Non-Functional Features:
- 🏗️ **System Administration** - Complete system control and configuration
- 👥 **Multi-department Support** - Manage different staff departments
- 📈 **Business Intelligence** - High-level business metrics and insights
- 🔧 **System Maintenance** - Administrative tools and utilities

## 🏗️ System Architecture

### 🏦 Centralized Banking Logic
The system implements a **centralized balance architecture**:

```
User Deposits → Finance Approval → Central Bank Reserve ↓ → User Balance ↑
User Transfers → User A Balance ↓ → User B Balance ↑ (No reserve change)
User Withdrawals → User Balance ↓ → Central Bank Reserve ↑
```

### 🔄 Transaction Flow
1. **Deposit Request**: User → Finance Review → Approval → Bank Reserve Deduction → User Credit
2. **Money Transfer**: User A → Balance Check → Transfer → User B Credit (Internal)
3. **Bank Reserve**: Tracks total system liquidity and regulatory compliance

### 🗂️ Database Models
- **Users** - Customer accounts (Personal/Business)
- **Staff** - Finance/Admin employees with departments
- **Payments** - All financial transactions
- **DepositRequests** - Pending deposit approvals
- **BankReserve** - Central bank balance tracking
- **Beneficiaries** - User's saved transfer recipients

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PNB_SIA
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in the server directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/pnb_banking
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   
   # Server Configuration
   PORT=4000
   HOST=localhost
   
   # Email Configuration (Optional)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the application**
   ```bash
   # Start the server (from server directory)
   npm start
   
   # Start the client (from client directory)
   npm run dev
   ```

5. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:4000
   - **API Health Check**: http://localhost:4000/api/Philippine-National-Bank/health

## 🔐 User Roles & Access

### 👤 Customer Users
- **Login**: Email + Password
- **Access**: User dashboard, transfers, deposits, statements
- **Permissions**: Own account operations only

### 💼 Finance Staff
- **Login**: Staff ID (e.g., STAFF_3000) + Password
- **Access**: Finance dashboard, deposit approvals, bank reserve
- **Permissions**: Financial operations and approvals

### 🛡️ Admin Staff
- **Login**: Staff ID + Password  
- **Access**: Admin dashboard, user management, staff management
- **Permissions**: System administration and oversight

## 📚 API Documentation Wiki

### 🌐 Base URL
```
http://localhost:4000/api/Philippine-National-Bank
```

---

## 🔑 Authentication Endpoints

### User Authentication

#### `POST /users/login` - User Login
**Description:** Authenticate a customer user with email and password.

**Request Body:**
```json
{
  "email": "john.doe@email.com",
  "password": "userPassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login Successful.",
  "userId": "USER_1001"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "User not found"
}
```

---

#### `POST /users/register` - User Registration
**Description:** Register a new customer user account (Personal or Business).

**Request Body (Personal Account):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "password": "securePassword123",
  "accountType": "personal",
  "balance": 5000.00
}
```

**Request Body (Business Account):**
```json
{
  "businessName": "ABC Corporation",
  "email": "contact@abccorp.com",
  "password": "businessPass456",
  "accountType": "business",
  "balance": 25000.00
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "userId": "USER_1002",
  "accountNumber": "ACC-2025-001234",
  "accountType": "personal"
}
```

---

#### `POST /staff/login` - Staff Login
**Description:** Authenticate staff members with Staff ID and password.

**Request Body:**
```json
{
  "staffStringId": "STAFF_3000",
  "password": "staffPassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login Successful",
  "staffId": 3000,
  "staffStringId": "STAFF_3000",
  "department": "Finance",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@pnb.com"
}
```

---

## 👥 User Management Endpoints

#### `GET /users/` - List All Users
**Description:** Retrieve all registered users (Admin access).

**Response (200 OK):**
```json
[
  {
    "userId": "USER_1001",
    "userIdSeq": 1001,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "accountNumber": "ACC-2025-001233",
    "balance": 5000.00,
    "accountType": "personal",
    "createdAt": "2025-06-25T10:30:00.000Z"
  },
  {
    "userId": "USER_1002",
    "userIdSeq": 1002,
    "businessName": "ABC Corporation",
    "email": "contact@abccorp.com",
    "accountNumber": "ACC-2025-001234",
    "balance": 25000.00,
    "accountType": "business",
    "createdAt": "2025-06-25T11:45:00.000Z"
  }
]
```

---

#### `GET /users/:userId` - Get User Profile
**Description:** Retrieve specific user profile information.

**URL Parameters:**
- `userId` (string): User identifier (e.g., "USER_1001")

**Response (200 OK):**
```json
{
  "userId": "USER_1001",
  "userIdSeq": 1001,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "accountNumber": "ACC-2025-001233",
  "balance": 5000.00,
  "accountType": "personal",
  "createdAt": "2025-06-25T10:30:00.000Z",
  "updatedAt": "2025-06-25T15:20:00.000Z"
}
```

---

#### `GET /users/seq/:userIdSeq` - Get User by Sequence ID
**Description:** Retrieve user by sequential ID for internal operations.

**URL Parameters:**
- `userIdSeq` (number): Sequential user ID (e.g., 1001)

**Response (200 OK):**
```json
{
  "userId": "USER_1001",
  "userIdSeq": 1001,
  "firstName": "John",
  "lastName": "Doe",
  "balance": 5000.00,
  "accountType": "personal"
}
```

---

## 💰 Financial Operations Endpoints

#### `GET /payments/user-payments/:userId` - Get User Transactions
**Description:** Retrieve all payments/transactions for a specific user.

**URL Parameters:**
- `userId` (string): User identifier

**Response (200 OK):**
```json
[
  {
    "paymentId": "PAY_2025_001",
    "paymentStringId": "PAY_2025_001",
    "fromUser": 0,
    "toUser": 1001,
    "amount": 1000.00,
    "details": "Initial deposit",
    "balanceAfterPayment": 6000.00,
    "createdAt": "2025-06-25T14:30:00.000Z"
  },
  {
    "paymentId": "PAY_2025_002",
    "paymentStringId": "PAY_2025_002",
    "fromUser": 1001,
    "toUser": 1002,
    "amount": 500.00,
    "details": "Transfer to ABC Corp",
    "balanceAfterPayment": 5500.00,
    "createdAt": "2025-06-25T15:15:00.000Z"
  }
]
```

---

#### `POST /transactions/transfer` - Money Transfer
**Description:** Transfer money between user accounts.

**Request Body:**
```json
{
  "fromUser": "USER_1001",
  "toUser": "USER_1002",
  "amount": 250.00,
  "details": "Payment for services"
}
```

**Alternative Request (using Account Numbers):**
```json
{
  "fromUser": "ACC-2025-001233",
  "toUser": "ACC-2025-001234",
  "amount": 250.00,
  "details": "Monthly subscription"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Transfer completed successfully",
  "transaction": {
    "transactionId": "TXN_2025_003",
    "fromUser": 1001,
    "toUser": 1002,
    "amount": 250.00,
    "details": "Payment for services",
    "senderBalanceAfter": 5250.00,
    "receiverBalanceAfter": 25250.00,
    "createdAt": "2025-06-25T16:00:00.000Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Sender does not have enough balance"
}
```

---

#### `GET /payments/user-statements/:userId` - Get User Statements
**Description:** Get detailed transaction statements with filtering options.

**URL Parameters:**
- `userId` (string): User identifier

**Query Parameters:**
- `startDate` (string, optional): Filter from date (YYYY-MM-DD)
- `endDate` (string, optional): Filter to date (YYYY-MM-DD)
- `type` (string, optional): Transaction type filter
- `status` (string, optional): Status filter

**Example Request:**
```
GET /payments/user-statements/USER_1001?startDate=2025-06-01&endDate=2025-06-30&type=transfer
```

**Response (200 OK):**
```json
[
  {
    "id": "PAY_2025_001",
    "type": "deposit",
    "amount": 1000.00,
    "description": "Bank deposit - approved by STAFF_3000",
    "date": "2025-06-25T14:30:00.000Z",
    "status": "completed",
    "balanceAfter": 6000.00,
    "otherParty": "Philippine National Bank"
  },
  {
    "id": "PAY_2025_002",
    "type": "transfer_out",
    "amount": -500.00,
    "description": "Transfer to ABC Corporation",
    "date": "2025-06-25T15:15:00.000Z",
    "status": "completed",
    "balanceAfter": 5500.00,
    "otherParty": "ABC Corporation"
  }
]
```

---

## 🏦 Bank Reserve Management Endpoints

#### `GET /bank/reserve` - Get Bank Reserve Status
**Description:** Get current bank reserve balance and information.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_balance": 1500000.00,
    "last_transaction_type": "deposit",
    "last_transaction_amount": 1000.00,
    "last_transaction_id": "PAY_2025_001",
    "created_date": "2025-06-01T08:00:00.000Z",
    "last_updated": "2025-06-25T14:30:00.000Z"
  }
}
```

---

#### `GET /bank/reserve/stats` - Get Reserve Statistics
**Description:** Get detailed bank reserve statistics and analytics.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_balance": 1500000.00,
    "total_deposits_today": 5,
    "total_withdrawals_today": 2,
    "reserve_ratio": 75.5,
    "last_transaction": {
      "type": "deposit",
      "amount": 1000.00,
      "date": "2025-06-25T14:30:00.000Z"
    },
    "created_date": "2025-06-01T08:00:00.000Z",
    "last_updated": "2025-06-25T14:30:00.000Z"
  }
}
```

---

#### `POST /bank/reserve/initialize` - Initialize Bank Reserve
**Description:** Initialize or reset bank reserve (Admin only).

**Request Body:**
```json
{
  "initialAmount": 2000000.00
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Bank reserve initialized successfully",
  "data": {
    "total_balance": 2000000.00,
    "created_date": "2025-06-25T16:30:00.000Z"
  }
}
```

---

## 📝 Deposit Request Management Endpoints

#### `GET /deposit-requests/` - Get All Deposit Requests
**Description:** Retrieve all deposit requests (Finance staff access).

**Query Parameters:**
- `status` (string, optional): Filter by status (Pending, Approved, Rejected)
- `limit` (number, optional): Limit number of results

**Example Request:**
```
GET /deposit-requests/?status=Pending&limit=10
```

**Response (200 OK):**
```json
[
  {
    "id": "DEP_2025_001",
    "depositRequestStringId": "DEP_2025_001",
    "userIdSeq": 1001,
    "customerName": "John Doe",
    "accountNumber": "ACC-2025-001233",
    "accountType": "personal",
    "amount": 1500.00,
    "status": "Pending",
    "note": "Salary deposit",
    "createdAt": "2025-06-25T09:00:00.000Z",
    "userId": "USER_1001"
  },
  {
    "id": "DEP_2025_002",
    "depositRequestStringId": "DEP_2025_002",
    "userIdSeq": 1002,
    "customerName": "ABC Corporation",
    "accountNumber": "ACC-2025-001234",
    "accountType": "business",
    "amount": 5000.00,
    "status": "Approved",
    "note": "Business revenue deposit",
    "processedBy": "STAFF_3000",
    "processedAt": "2025-06-25T10:30:00.000Z",
    "createdAt": "2025-06-25T09:30:00.000Z",
    "userId": "USER_1002"
  }
]
```

---

#### `POST /deposit-requests/` - Create Deposit Request
**Description:** Create a new deposit request (User access).

**Request Body:**
```json
{
  "userId": "USER_1001",
  "amount": 1500.00,
  "note": "Monthly salary deposit"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Deposit request created successfully",
  "depositRequest": {
    "id": "DEP_2025_003",
    "depositRequestStringId": "DEP_2025_003",
    "userIdSeq": 1001,
    "amount": 1500.00,
    "status": "Pending",
    "note": "Monthly salary deposit",
    "createdAt": "2025-06-25T16:45:00.000Z"
  }
}
```

---

#### `POST /deposit-requests/:depositRequestId/approve` - Approve Deposit
**Description:** Approve a pending deposit request (Finance staff only).

**URL Parameters:**
- `depositRequestId` (string): Deposit request ID

**Request Body:**
```json
{
  "staffId": "STAFF_3000"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Deposit request DEP_2025_003 approved successfully",
  "updatedBalance": 6500.00,
  "processedBy": "STAFF_3000",
  "processedAt": "2025-06-25T17:00:00.000Z"
}
```

---

#### `POST /deposit-requests/:depositRequestId/reject` - Reject Deposit
**Description:** Reject a pending deposit request (Finance staff only).

**URL Parameters:**
- `depositRequestId` (string): Deposit request ID

**Request Body:**
```json
{
  "staffId": "STAFF_3000",
  "rejectionReason": "Insufficient documentation provided"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Deposit request DEP_2025_003 rejected successfully",
  "rejectionReason": "Insufficient documentation provided",
  "processedBy": "STAFF_3000",
  "processedAt": "2025-06-25T17:15:00.000Z"
}
```

---

#### `GET /deposit-requests/stats` - Get Deposit Statistics
**Description:** Get deposit request statistics (Finance staff access).

**Response (200 OK):**
```json
{
  "pending": {
    "count": 5,
    "totalAmount": 7500.00
  },
  "approved": {
    "count": 23,
    "totalAmount": 45000.00
  },
  "rejected": {
    "count": 2,
    "totalAmount": 3000.00
  },
  "processing": {
    "count": 1,
    "totalAmount": 2000.00
  }
}
```

---

## 👨‍💼 Staff Management Endpoints

#### `GET /staff/` - Get All Staff
**Description:** Retrieve all staff members (Admin access).

**Response (200 OK):**
```json
[
  {
    "staffId": 3000,
    "staffStringId": "STAFF_3000",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@pnb.com",
    "department": "Finance",
    "createdAt": "2025-06-01T08:00:00.000Z"
  },
  {
    "staffId": 3001,
    "staffStringId": "STAFF_3001",
    "firstName": "Mike",
    "lastName": "Johnson",
    "email": "mike.johnson@pnb.com",
    "department": "Admin",
    "createdAt": "2025-06-01T08:15:00.000Z"
  }
]
```

---

#### `POST /staff/` - Create Staff Member
**Description:** Create a new staff member (Admin access).

**Request Body:**
```json
{
  "firstName": "Sarah",
  "lastName": "Wilson",
  "email": "sarah.wilson@pnb.com",
  "password": "staffPassword456",
  "department": "Finance"
}
```

**Response (201 Created):**
```json
{
  "message": "Staff with ID 3002 created successfully",
  "staffId": 3002,
  "staffStringId": "STAFF_3002"
}
```

---

#### `GET /staff/:staffId` - Get Staff Member
**Description:** Get specific staff member details.

**URL Parameters:**
- `staffId` (number): Staff ID

**Response (200 OK):**
```json
{
  "staffId": 3000,
  "staffStringId": "STAFF_3000",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@pnb.com",
  "department": "Finance",
  "createdAt": "2025-06-01T08:00:00.000Z",
  "updatedAt": "2025-06-15T10:30:00.000Z"
}
```

---

#### `GET /staff/department/:department` - Get Staff by Department
**Description:** Get all staff members in a specific department.

**URL Parameters:**
- `department` (string): Department name (Finance, Admin, Loan)

**Response (200 OK):**
```json
[
  {
    "staffId": 3000,
    "staffStringId": "STAFF_3000",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@pnb.com",
    "department": "Finance"
  },
  {
    "staffId": 3003,
    "staffStringId": "STAFF_3003",
    "firstName": "David",
    "lastName": "Brown",
    "email": "david.brown@pnb.com",
    "department": "Finance"
  }
]
```

---

## 👥 Beneficiary Management Endpoints

#### `GET /beneficiaries/user/:userId` - Get User Beneficiaries
**Description:** Get all saved beneficiaries for a user.

**URL Parameters:**
- `userId` (string): User identifier

**Response (200 OK):**
```json
[
  {
    "beneficiaryId": "BEN_001",
    "userId": 1001,
    "recipientAccountNumber": "ACC-2025-001234",
    "recipientName": "ABC Corporation",
    "nickname": "Business Partner",
    "isActive": true,
    "createdAt": "2025-06-20T14:30:00.000Z"
  },
  {
    "beneficiaryId": "BEN_002",
    "userId": 1001,
    "recipientAccountNumber": "ACC-2025-001235",
    "recipientName": "Mary Johnson",
    "nickname": "Mom",
    "isActive": true,
    "createdAt": "2025-06-22T09:15:00.000Z"
  }
]
```

---

#### `POST /beneficiaries/` - Add Beneficiary
**Description:** Add a new beneficiary for transfers.

**Request Body:**
```json
{
  "userId": "USER_1001",
  "recipientAccountNumber": "ACC-2025-001236",
  "recipientName": "Robert Smith",
  "nickname": "Brother"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Beneficiary added successfully",
  "beneficiary": {
    "beneficiaryId": "BEN_003",
    "userId": 1001,
    "recipientAccountNumber": "ACC-2025-001236",
    "recipientName": "Robert Smith",
    "nickname": "Brother",
    "isActive": true,
    "createdAt": "2025-06-25T17:30:00.000Z"
  }
}
```

---

## 📊 Admin Dashboard Endpoints

#### `GET /admin/dashboard/stats` - Get Dashboard Statistics
**Description:** Get admin dashboard statistics.

**Response (200 OK):**
```json
{
  "totalUsers": 150,
  "totalTransactions": 2847,
  "totalRevenue": 125000.50,
  "securityAlerts": 0
}
```

---

#### `GET /admin/recent-users` - Get Recent Users
**Description:** Get recently registered users.

**Query Parameters:**
- `limit` (number, optional): Number of users to return (default: 10)

**Response (200 OK):**
```json
[
  {
    "userId": "USER_1005",
    "firstName": "Alice",
    "lastName": "Cooper",
    "email": "alice.cooper@email.com",
    "accountType": "personal",
    "balance": 2500.00,
    "createdAt": "2025-06-25T16:00:00.000Z"
  },
  {
    "userId": "USER_1004",
    "businessName": "Tech Solutions Ltd",
    "email": "info@techsolutions.com",
    "accountType": "business",
    "balance": 15000.00,
    "createdAt": "2025-06-25T14:30:00.000Z"
  }
]
```

---

#### `GET /admin/recent-transactions` - Get Recent Transactions
**Description:** Get recent system transactions.

**Query Parameters:**
- `limit` (number, optional): Number of transactions to return (default: 10)

**Response (200 OK):**
```json
[
  {
    "_id": "66bb123abc456def789",
    "transactionStringId": "TXN_2025_005",
    "fromUser": 1001,
    "toUser": 1002,
    "amount": 750.00,
    "details": "Service payment",
    "createdAt": "2025-06-25T16:45:00.000Z",
    "fromUserDetails": {
      "name": "John Doe",
      "accountNumber": "ACC-2025-001233"
    },
    "toUserDetails": {
      "name": "ABC Corporation",
      "accountNumber": "ACC-2025-001234"
    }
  }
]
```

---

## 🚨 Error Response Format

All endpoints follow a consistent error response format:

**400 Bad Request:**
```json
{
  "error": "Invalid request parameters",
  "details": "Amount must be greater than 0"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required",
  "message": "Please login to access this resource"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied",
  "message": "Insufficient permissions for this operation"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found",
  "message": "User with ID USER_9999 does not exist"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## 📋 Request Headers

Most endpoints require these headers:

```http
Content-Type: application/json
Authorization: Bearer <access_token>  // For protected routes
```

---

## 🔄 Status Codes Reference

| Code | Description | Usage |
|------|-------------|-------|
| `200` | OK | Successful GET, PUT, PATCH requests |
| `201` | Created | Successful POST requests |
| `204` | No Content | Successful DELETE requests |
| `400` | Bad Request | Invalid request data |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `500` | Internal Server Error | Server-side error |

## 🗃️ Database Schema

### User Model
```javascript
{
  userId: String,              // Unique user identifier
  userIdSeq: Number,          // Sequential ID for transactions
  firstName/lastName: String,  // Personal account
  businessName: String,       // Business account
  email: String,              // Login credential
  accountNumber: String,      // Bank account number
  balance: Number,            // Current balance
  accountType: String         // 'personal' | 'business'
}
```

### Staff Model
```javascript
{
  staffId: Number,            // Unique staff ID
  staffStringId: String,      // Display ID (STAFF_3000)
  firstName: String,
  lastName: String,
  email: String,
  department: String,         // 'Finance' | 'Admin' | 'Loan'
  password: String
}
```

### Bank Reserve Model
```javascript
{
  total_balance: Number,      // Central bank reserve
  last_transaction_type: String,
  last_transaction_amount: Number,
  created_date: Date,
  last_updated: Date
}
```

## 🛡️ Security Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛂 **Role-Based Access Control** - Department-specific permissions
- 🔒 **Password Security** - Encrypted password storage
- 🚨 **Transaction Validation** - Balance and permission checks
- 📝 **Audit Logging** - Complete transaction history
- 🛡️ **Input Validation** - Joi schema validation on all inputs

## 🎨 UI/UX Features

- 🌟 **Modern Design** - Glass morphism and gradient effects
- 📱 **Responsive Layout** - Works on all device sizes
- 🎯 **Intuitive Navigation** - Role-specific navigation menus
- 📊 **Data Visualization** - Charts and statistics dashboards
- ⚡ **Fast Loading** - Optimized with Vite build tool
- 🎨 **Consistent Theming** - Professional banking aesthetics

## 📈 Performance & Monitoring

- ⚡ **Fast API Responses** - Optimized database queries
- 📊 **Real-time Updates** - Live balance and transaction updates
- 🔍 **Error Handling** - Comprehensive error management
- 📝 **Logging** - Complete audit trail for all operations
- 🚀 **Scalable Architecture** - Modular and maintainable codebase

---

## 📖 Usage Examples

### Complete User Registration and Transfer Flow

1. **Register a User:**
```bash
curl -X POST http://localhost:4000/api/Philippine-National-Bank/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "password": "securePassword123",
    "accountType": "personal",
    "balance": 5000.00
  }'
```

2. **Login User:**
```bash
curl -X POST http://localhost:4000/api/Philippine-National-Bank/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "securePassword123"
  }'
```

3. **Transfer Money:**
```bash
curl -X POST http://localhost:4000/api/Philippine-National-Bank/transactions/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromUser": "USER_1001",
    "toUser": "USER_1002",
    "amount": 250.00,
    "details": "Payment for services"
  }'
```

### Finance Staff Workflow

1. **Staff Login:**
```bash
curl -X POST http://localhost:4000/api/Philippine-National-Bank/staff/login \
  -H "Content-Type: application/json" \
  -d '{
    "staffStringId": "STAFF_3000",
    "password": "staffPassword123"
  }'
```

2. **Get Pending Deposits:**
```bash
curl -X GET "http://localhost:4000/api/Philippine-National-Bank/deposit-requests/?status=Pending"
```

3. **Approve Deposit:**
```bash
curl -X POST http://localhost:4000/api/Philippine-National-Bank/deposit-requests/DEP_2025_001/approve \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": "STAFF_3000"
  }'
```

---

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file in the server directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/pnb_banking

# JWT Security
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here

# Server Configuration
PORT=4000
HOST=localhost
NODE_ENV=development

# Email Configuration (for OTP - Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Database Pool Settings
OPTIONS_DB_MINIMUMPOOLSIZE=5
OPTIONS_DB_MAXIMUMPOOLSIZE=30
OPTIONS_DB_SERVERSELECTIONTIMEOUTMILLISECONDS=5000
OPTIONS_DB_SOCKETTIMEOUTMILLISECONDS=45000

# Rate Limiting
API_RATE_LIMIT=100
LOGIN_RATE_LIMIT=5
```

### Database Connection Configuration

```javascript
// server/src/lib/config.js
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  PORT: process.env.PORT || 4000,
  HOST: process.env.HOST || 'localhost',
  mongoDb: {
    MONGO_URI: process.env.MONGO_URI,
    options: {
      minPoolSize: Number(process.env.OPTIONS_DB_MINIMUMPOOLSIZE || 5),
      maxPoolSize: Number(process.env.OPTIONS_DB_MAXIMUMPOOLSIZE || 30),
      serverSelectionTimeoutMS: process.env.OPTIONS_DB_SERVERSELECTIONTIMEOUTMILLISECONDS,
      socketTimeoutMS: process.env.OPTIONS_DB_SOCKETTIMEOUTMILLISECONDS,
    }
  }
}
```

---

## 🎯 Postman Collection

### Import this JSON collection into Postman:

```json
{
  "info": {
    "name": "Philippine National Bank API",
    "description": "Complete API collection for PNB Banking System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000/api/Philippine-National-Bank"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "User Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john.doe@email.com\",\n  \"password\": \"userPassword123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/users/login",
              "host": ["{{baseUrl}}"],
              "path": ["users", "login"]
            }
          }
        },
        {
          "name": "User Registration",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john.doe@email.com\",\n  \"password\": \"securePassword123\",\n  \"accountType\": \"personal\",\n  \"balance\": 5000.00\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/users/register",
              "host": ["{{baseUrl}}"],
              "path": ["users", "register"]
            }
          }
        },
        {
          "name": "Staff Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"staffStringId\": \"STAFF_3000\",\n  \"password\": \"staffPassword123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/staff/login",
              "host": ["{{baseUrl}}"],
              "path": ["staff", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Financial Operations",
      "item": [
        {
          "name": "Money Transfer",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fromUser\": \"USER_1001\",\n  \"toUser\": \"USER_1002\",\n  \"amount\": 250.00,\n  \"details\": \"Payment for services\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/transactions/transfer",
              "host": ["{{baseUrl}}"],
              "path": ["transactions", "transfer"]
            }
          }
        },
        {
          "name": "Get User Payments",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/payments/user-payments/USER_1001",
              "host": ["{{baseUrl}}"],
              "path": ["payments", "user-payments", "USER_1001"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🗂️ Database Models Reference

### Complete Schema Definitions

#### User Model (MongoDB Schema)
```javascript
const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  userIdSeq: {
    type: Number,
    unique: true
  },
  firstName: {
    type: String,
    required: function() { return this.accountType === 'personal'; }
  },
  lastName: {
    type: String,
    required: function() { return this.accountType === 'personal'; }
  },
  businessName: {
    type: String,
    required: function() { return this.accountType === 'business'; }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  accountType: {
    type: String,
    enum: ['personal', 'business'],
    required: true
  },
  otp: String,
  otpExpires: Date
}, {
  timestamps: true
});
```

#### Payment Model (Transaction Record)
```javascript
const PaymentSchema = new mongoose.Schema({
  paymentStringId: {
    type: String,
    unique: true
  },
  fromUser: {
    type: Number,
    required: true
  },
  toUser: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  details: {
    type: String,
    default: ''
  },
  balanceAfterPayment: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
```

#### Deposit Request Model
```javascript
const DepositRequestSchema = new mongoose.Schema({
  depositRequestStringId: {
    type: String,
    unique: true
  },
  userIdSeq: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  note: {
    type: String,
    default: ''
  },
  processedBy: String,
  processedAt: Date,
  rejectionReason: String
}, {
  timestamps: true
});
```

#### Staff Model
```javascript
const StaffSchema = new mongoose.Schema({
  staffId: {
    type: Number,
    unique: true
  },
  staffStringId: {
    type: String,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    enum: ['Finance', 'Admin', 'Loan'],
    required: true
  }
}, {
  timestamps: true
});
```

#### Bank Reserve Model
```javascript
const BankReserveSchema = new mongoose.Schema({
  total_balance: {
    type: Number,
    required: true,
    default: 0
  },
  last_transaction_type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'initialization']
  },
  last_transaction_amount: Number,
  last_transaction_id: String,
  created_date: {
    type: Date,
    default: Date.now
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});
```

---

## 🚀 Quick Start Scripts

### Development Setup Script
```bash
#!/bin/bash
# setup.sh - Quick development setup

echo "🏦 Setting up Philippine National Bank System..."

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

# Create environment file
echo "⚙️ Setting up environment..."
cd ../server
cat > .env << EOL
MONGO_URI=mongodb://localhost:27017/pnb_banking
JWT_SECRET=pnb_super_secure_jwt_secret_2025
JWT_REFRESH_SECRET=pnb_super_secure_refresh_secret_2025
PORT=4000
HOST=localhost
NODE_ENV=development
EOL

echo "✅ Setup complete!"
echo "🚀 Run 'npm start' in server folder and 'npm run dev' in client folder"
```

### Production Deployment Script
```bash
#!/bin/bash
# deploy.sh - Production deployment

echo "🚀 Deploying PNB Banking System..."

# Build client
cd client
npm run build

# Set production environment
cd ../server
export NODE_ENV=production

# Start server with PM2
pm2 start index.js --name "pnb-banking-api"
pm2 startup
pm2 save

echo "✅ Production deployment complete!"
```

---

## 🧪 Testing Examples

### Unit Test Examples

#### User Service Test
```javascript
// server/tests/user.service.test.js
const UserService = require('../src/services/user.service');

describe('UserService', () => {
  test('should register a new user', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      accountType: 'personal',
      balance: 1000
    };
    
    const result = await UserService.registerUser(userData);
    expect(result.userId).toBeDefined();
    expect(result.accountNumber).toBeDefined();
  });
});
```

#### API Integration Test
```javascript
// server/tests/api.integration.test.js
const request = require('supertest');
const app = require('../index');

describe('Authentication API', () => {
  test('POST /users/login should authenticate user', async () => {
    const response = await request(app)
      .post('/api/Philippine-National-Bank/users/login')
      .send({
        email: 'john.doe@email.com',
        password: 'userPassword123'
      });
      
    expect(response.status).toBe(200);
    expect(response.body.userId).toBeDefined();
  });
});
```

### Frontend Testing Examples

#### Component Test (React Testing Library)
```javascript
// client/src/tests/UserDashboard.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import UserDashboard from '../pages/_user/_userDashboard';

test('displays user balance correctly', async () => {
  render(<UserDashboard />);
  
  await waitFor(() => {
    expect(screen.getByText(/Current Balance/i)).toBeInTheDocument();
  });
});
```

---

## 🔍 Troubleshooting Guide

### Common Issues and Solutions

#### 1. Database Connection Issues
**Problem:** MongoDB connection failed
```
Error: MongoServerError: Authentication failed
```

**Solution:**
- Check MongoDB is running: `mongosh`
- Verify MONGO_URI in .env file
- Ensure database permissions are correct

#### 2. JWT Token Issues
**Problem:** Invalid access token errors
```
Error: Invalid access token
```

**Solution:**
- Check JWT_SECRET in environment
- Ensure token is passed in Authorization header
- Verify token hasn't expired

#### 3. Balance Validation Errors
**Problem:** Transfer fails with sufficient balance
```
Error: Sender does not have enough balance
```

**Solution:**
- Check user balance in database
- Verify transfer amount is positive
- Ensure sender and receiver exist

#### 4. Port Already in Use
**Problem:** Server won't start
```
Error: EADDRINUSE: address already in use :::4000
```

**Solution:**
```bash
# Find process using port 4000
netstat -ano | findstr :4000
# Kill the process
taskkill /PID <process_id> /F
```

---

## 📚 API Reference Summary

| Endpoint Category | Base Path | Authentication | Description |
|-------------------|-----------|----------------|-------------|
| **User Auth** | `/users/` | None for login/register | User authentication |
| **Staff Auth** | `/staff/` | None for login | Staff authentication |
| **User Management** | `/users/` | User/Admin | User CRUD operations |
| **Financial Ops** | `/transactions/`, `/payments/` | User/Staff | Money transfers, payments |
| **Deposits** | `/deposit-requests/` | User/Finance | Deposit request management |
| **Bank Reserve** | `/bank/reserve/` | Finance/Admin | Reserve management |
| **Staff Management** | `/staff/` | Admin | Staff CRUD operations |
| **Beneficiaries** | `/beneficiaries/` | User | Saved recipients |
| **Admin Dashboard** | `/admin/` | Admin | System statistics |

---

## 🎓 Best Practices

### API Usage Guidelines

1. **Always validate input data** before sending requests
2. **Handle error responses** appropriately in your client
3. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)
4. **Include proper headers** (Content-Type, Authorization)
5. **Implement retry logic** for network failures
6. **Cache user data** appropriately on client side
7. **Log API interactions** for debugging
8. **Use environment variables** for configuration
9. **Implement proper error boundaries** in React components
10. **Follow RESTful conventions** when extending APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - React + Bootstrap implementation
- **Backend Development** - Node.js + Express API
- **Database Design** - MongoDB schema architecture
- **UI/UX Design** - Modern banking interface

## 📞 Support

For support and questions:
- 📧 Email: support@pnb-banking.com
- 📚 Documentation: See `/docs` folder
- 🐛 Issues: GitHub Issues tab

---

<div align="center">
  <strong>🏦 Philippine National Bank - Secure • Modern • Reliable</strong>
</div>