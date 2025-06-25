import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/_login'
import Register from './pages/_register'
import AdminDashboard from './pages/_admin/_adminDashboard'
import ManageUsers from './pages/_admin/_manageUsers'
import ManageStaff from './pages/_admin/_manageStaff'
import UserLayout from './layouts/userLayout'
import FinanceLayout from './layouts/financeLayout'
import UserDashboard from './pages/_user/_userDashboard'
import UserTransfer from './pages/_user/_userTransfer'
import UserStatements from './pages/_user/_userStatements'
import UserProfileSettings from './pages/_user/_userSettings'

import FinanceDashboard from './pages/_finance/_financeDashboard'
import FinanceDepositManagement from './pages/_finance/_depositManagement'
import FinanceReports from './pages/_finance/_reportsManagement'
import FinanceTransactions from './pages/_finance/_transactionManagement'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Routes with Layout */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="transfer" element={ <UserTransfer />} />
          <Route path="statements" element={< UserStatements/>} />
          <Route path="profile" element={< UserProfileSettings/>} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
          {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage/users" element={<ManageUsers />} />
        <Route path="/admin/manage/staff" element={<ManageStaff />} />        
        
        {/* Finance Routes with Layout */}
        <Route path="/finance" element={<FinanceLayout />}>
          <Route path="dashboard" element={<FinanceDashboard />} />
          <Route path="deposits" element={<FinanceDepositManagement />} />
          <Route path="reports" element={<FinanceReports />} />
          <Route path="transactions" element={<FinanceTransactions />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Direct Finance Dashboard Route */}
        <Route path="/finance-dashboard" element={<FinanceDashboard />} />

        
        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App