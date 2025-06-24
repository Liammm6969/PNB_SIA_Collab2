import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/_login'
import Register from './pages/_register'
import AdminDashboard from './pages/_admin/_adminDashboard'
import ManageUsers from './pages/_admin/_manageUsers'
import ManageStaff from './pages/_admin/_manageStaff'
import UserLayout from './layouts/userLayout'
import UserDashboard from './pages/_user/_userDashboard'
import UserTransfer from './pages/_user/_userTransfer'
import UserStatements from './pages/_user/_userStatements'
import UserProfileSettings from './pages/_user/_userSettings'

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
        
        {/* Legacy route redirects */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/finance-dashboard" element={<AdminDashboard />} />
        <Route path="/loans-dashboard" element={<AdminDashboard />} />
        
        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App