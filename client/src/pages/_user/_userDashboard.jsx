import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Eye, 
  EyeOff, 
  CreditCard, 
  TrendingUp, 
  User2, 
  Banknote, 
  ReceiptText, 
  Send, 
  PlusCircle, 
  ChevronRight, 
  ArrowRightLeft, 
  Wallet, 
  CircleDollarSign, 
  FileText, 
  Loader2, 
  UserCircle, 
  Info, 
  Eye as EyeIcon, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight as LucideChevronRight, 
  Wifi 
} from 'lucide-react';

import UserService from '../../services/user.Service';
import TransactionService from '../../services/transaction.Service';
import '../../styles/userStyles/_userDashboard.css'
import WelcomeOverlay from '../../components/WelcomeOverlay';


function useAnimatedCounter(target, duration = 1000) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setValue(target);
    }
    animate(performance.now());
  }, [target]);
  return value;
}

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
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('showWelcome') === 'true');

  // Animated counters for stats
  const animatedIncome = useAnimatedCounter(stats.totalIncome);
  const animatedExpense = useAnimatedCounter(stats.totalExpense);
  const animatedTransactionCount = useAnimatedCounter(stats.transactionCount);

  useEffect(() => {
    loadDashboardData();
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 7500);
      localStorage.removeItem('showWelcome');
      return () => clearTimeout(timer);
    }
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
        return <CreditCard size={32} />;
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

  // Grand Welcome Overlay JSX
  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.businessName || 'User';

  return (
    <>
      <WelcomeOverlay show={showWelcome} onClose={() => setShowWelcome(false)} userName={userName} />
      <div className="dashboard-root">
        <Container fluid className="py-4">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          <Row className="mb-4 g-4 align-items-stretch">
            {/* Bank Card */}
            <Col lg={4} className="mb-3">
              <div className="bank-card" onClick={handleBankCardClick} style={{ cursor: 'pointer' }}>
                <div className="bank-card-content">
                  <div className="card-header-section d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <CreditCard size={32} className="card-logo" />
                      <Wifi size={24} className="card-contactless" />
                    </div>
                    <div className="card-avatar">
                      {user?.firstName
                        ? user.firstName[0] + (user.lastName ? user.lastName[0] : '')
                        : (user?.businessName ? user.businessName[0] : 'U')}
                    </div>
                  </div>
                  <div className="card-balance-section mb-3">
                    <div className="balance-label">Current Balance</div>
                    <div className="balance-display d-flex align-items-center gap-2">
                      <span className="balance-amount">
                        {showBalance ? TransactionService.formatCurrency(balance) : '₱ •••••••'}
                      </span>
                      <button
                        className="balance-toggle btn btn-link p-0"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="card-chip"></div>
                  <div className="card-details-section d-flex justify-content-between align-items-end">
                    <div className="account-number">
                      <span className="detail-label">Account Number</span>
                      <span className="detail-value">{user?.accountNumber || '•••-••••-•••-••••'}</span>

                    </div>
                    <div className="account-type">
                      <span className="detail-label">Account Type</span>
                      <span className="badge bg-light text-dark account-type-badge">
                        {user?.accountType || 'Personal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            {/* Quick Actions */}
            <Col lg={3} md={12} className="mb-3 mb-lg-0">
              <div className="quick-actions-card glass-card h-100 d-flex flex-column justify-content-between">
                <h6 className="quick-actions-title mb-3">Quick Actions</h6>
                <div className="quick-actions-buttons d-flex flex-column gap-3">
                  <button
                    className="action-btn primary-action d-flex align-items-center gap-2"
                    onClick={handleSendMoney}
                    title="Send money to another account"
                  >
                    <Send className="action-icon" size={20} />
                    <span>Send Money</span>
                    <LucideChevronRight size={18} className="ms-auto" />
                  </button>
                  <button
                    className="action-btn secondary-action d-flex align-items-center gap-2"
                    onClick={handleAddMoney}
                    title="Add funds to your account"
                  >
                    <PlusCircle className="action-icon" size={20} />
                    <span>Add Money</span>
                    <LucideChevronRight size={18} className="ms-auto" />
                  </button>
                </div>
              </div>
            </Col>
            {/* Stats with animated counters */}
            <Col lg={5} md={12}>
              <div className="vertical-stats-cards d-flex flex-column h-100 gap-3">
                <div className="stat-card income-card glass-card d-flex align-items-center gap-3 p-3">
                  <div className="stat-icon bg-success bg-opacity-10 rounded-circle p-2"><ArrowDownLeft size={28} /></div>
                  <div className="stat-content">
                    <div className="stat-amount text-success fw-bold fs-4">
                      {TransactionService.formatCurrency(animatedIncome)}
                    </div>
                    <div className="stat-label">Total Income</div>
                  </div>
                </div>
                <div className="stat-card expense-card glass-card d-flex align-items-center gap-3 p-3">
                  <div className="stat-icon bg-danger bg-opacity-10 rounded-circle p-2"><ArrowUpRight size={28} /></div>
                  <div className="stat-content">
                    <div className="stat-amount text-danger fw-bold fs-4">
                      {TransactionService.formatCurrency(animatedExpense)}
                    </div>
                    <div className="stat-label">Total Expenses</div>
                  </div>
                </div>
                <div className="stat-card transaction-card glass-card d-flex align-items-center gap-3 p-3">
                  <div className="stat-icon bg-primary bg-opacity-10 rounded-circle p-2"><TrendingUp size={28} /></div>
                  <div className="stat-content">
                    <div className="stat-amount fw-bold fs-4">
                      {animatedTransactionCount}
                    </div>
                    <div className="stat-label">Transactions</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          {/* Recent Transactions */}
          <Row>
            <Col>
              <div className="transactions-card glass-card p-4">
                <div className="transactions-header d-flex align-items-center justify-content-between mb-3">
                  <h5 className="transactions-title mb-0">Recent Transactions</h5>
                  <Button variant="link" className="view-all-btn" onClick={handleViewAllTransactions}>
                    View All <LucideChevronRight size={16} />
                  </Button>
                </div>
                <div className="transactions-content">
                  {recentTransactions.length === 0 ? (
                    <div className="empty-transactions text-center py-5">
                      <Wallet size={48} className="empty-icon mb-3" />
                      <h6 className="empty-title">No Recent Transactions</h6>
                      <p className="empty-subtitle">Your transaction history will appear here</p>
                    </div>
                  ) : (
                    <div className="transactions-list">
                      {recentTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="transaction-item d-flex align-items-center gap-3 p-3 glass-card mb-2">
                          <div className="transaction-icon">
                            {transaction.amount > 0 ? <ArrowDownLeft className="text-success" size={20} /> : <ArrowUpRight className="text-danger" size={20} />}
                          </div>
                          <div className="transaction-details flex-grow-1">
                            <div className="transaction-main d-flex align-items-center justify-content-between">
                              <h6 className="transaction-description mb-0 fw-semibold">{transaction.description}</h6>
                              <span className={`transaction-amount fw-bold ${transaction.amount > 0 ? 'text-success' : 'text-danger'}`}>{transaction.amount > 0 ? '+' : '-'}{TransactionService.formatCurrency(Math.abs(transaction.amount))}</span>
                            </div>
                            <div className="transaction-meta d-flex align-items-center gap-2 mt-1">
                              <span className="transaction-date small text-muted">{TransactionService.formatDate(transaction.date)}</span>
                              <span className="transaction-separator">•</span>
                              <span className="transaction-type small text-muted">{getTransactionTypeDisplay(transaction.type, transaction.amount)}</span>
                            </div>
                          </div>
                          <span className={`badge rounded-pill px-3 py-2 ${TransactionService.getStatusColorClass(transaction.status)}`}>{transaction.status}</span>
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
          <div className="enlarged-card-modal" onClick={handleCloseEnlargedCard} onMouseMove={handleModalMouseMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
            <div
              className="enlarged-bank-card glass-card"
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
                <div className="card-header-section d-flex align-items-center justify-content-between mb-2">
                  <div className="card-logo"><CreditCard size={36} /></div>
                  <div className="card-type"><span>DEBIT CARD</span></div>
                </div>
                <div className="card-balance-section mb-3">
                  <div className="balance-label">Current Balance</div>
                  <div className="balance-display d-flex align-items-center gap-2">
                    <span className="balance-amount">
                      {showBalance ? TransactionService.formatCurrency(balance) : '₱ •••••••'}
                    </span>
                  </div>
                </div>
                <div className="card-chip"></div>
                <div className="card-details-section d-flex justify-content-between align-items-end">
                  <div className="account-number">
                    <span className="detail-label">Account Number</span>
                    <span className="detail-value">{user?.accountNumber || '•••-••••-•••-••••'}</span>
                    <span className="card-number-label">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.businessName || 'User'}!</span>
                  </div>
                  <div className="account-type">
                    <span className="detail-label">Account Type</span>
                    <span className="badge bg-light text-dark account-type-badge">
                      {user?.accountType || 'Personal'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default _userDashboard;