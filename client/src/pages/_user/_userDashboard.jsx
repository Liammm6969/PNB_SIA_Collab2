import React, { useState, useEffect } from 'react';
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
  EyeSlash
} from 'react-bootstrap-icons';
import UserService from '../../services/user.Service';
import TransactionService from '../../services/transaction.Service';

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
      }      // Load user profile
      const userProfile = await UserService.getUserProfile(userData.userId);
      console.log('User profile loaded:', userProfile);
      setUser(userProfile);

      // Load account balance from user profile (real data)
      setBalance(userProfile.balance || 0);      // Load real transactions/payments
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
        // If no payments found or error occurred, use empty array
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
    <Container fluid className="py-4">
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <PersonCircle size={48} className="text-primary me-3" />
            <div>              <h2 className="mb-0">
                Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.businessName || 'User'}!
              </h2>
              <p className="text-muted mb-0">Here's your account overview</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Account Balance Card */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="glass-card h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-white-50 mb-2">Current Balance</h6>
                  <div className="d-flex align-items-center">
                    <h2 className="mb-0 me-3">
                      {showBalance ? TransactionService.formatCurrency(balance) : '₱ •••••••'}
                    </h2>
                    <Button
                      variant="link"
                      className="text-white p-0"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                </div>
                <CreditCard2Front size={32} className="text-white-50" />
              </div>
              
              <div className="d-flex justify-content-between align-items-end">
                <div>
                  <small className="text-white-50 d-block">Account Number</small>
                  <span className="fw-bold">{user?.accountNumber || '•••-••••-•••-••••'}</span>
                </div>
                <div className="text-end">
                  <small className="text-white-50 d-block">Account Type</small>
                  <Badge bg="light" text="dark" className="text-capitalize">
                    {user?.accountType || 'Personal'}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="glass-card h-100">
            <Card.Body>
              <h6 className="text-muted mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  className="d-flex align-items-center justify-content-center"
                  onClick={handleSendMoney}
                >
                  <ArrowUpRight className="me-2" />
                  Send Money
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="d-flex align-items-center justify-content-center"
                  onClick={handleAddMoney}
                >
                  <Plus className="me-2" />
                  Add Money
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="glass-card h-100">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <ArrowDownLeft size={32} />
              </div>
              <h5 className="text-success mb-1">
                {TransactionService.formatCurrency(stats.totalIncome)}
              </h5>
              <small className="text-muted">Total Income</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="glass-card h-100">
            <Card.Body className="text-center">
              <div className="text-danger mb-2">
                <ArrowUpRight size={32} />
              </div>
              <h5 className="text-danger mb-1">
                {TransactionService.formatCurrency(stats.totalExpense)}
              </h5>
              <small className="text-muted">Total Expenses</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>          <Card className="glass-card h-100">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <GraphUp size={32} />
              </div>
              <h5 className="text-info mb-1">{stats.transactionCount}</h5>
              <small className="text-muted">Transactions</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row>
        <Col>
          <Card className="glass-card">
            <Card.Header className="bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Transactions</h5>
                <Button variant="link" className="p-0" onClick={handleViewAllTransactions}>View All</Button>
              </div>
            </Card.Header>            <Card.Body className="p-0">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-5">
                  <CreditCard2Front size={48} className="text-muted mb-3" />
                  <h6 className="text-muted mb-2">No Recent Transactions</h6>
                  <p className="text-muted mb-0">Your transaction history will appear here</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="list-group-item border-0 px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{transaction.description}</h6>
                              <small className="text-muted">
                                {TransactionService.formatDate(transaction.date)} • {getTransactionTypeDisplay(transaction.type, transaction.amount)}
                              </small>
                            </div>
                            <div className="text-end">
                              <span className={`fw-bold text-${getTransactionColor(transaction.amount)}`}>
                                {transaction.amount > 0 ? '+' : ''}
                                {TransactionService.formatCurrency(Math.abs(transaction.amount))}
                              </span>
                              <div>
                                <Badge 
                                  bg={TransactionService.getStatusColorClass(transaction.status)}
                                  className="text-capitalize"
                                >
                                  {transaction.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default _userDashboard;