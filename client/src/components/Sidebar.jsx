import React from 'react';
import { Grid3X3, User, CreditCard, Settings } from 'lucide-react';
import '../styles/Sidebar.css';

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
        <div className="nav-item-active">
          <Grid3X3 size={24} className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </div>
        <div className="nav-item">
          <User size={24} className="nav-icon" />
          <span className="nav-text">My Account</span>
        </div>
        <div className="nav-item">
          <CreditCard size={24} className="nav-icon" />
          <span className="nav-text">Transactions</span>
        </div>
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
