import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  TrendingUp,
  ArrowDown,
  ArrowUp,
  MoreHorizontal
} from 'lucide-react';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { getUserById, getTransactionsByUser } from '../services/users.Service';

export default function PNBDashboard() {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const navigate = useNavigate();
  
  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('pnb-user');
        if (!storedUser) {
          navigate('/');
          return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);

        // Fetch updated user data (including balance)
        const updatedUserData = await getUserById(parsedUser._id);
        setUserData(updatedUserData);

        // Fetch user transactions
        const transactionsData = await getTransactionsByUser(parsedUser._id);
        setTransactions(transactionsData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        // Fallback to static data if API fails
        setTransactions([
          { id: 132, date: 'Sep 9, 2024', company: 'Jollibee', details: 'Food & Drinks', amount: -1322.79, status: 'Pending' },
          { id: 133, date: 'Sep 8, 2024', company: 'SM Supermarket', details: 'Groceries', amount: -2540.50, status: 'Completed' },
          { id: 134, date: 'Sep 8, 2024', company: 'Salary Deposit', details: 'Monthly Salary', amount: 50000.00, status: 'Completed' },
          { id: 135, date: 'Sep 7, 2024', company: 'Grab Car', details: 'Transport', amount: -450.00, status: 'Completed' },
          { id: 136, date: 'Sep 6, 2024', company: 'Meralco', details: 'Utilities', amount: -3500.00, status: 'Pending' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const upcomingPayments = [
    { name: 'Netflix Subscription', amount: '549.00', date: 'Sep 15' },
    { name: 'Globe Postpaid', amount: '999.00', date: 'Sep 25' },
    { name: 'Water Bill', amount: '780.50', date: 'Sep 28' },
    { name: 'Condo Dues', amount: '2500.00', date: 'Sep 30' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Calculate income and expenses from transactions
  const calculateStats = () => {
    if (!transactions || transactions.length === 0) {
      return { income: 0, expenses: 0 };
    }

    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { income, expenses };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Header userData={userData} />
          <main className="content-area">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', fontSize: '18px', color: '#6b7280' }}>
              Loading dashboard data...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Header userData={userData} />
          <main className="content-area">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', fontSize: '18px', color: '#dc2626' }}>
              {error}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header userData={userData} />

        <main className="content-area">
          <div className="content-header">
            <h1 className="welcome-message">
              Welcome back, {userData ? userData.fullName.split(' ')[0] : 'User'}!
            </h1>
            <div className="header-buttons">
              <button className="action-button">Send Money</button>
              <button className="action-button primary">Add Money</button>
            </div>
          </div>
          
          <div className="cards-grid">
            <div className="balance-card">
              <div className="balance-header">
                <span className="balance-title">Total Balance</span>
                <MoreHorizontal size={20} className="more-icon" />
              </div>
              <p className="balance-amount">
                {userData && userData.balance ? formatCurrency(userData.balance) : formatCurrency(0)}
              </p>
              <div className="balance-stats">
                <div className="stat">
                  <ArrowUp size={16} className="stat-icon income" />
                  <div>
                    <p className="stat-label">Income</p>
                    <p className="stat-value">{formatCurrency(stats.income)}</p>
                  </div>
                </div>
                <div className="stat">
                  <ArrowDown size={16} className="stat-icon expense" />
                  <div>
                    <p className="stat-label">Expenses</p>
                    <p className="stat-value">{formatCurrency(stats.expenses)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-header">
                <h3 className="overview-title">Quick Actions</h3>
              </div>
              <div className="quick-actions-grid">
                <button className="action-item">
                  <CreditCard size={24} />
                  <span>Pay Bills</span>
                </button>
                <button className="action-item">
                  <TrendingUp size={24} />
                  <span>Invest</span>
                </button>
                <button className="action-item">
                  <CreditCard size={24} />
                  <span>Loans</span>
                </button>
                 <button className="action-item">
                  <MoreHorizontal size={24} />
                  <span>More</span>
                </button>
              </div>
            </div>
          </div>

          <div className="transactions-section">
            <div className="transactions-header">
              <h3 className="section-title">Recent Transactions</h3>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="transactions-list">
              {transactions && transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction._id || transaction.id} className="transaction-item">
                    <div className="transaction-details">
                      <div className={`transaction-icon ${transaction.amount > 0 ? 'income' : 'expense'}`}>
                        {transaction.amount > 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                      </div>
                      <div>
                        <p className="transaction-company">{transaction.company}</p>
                        <p className="transaction-description">{transaction.paymentDetails || transaction.details}</p>
                      </div>
                    </div>
                    <div className="transaction-info">
                       <p className="transaction-date">{formatDate(transaction.date)}</p>
                       <p className={`transaction-amount ${transaction.amount > 0 ? 'income' : 'expense'}`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#6b7280', fontStyle: 'italic' }}>
                  No transactions found
                </div>
              )}
            </div>
          </div>

          <div className="payments-section">
            <div className="payments-header">
              <h3 className="section-title">Upcoming Payments</h3>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="payments-list">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="payment-item">
                  <div className="payment-details">
                    <div className="payment-icon">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="payment-name">{payment.name}</p>
                      <p className="payment-amount">₱{payment.amount}</p>
                    </div>
                  </div>
                  <div className="payment-info">
                    <p className="payment-date">{payment.date}</p>
                    <button className="view-info-button" onClick={() => handleOpenModal(payment)}>View Info</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
       <PaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        payment={selectedPayment}
        userData={userData}
      />
    </div>
  );
}
