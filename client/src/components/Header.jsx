import React from 'react';
import { Search, Bell } from 'lucide-react';
import '../styles/Header.css';

export default function Header({ userData }) {
  return (
    <header className="header">
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search transactions..." className="search-input" />
      </div>
      <div className="header-actions">
        <button className="header-button">
          <Bell size={20} />
        </button>
        <div className="user-info">
          <span className="user-name">
            {userData ? userData.fullName || userData.email.split('@')[0] : 'User'}
          </span>
          <span className="user-role">Premium Client</span>
        </div>
        <div className="avatar">
          {userData ? (userData.fullName ? userData.fullName.charAt(0) : userData.email.charAt(0).toUpperCase()) : 'U'}
        </div>
      </div>
    </header>
  );
} 