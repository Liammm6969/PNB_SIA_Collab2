import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  PersonCircle, 
  CreditCard2Front, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  GraphUp,
  Eye,
  EyeSlash,
  CreditCard
} from 'react-bootstrap-icons';

import UserService from '../../services/user.Service';
import TransactionService from '../../services/transaction.Service';
import '../../styles/userStyles/_userDashboard.css'

const _userDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0
  });
  const [showEnlargedCard, setShowEnlargedCard] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ visible: false, x: 0, y: 0 });
  const enlargedCardRef = useRef(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const userData = UserService.getUserData();
      
      if (!userData.userId) {
        setError('User not authenticated');
        return;
      }

      // Load user profile
      const userProfile = await UserService.getUserProfile(userData.userId);
      console.log('User profile loaded:', userProfile);
      setUser(userProfile);

      // Load account balance from user profile (real data)
      setBalance(userProfile.balance || 0);

      // Load real transactions/payments
      let realTransactions = [];
      try {
        console.log('Fetching payments for user:', userData.userId);
        const payments = await TransactionService.getUserPayments(userData.userId);
        console.log('Payments received:', payments);
        
        // Transform payments to transaction format
        if (Array.isArray(payments) && payments.length > 0) {
          realTransactions = payments.map(payment => ({
            id: payment.paymentStringId || payment.paymentId || payment._id,
            type: payment.fromUser === userProfile.userIdSeq ? 'transfer' : 'deposit',
            amount: payment.fromUser === userProfile.userIdSeq ? -payment.amount : payment.amount,
            description: payment.details || 
              (payment.fromUser === userProfile.userIdSeq ? 
                `Transfer to user ${payment.toUser}` : 
                `Payment from user ${payment.fromUser}`),
            date: payment.createdAt || payment.date || new Date().toISOString(),
            status: 'completed',
            paymentId: payment.paymentId
          }));
          console.log('Transformed transactions:', realTransactions);
        }
      } catch (paymentError) {
        console.warn('Could not load payments:', paymentError.message);
        realTransactions = [];
      }

      setRecentTransactions(realTransactions);

      // Calculate real stats from actual transactions
      const income = realTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = realTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      setStats({
        totalIncome: income,
        totalExpense: expense,
        transactionCount: realTransactions.length
      });

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="text-success" />;
      case 'transfer':
        return <ArrowUpRight className="text-danger" />;
      case 'payment':
        return <ArrowUpRight className="text-warning" />;
      default:
        return <CreditCard2Front />;
    }
  };

  const getTransactionColor = (amount) => {
    return amount > 0 ? 'success' : 'danger';
  };

  const getTransactionTypeDisplay = (type, amount) => {
    if (amount > 0) {
      return 'Received';
    } else {
      switch (type) {
        case 'transfer':
          return 'Sent';
        case 'payment':
          return 'Payment';
        default:
          return 'Transaction';
      }
    }
  };

  // Navigation functions for Quick Actions
  const handleSendMoney = () => {
    navigate('/user/transfer');
  };

  const handleAddMoney = () => {
    navigate('/user/deposit-request');
  };

  const handleViewAllTransactions = () => {
    navigate('/user/statements');
  };

  // Handle mouse movement for tilt effect (now on modal)
  const handleModalMouseMove = (e) => {
    if (!enlargedCardRef.current) return;
    const modal = e.currentTarget;
    const rect = modal.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleBankCardClick = () => {
    setShowEnlargedCard(true);
  };

  const handleCloseEnlargedCard = () => {
    setShowEnlargedCard(false);
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!showEnlargedCard) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleCloseEnlargedCard();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showEnlargedCard]);

  const handleCardMouseMove = (e) => {
    if (!enlargedCardRef.current) return;
    const rect = enlargedCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlight({ visible: true, x, y });
  };
  const handleCardMouseLeave = () => {
    setSpotlight({ visible: false, x: 0, y: 0 });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="dashboard-root">
      <Container fluid className="py-4">
        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

        {/* Bank Card, Quick Actions, and Vertical Stats */}
        <Row className="mb-4">
          <Col lg={4} className="mb-3">
            <div className="bank-card" onClick={handleBankCardClick} style={{ cursor: 'pointer' }}>
              <div className="bank-card-background">
                <div className="card-pattern"></div>
              </div>
              <div className="bank-card-content">
                <div className="card-header-section">
                  <div className="card-logo">
                    <CreditCard size={32} />
                  </div>
                  <div className="card-type">
                    <span>DEBIT CARD</span>
                  </div>
                </div>
                <div className="card-balance-section">
                  <div className="balance-label">Current Balance</div>
                  <div className="balance-display">
                    <span className="balance-amount">
                      {showBalance ? TransactionService.formatCurrency(balance) : '₱ •••••••'}
                    </span>
                    <Button
                      variant="link"
                      className="balance-toggle"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                </div>
                <div className="card-details-section">
                  <div className="account-number">
                    <span className="detail-label">Account Number</span>
                    <span className="detail-value">{user?.accountNumber || '•••-••••-•••-••••'}</span>
                    <span className="card-number-label">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.businessName || 'User'}!</span>
                  </div>
                  <div className="account-type">
                    <span className="detail-label">Account Type</span>
                    <Badge bg="light" text="dark" className="account-type-badge">
                      {user?.accountType || 'Personal'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={3} md={12} className="mb-3 mb-lg-0">
            <div className="quick-actions-card h-100">
              <h6 className="quick-actions-title">Quick Actions</h6>
              <div className="quick-actions-buttons">
                <button 
                  className="action-btn primary-action"
                  onClick={handleSendMoney}
                >
                  <ArrowUpRight className="action-icon" />
                  <span>Send Money</span>
                </button>
                <button 
                  className="action-btn secondary-action"
                  onClick={handleAddMoney}
                >
                  <Plus className="action-icon" />
                  <span>Add Money</span>
                </button>
              </div>
            </div>
          </Col>
          <Col lg={5} md={12}>
            <div className="vertical-stats-cards d-flex flex-column h-100 justify-content-between">
              <div className="stat-card income-card mb-3">
                <div className="stat-icon">
                  <ArrowDownLeft size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-amount">
                    {TransactionService.formatCurrency(stats.totalIncome)}
                  </div>
                  <div className="stat-label">Total Income</div>
                </div>
              </div>
              <div className="stat-card expense-card mb-3">
                <div className="stat-icon">
                  <ArrowUpRight size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-amount">
                    {TransactionService.formatCurrency(stats.totalExpense)}
                  </div>
                  <div className="stat-label">Total Expenses</div>
                </div>
              </div>
              <div className="stat-card transaction-card">
                <div className="stat-icon">
                  <GraphUp size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-amount">{stats.transactionCount}</div>
                  <div className="stat-label">Transactions</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Recent Transactions */}
        <Row>
          <Col>
            <div className="transactions-card">
              <div className="transactions-header">
                <h5 className="transactions-title">Recent Transactions</h5>
                <Button variant="link" className="view-all-btn" onClick={handleViewAllTransactions}>
                  View All
                </Button>
              </div>
              <div className="transactions-content">
                {recentTransactions.length === 0 ? (
                  <div className="empty-transactions">
                    <CreditCard2Front size={48} className="empty-icon" />
                    <h6 className="empty-title">No Recent Transactions</h6>
                    <p className="empty-subtitle">Your transaction history will appear here</p>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {recentTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="transaction-item">
                        <div className="transaction-icon">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="transaction-details">
                          <div className="transaction-main">
                            <h6 className="transaction-description">{transaction.description}</h6>
                            <div className="transaction-meta">
                              <span className="transaction-date">
                                {TransactionService.formatDate(transaction.date)}
                              </span>
                              <span className="transaction-separator">•</span>
                              <span className="transaction-type">
                                {getTransactionTypeDisplay(transaction.type, transaction.amount)}
                              </span>
                            </div>
                          </div>
                          <div className="transaction-amount-section">
                            <span className={`transaction-amount ${getTransactionColor(transaction.amount)}`}>
                              {transaction.amount > 0 ? '+' : ''}
                              {TransactionService.formatCurrency(Math.abs(transaction.amount))}
                            </span>
                            <Badge 
                              bg={TransactionService.getStatusColorClass(transaction.status)}
                              className="transaction-status"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/* Enlarged Card Modal/Overlay */}
      {showEnlargedCard && (
        <div
          className="enlarged-card-modal"
          onClick={handleCloseEnlargedCard}
          onMouseMove={handleModalMouseMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <div
            className="enlarged-bank-card"
            ref={enlargedCardRef}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
            onClick={e => e.stopPropagation()}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Spotlight effect */}
            {spotlight.visible && (
              <div
                className="card-spotlight"
                style={{
                  left: spotlight.x - 150,
                  top: spotlight.y - 150,
                }}
              />
            )}
            <div className="bank-card-background">
              <div className="card-pattern"></div>
            </div>
            <div className="bank-card-content">
              <div className="card-header-section">
                <div className="card-logo">
                  <CreditCard size={32} />
                </div>
                <div className="card-type">
                  <span>DEBIT CARD</span>
                </div>
              </div>
              <div className="card-balance-section">
                <div className="balance-label">Current Balance</div>
                <div className="balance-display">
                  <span className="balance-amount">
                    {showBalance ? TransactionService.formatCurrency(balance) : '₱ •••••••'}
                  </span>
                </div>
              </div>
              <div className="card-details-section">
                <div className="account-number">
                  <span className="detail-label">Account Number</span>
                  <span className="detail-value">{user?.accountNumber || '•••-••••-•••-••••'}</span>
                  <span className="card-number-label">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.businessName || 'User'}!</span>
                </div>
                <div className="account-type">
                  <span className="detail-label">Account Type</span>
                  <Badge bg="light" text="dark" className="account-type-badge">
                    {user?.accountType || 'Personal'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default _userDashboard;