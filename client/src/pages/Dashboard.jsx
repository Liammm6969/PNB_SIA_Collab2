import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  CreditCard,
  User,
  Grid3X3,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function PNBDashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('pnb-user');
    if (!storedUser) {
      // Redirect to login if no user data found
      navigate('/');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('pnb-user');
      navigate('/');
    }
  }, [navigate]);

  const transactions = [
    { id: 132, date: '09/09/09:00', company: 'Jollibee', details: 'Payment for food', amount: '₱1322.79', status: 'Pending' },
    { id: 133, date: '09/09/09:00', company: 'Jollibee', details: 'Payment for food', amount: '₱1322.79', status: 'Completed' },
    { id: 134, date: '09/09/09:00', company: 'Jollibee', details: 'Payment for food', amount: '₱1322.79', status: 'Pending' },
    { id: 135, date: '09/09/09:00', company: 'Jollibee', details: 'Payment for food', amount: '₱1322.79', status: 'Pending' },
    { id: 136, date: '09/09/09:00', company: 'Jollibee', details: 'Payment for food', amount: '₱1322.79', status: 'Pending' }
  ];

  const upcomingPayments = [
    { name: 'Dr. Manzano dental clinic', amount: '896.31 Pesos', date: '06/06/06:00' },
    { name: 'Dr. Manzano dental clinic', amount: '896.31 Pesos', date: '06/06/06:00' },
    { name: 'Dr. Manzano dental clinic', amount: '896.31 Pesos', date: '06/06/06:00' },
    { name: 'Dr. Manzano dental clinic', amount: '896.31 Pesos', date: '06/06/06:00' }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search for..." className="search-input" />
          </div>          <div className="header-right">
            <span className="greeting">
              Hello, {userData ? userData.fullName || userData.email.split('@')[0] : 'User'}!
            </span>
            <Bell size={20} className="bell-icon" />
            <div className="avatar">
              {userData ? (userData.fullName ? userData.fullName.charAt(0) : userData.email.charAt(0).toUpperCase()) : 'U'}
            </div>
          </div>
        </div>        <div className="content">
          <div className="balance-section">
            <h2 className="balance-label">My Balance</h2>
            <h1 className="balance-amount">
              {userData && userData.balance ? `${userData.balance} Pesos` : '896.31 Pesos'}
            </h1>
            <p className="available-balance">
              Available Balance: {userData && userData.balance ? userData.balance : '896.31'}
            </p>
          </div>

          <div className="overview-section">
            <h3 className="section-title">Overview</h3>
            <div className="overview-grid">
              <div className="overview-card">
                <div className="card-indicator"></div>
                <div className="card-value">6969.69</div>
                <div className="card-label">Latest Transaction</div>
              </div>
              <div className="overview-card">
                <div className="card-indicator"></div>
                <div className="card-value">-</div>
                <div className="card-label">Biggest Transaction</div>
              </div>
              <div className="overview-card">
                <div className="card-indicator"></div>
                <div className="card-value">-</div>
                <div className="card-label">Total Transactions (7 days)</div>
              </div>
            </div>
          </div>

          <div className="main-grid">
            <div className="transactions-section">
              <div className="transactions-card">
                <div className="transactions-header">
                  <div className="transactions-top">
                    <h3 className="transactions-title">My Transactions</h3>
                    <div className="transactions-tabs">
                      <button className="tab-active">All</button>
                      <button className="tab">Pending</button>
                      <button className="tab">Cancelled</button>
                      <button className="tab">Paid</button>
                    </div>
                  </div>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead className="table-head">
                      <tr>
                        <th className="table-header">ID</th>
                        <th className="table-header">Date</th>
                        <th className="table-header">Company</th>
                        <th className="table-header">Payment Details</th>
                        <th className="table-header">Amount</th>
                        <th className="table-header">Status</th>
                        <th className="table-header"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index} className="table-row">
                          <td className="table-cell">
                            <input type="checkbox" className="checkbox" />
                            <span className="transaction-id">{transaction.id}</span>
                          </td>
                          <td className="table-cell">{transaction.date}</td>
                          <td className="table-cell">{transaction.company}</td>
                          <td className="table-cell">{transaction.details}</td>
                          <td className="table-cell">{transaction.amount}</td>
                          <td className="table-cell">
                            <span className={`status-badge status-${transaction.status.toLowerCase()}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="table-cell">
                            <MoreHorizontal size={16} className="more-icon" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="payments-section">
              <div className="payments-card">
                <div className="payments-header">
                  <h3 className="payments-title">Upcoming Payments</h3>
                </div>
                <div className="payments-content">
                  {upcomingPayments.map((payment, index) => (
                    <div key={index} className="payment-item">
                      <div className="payment-left">
                        <div className="payment-name">{payment.name}</div>
                        <div className="payment-amount">{payment.amount}</div>
                      </div>
                      <div className="payment-right">
                        <div className="payment-date">{payment.date}</div>
                        <button className="view-info-button">View Info</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
