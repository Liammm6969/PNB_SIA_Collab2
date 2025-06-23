import React from 'react';
import { Grid3X3, CreditCard, User, Users, Settings } from 'lucide-react';
import '../styles/AdminSidebar.css';
import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      {/* Logo */}      <div className="logo">
        <div className="logo-icon">
          <img src="./src/assets/pnb.png" alt="" />
          <span className="logo-text"></span>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation">        <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
          <Grid3X3 size={20} className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </NavLink>        <NavLink to="/business-accounts" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
          <CreditCard size={20} className="nav-icon" />
          <span className="nav-text">Business Accounts</span>
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
          <CreditCard size={20} className="nav-icon" />
          <span className="nav-text">Transactions</span>
        </NavLink>
        <NavLink to="/manage-users" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
          <User size={20} className="nav-icon" />
          <span className="nav-text">Manage Users</span>
        </NavLink>
        <NavLink to="/manage-accounts" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
          <Users size={20} className="nav-icon" />
          <span className="nav-text">Manage Accounts</span>
        </NavLink>
      </div>

      {/* Settings */}      <div className="settings-container">
        <div className="nav-item">
          <Settings size={20} className="nav-icon" />
          <span className="nav-text">Settings</span>
        </div>
      </div>
    </div>
  );
}
