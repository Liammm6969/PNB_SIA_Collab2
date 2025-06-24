import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/admin/_dashboard';
import ManageUsers from './pages/admin/_manageUsers';
import ManageAccounts from './pages/admin/_manageAccounts';
import ManageDeposits from './pages/admin/_manageDeposits';
import ManageWithdraw from './pages/admin/_manageWithdraw';
import ManageLoans from './pages/admin/_manageLoans';

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Default Route */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/manage/users" element={<ManageUsers />} />
        <Route path="/admin/manage/accounts" element={<ManageAccounts />} />
        <Route path="/admin/manage/deposits" element={<ManageDeposits />} />
        <Route path="/admin/manage/withdraw" element={<ManageWithdraw />} />
        <Route path="/admin/manage/loans" element={<ManageLoans />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;