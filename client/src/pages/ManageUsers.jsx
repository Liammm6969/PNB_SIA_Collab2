import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/ManageUsers.css';
import Header from '../components/Header';
import { getUsers } from '../services/users.Service';

export default function ManageUsers() {
  const [activeTab, setActiveTab] = useState('customer');
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getUsers();
        setUsers(allUsers);
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="manage-users-container">
      <AdminSidebar />
      <div className="manage-users-main-content">
        <Header />
        <main className="manage-users-content">
          <div className="manage-users-tabs">
            <button
              className={`manage-users-tab-btn${activeTab === 'customer' ? ' active' : ''}`}
              onClick={() => setActiveTab('customer')}
            >
              Customer
            </button>
            <button
              className={`manage-users-tab-btn${activeTab === 'business' ? ' active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              Business Owner
            </button>
          </div>
          <div className="manage-users-table-section">
            <h3 className="manage-users-section-heading">Clients List</h3>
            <div className="manage-users-table-wrapper">
              <table className="manage-users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Account Number</th>
                    <th>Email Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.userId || user._id || idx}>
                      <td>{user.userId || ''}</td>
                      <td>{user.fullName || user.name}</td>
                      <td>{user.accountNumber || user.account}</td>
                      <td>
                        <a href={`mailto:${user.email}`} className="manage-users-email-link">{user.email}</a>
                      </td>
                      <td>
                        <button className="manage-users-info-btn">View Info</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
