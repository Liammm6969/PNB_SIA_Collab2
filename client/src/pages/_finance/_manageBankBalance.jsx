import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner, 
  Badge, 
  Table,
  Modal,
  ProgressBar
} from 'react-bootstrap';
import {
  CashCoin,
  GraphUp,
  ArrowDown,
  ExclamationTriangle,
  CheckCircle,
  InfoCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Gear
} from 'react-bootstrap-icons';
import BankReserveService from '../../services/bankReserve.Service';
import StaffService from '../../services/staff.Service';

// Create an instance of the service
const bankReserveService = new BankReserveService();

const _manageBankBalance = () => {
  const [bankReserve, setBankReserve] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showInitializeModal, setShowInitializeModal] = useState(false);
  const [initializeAmount, setInitializeAmount] = useState(1000000);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    loadBankData();
  }, []);
  const loadBankData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load both bank reserve and stats
      const [reserveResponse, statsResponse] = await Promise.all([
        bankReserveService.getBankReserve(),
        bankReserveService.getBankReserveStats()
      ]);

      setBankReserve(reserveResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error('Failed to load bank data:', err);
      setError(err.response?.data?.error || 'Failed to load bank data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadBankData();
      setSuccess('Bank data refreshed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to refresh bank data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleInitializeReserve = async () => {
    try {
      setInitializing(true);
      setError('');

      const result = await BankReserveService.initializeBankReserve(initializeAmount);
      
      setSuccess(`Bank reserve initialized with ${BankReserveService.formatCurrency(initializeAmount)}`);
      setShowInitializeModal(false);
      await loadBankData();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to initialize bank reserve:', err);
      setError(err.response?.data?.error || 'Failed to initialize bank reserve');
    } finally {
      setInitializing(false);
    }
  };

  const getReserveStatusColor = () => {
    return BankReserveService.getReserveStatusColor(bankReserve?.total_balance || 0);
  };

  const getReserveStatusText = () => {
    return BankReserveService.getReserveStatusText(bankReserve?.total_balance || 0);
  };

  const getReservePercentage = () => {
    const maxReserve = 2000000; // 2M as 100%
    return Math.min((bankReserve?.total_balance || 0) / maxReserve * 100, 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="text-danger" />;
      case 'withdrawal':
        return <ArrowUpCircle className="text-success" />;
      case 'initialization':
        return <Gear className="text-info" />;
      default:
        return <InfoCircle className="text-muted" />;
    }
  };

  if (loading) {
    return (
      <Container fluid className="px-4 py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading bank balance data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="px-4 py-5">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <CashCoin className="me-2" />
                Bank Balance Management
              </h2>
              <p className="text-muted mb-0">Monitor and manage the central bank reserve fund</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? <Spinner size="sm" /> : 'Refresh'}
              </Button>
              <Button 
                variant="warning" 
                onClick={() => setShowInitializeModal(true)}
              >
                <Gear className="me-1" />
                Initialize Reserve
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <ExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          <CheckCircle className="me-2" />
          {success}
        </Alert>
      )}

      {/* Main Bank Reserve Display */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="text-muted mb-1">Total Bank Reserve</h5>
                  <h1 className={`mb-0 text-${getReserveStatusColor()}`}>
                    {BankReserveService.formatCurrency(bankReserve?.total_balance || 0)}
                  </h1>
                </div>
                <Badge bg={getReserveStatusColor()} className="fs-6 px-3 py-2">
                  {getReserveStatusText()}
                </Badge>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">Reserve Level</small>
                  <small className="text-muted">{getReservePercentage().toFixed(1)}%</small>
                </div>
                <ProgressBar 
                  variant={getReserveStatusColor()} 
                  now={getReservePercentage()} 
                  style={{ height: '8px' }}
                />
              </div>

              {bankReserve?.last_transaction_type && (
                <div className="border-top pt-3">
                  <h6 className="text-muted mb-2">Last Transaction</h6>
                  <div className="d-flex align-items-center">
                    {getTransactionIcon(bankReserve.last_transaction_type)}
                    <div className="ms-2">
                      <div className="fw-semibold">
                        {bankReserve.last_transaction_type.charAt(0).toUpperCase() + 
                         bankReserve.last_transaction_type.slice(1)}
                      </div>
                      <small className="text-muted">
                        {BankReserveService.formatCurrency(Math.abs(bankReserve.last_transaction_amount || 0))} 
                        {bankReserve.last_transaction_id && ` • ${bankReserve.last_transaction_id}`}
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <h6 className="text-muted mb-3">
                <InfoCircle className="me-2" />
                Reserve Information
              </h6>
              
              <div className="mb-3">
                <small className="text-muted d-block">Created</small>
                <strong>{formatDate(stats?.created_date)}</strong>
              </div>
              
              <div className="mb-3">
                <small className="text-muted d-block">Last Updated</small>
                <strong>{formatDate(stats?.last_updated)}</strong>
              </div>

              {stats?.last_transaction && (
                <div>
                  <small className="text-muted d-block">Last Transaction Date</small>
                  <strong>{formatDate(stats.last_transaction.date)}</strong>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reserve Guidelines */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h6 className="mb-3">
                <ExclamationTriangle className="me-2" />
                Reserve Management Guidelines
              </h6>
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Badge bg="danger" className="me-2">Critical</Badge>
                    <span>Below ₱100,000 - Immediate action required</span>
                  </div>
                  <div className="mb-3">
                    <Badge bg="warning" className="me-2">Low</Badge>
                    <span>₱100,000 - ₱500,000 - Monitor closely</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Badge bg="info" className="me-2">Moderate</Badge>
                    <span>₱500,000 - ₱1,000,000 - Normal operations</span>
                  </div>
                  <div>
                    <Badge bg="success" className="me-2">Healthy</Badge>
                    <span>Above ₱1,000,000 - Optimal reserves</span>
                  </div>
                </Col>
              </Row>

              <div className="mt-3 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Note:</strong> All user deposits decrease the bank reserve, while withdrawals increase it. 
                  Transfers between users do not affect the total reserve. Monitor the reserve to ensure sufficient 
                  liquidity for customer deposits and withdrawals.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Initialize Reserve Modal */}
      <Modal show={showInitializeModal} onHide={() => setShowInitializeModal(false)} centered>
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>
            <Gear className="me-2" />
            Initialize Bank Reserve
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <ExclamationTriangle className="me-2" />
            <strong>Warning:</strong> This will reset the bank reserve to a new amount. 
            This action should only be performed during system setup or maintenance.
          </Alert>
          
          <Form.Group className="mb-3">
            <Form.Label>Initial Reserve Amount</Form.Label>
            <Form.Control
              type="number"
              value={initializeAmount}
              onChange={(e) => setInitializeAmount(parseFloat(e.target.value))}
              min="0"
              step="10000"
            />
            <Form.Text className="text-muted">
              Recommended minimum: ₱1,000,000
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInitializeModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="warning" 
            onClick={handleInitializeReserve}
            disabled={initializing || initializeAmount < 0}
          >
            {initializing ? (
              <>
                <Spinner size="sm" className="me-2" />
                Initializing...
              </>
            ) : (
              'Initialize Reserve'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default _manageBankBalance;