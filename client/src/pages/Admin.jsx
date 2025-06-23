import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  CheckSquare
} from 'lucide-react';
import '../styles/Admin.css';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [balance, setBalance] = useState('896.31');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('pnb-user');
        if (!storedUser) {
          navigate('/');
          return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        // Check if user has admin privileges
        if (parsedUser.role !== 'Admin') {
          navigate('/home');
          return;
        }        // Mock transaction data
        setTransactions([
          { 
            id: '122',
            date: '06/13/2025',
            company: 'Jollibee', 
            paymentDetails: 'Payment for food', 
            amount: '1022.79',
            status: 'Completed'
          },
          { 
            id: '122',
            date: '06/14/2025',
            company: 'Jollibee', 
            paymentDetails: 'Payment for food', 
            amount: '1022.79', 
            status: 'Cancelled'
          },
          { 
            id: '122',
            date: '06/14/2025',
            company: 'Jollibee', 
            paymentDetails: 'Payment for food', 
            amount: '1022.79',
            status: 'Failed'
          },
          { 
            id: '122',
            date: '06/13/2025',
            company: 'Jollibee', 
            paymentDetails: 'Payment for food', 
            amount: '1022.79',
            status: 'Pending'
          },
          { 
            id: '122',
            date: '06/13/2025',
            company: 'Jollibee', 
            paymentDetails: 'Payment for food', 
            amount: '1022.79',
            status: 'Pending'
          },
        ]);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load admin dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);
  
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return transaction.status === 'Pending';
    if (activeTab === 'cancelled') return transaction.status === 'Cancelled';
    if (activeTab === 'paid') return transaction.status === 'Completed';
    return true;
  });
    const upcomingPayments = [
    { date: 'OP Master Card (***)', amount: '896.31' },
    { date: '09/25/2024', amount: '896.31' },
    { date: 'OP Master Card (***)', amount: '896.31' },
    { date: '09/26/2024', amount: '896.31' }
  ];

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="admin-header">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search for..." className="search-input" />
          </div>
          <div className="user-menu">
            <span>Hello, Admin!</span>
            <Bell size={18} className="notification-icon" />
            <span className="notification-count">1</span>
          </div>
        </div>

        <main className="admin-content">
          <div className="balance-section">
            <div className="balance-info">
              <h3 className="balance-label">My Balance</h3>
              <h2 className="balance-amount">{balance} Pesos</h2>
              <p className="available-balance">Available Balance: PHP {balance}</p>
            </div>
          </div>          <div className="overview-section">
            <h3 className="section-heading">Overview</h3>
            <div className="overview-cards">
              <div className="overview-card">
                <h4>Jollibee</h4>
                <div className="amount">6969.69</div>
              </div>
              <div className="overview-card">
                <h4>Latest Transaction</h4>
                <div className="amount">-</div>
              </div>
              <div className="overview-card">
                <h4>Biggest Transaction</h4>
                <div className="amount">-</div>
              </div>
              <div className="overview-card">
                <h4>Total Transactions (7 days)</h4>
                <div className="amount">-</div>
              </div>
            </div>          </div>

          <div className="bottom-sections">
            <div className="transactions-section">
              <div className="transactions-header">
                <h3 className="section-heading">Transactions</h3>
                <div className="transaction-tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                  >
                    Pending
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cancelled')}
                  >
                    Cancelled
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'paid' ? 'active' : ''}`}
                    onClick={() => setActiveTab('paid')}
                  >
                    Paid
                  </button>
                </div>
              </div>
              
              <div className="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th className="check-column">
                        <CheckSquare size={16} />
                      </th>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Company</th>
                      <th>Payment Details</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="check-column">
                          <input type="checkbox" />
                        </td>
                        <td>{transaction.id}</td>
                        <td>{transaction.date}</td>
                        <td>{transaction.company}</td>
                        <td>{transaction.paymentDetails}</td>
                        <td>₱{transaction.amount}</td>
                        <td>
                          <span className={`status ${transaction.status.toLowerCase()}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="upcoming-section">
              <h3 className="section-heading">Upcoming Payments</h3>
              <div className="upcoming-payments">
                {upcomingPayments.map((payment, index) => (
                  <div className="payment-card" key={index}>
                    <div className="payment-info">
                      <div className="payment-date">{payment.date}</div>
                      <div className="payment-amount">{payment.amount} Pesos</div>
                    </div>
                    <button className="info-button">View Info</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}