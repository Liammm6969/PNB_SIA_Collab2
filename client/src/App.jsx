import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import _dashboard from './pages/admin/_dashboard';
import _manageUsers from './pages/admin/_manageUsers';

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
        <Route path="/dashboard" element={<_dashboard />} />



        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<_dashboard />} />
        <Route path="/admin/manage-users" element={<_manageUsers />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;