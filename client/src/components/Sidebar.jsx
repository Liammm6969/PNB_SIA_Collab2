import React from 'react';
import { Grid3X3, User, CreditCard, Settings } from 'lucide-react';
import '../styles/Sidebar.css';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">
          <img src="./src/assets/pnb.png" alt="" />
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation">
        <NavLink to="/home" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
          <Grid3X3 size={24} className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink to="/my-account" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
          <User size={24} className="nav-icon" />
          <span className="nav-text">My Account</span>
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
          <CreditCard size={24} className="nav-icon" />
          <span className="nav-text">Transactions</span>
        </NavLink>
      </div>

      {/* Settings */}
      <div className="settings-container">
        <div className="nav-item">
          <Settings size={24} className="nav-icon" />
          <span className="nav-text">Settings</span>
        </div>
      </div>
    </div>
  );
}
