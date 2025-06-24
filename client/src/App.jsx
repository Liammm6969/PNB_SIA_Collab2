import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/_login'
import Register from './pages/_register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/_admin/_adminDashboard'
import ManageUsers from './pages/_admin/_manageUsers'
import ManageStaff from './pages/_admin/_manageStaff'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage/users" element={<ManageUsers />} />
        <Route path="/admin/manage/staff" element={<ManageStaff />} />
        
        {/* Finance Routes - For now redirect to admin dashboard */}
        <Route path="/finance-dashboard" element={<AdminDashboard />} />
        
        {/* Loan Routes - For now redirect to admin dashboard */}
        <Route path="/loans-dashboard" element={<AdminDashboard />} />
        
        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App