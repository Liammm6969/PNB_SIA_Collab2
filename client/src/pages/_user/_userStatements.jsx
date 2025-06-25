import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Table, 
  Badge, 
  Spinner, 
  Alert,
  Dropdown,
  InputGroup,
  Modal
} from 'react-bootstrap';
import {
  FileEarmarkText,
  Download,
  Search,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard2Front,
  Eye
} from 'react-bootstrap-icons';
import UserService from '../../services/user.Service';
import TransactionService from '../../services/transaction.Service';
import '../../styles/_userStatements.css'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const _userStatements = () => {
  const [statements, setStatements] = useState([]);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadStatements();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statements, searchTerm, dateRange, filterType, filterStatus]);
  const loadStatements = async () => {
    try {
      setLoading(true);
      const userData = UserService.getUserData();
      
      if (!userData.userId) {
        setError('User not authenticated');
        return;
      }

      // Get real statements from the API
      const statements = await TransactionService.getUserStatements(userData.userId);
      
      if (Array.isArray(statements)) {
        setStatements(statements);
      } else {
        setStatements([]);
      }
    } catch (err) {
      console.error('Error loading statements:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load statements');
    } finally {
      setLoading(false);
    }
  };
  const applyFilters = () => {
    let filtered = [...statements];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(statement =>
        statement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        statement.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        statement.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange.startDate) {
      filtered = filtered.filter(statement =>
        new Date(statement.date) >= new Date(dateRange.startDate)
      );
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(statement =>
        new Date(statement.date) <= new Date(dateRange.endDate)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(statement => statement.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(statement => statement.status === filterStatus);
    }

    setFilteredStatements(filtered);
    setCurrentPage(1);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="text-success" size={20} />;
      case 'transfer':
        return <ArrowUpRight className="text-primary" size={20} />;
      case 'payment':
        return <CreditCard2Front className="text-danger" size={20} />;
      case 'withdrawal':
        return <ArrowUpRight className="text-warning" size={20} />;
      default:
        return <CreditCard2Front className="text-muted" size={20} />;
    }
  };

  const getAmountColor = (amount) => {
    return amount > 0 ? 'text-success' : 'text-danger';
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };
  const handleDownloadStatement = () => {
    try {
      // Create a structured statement report
      const userData = UserService.getUserData();
      const statementData = {
        accountHolder: userData.displayName?.fullName || 'Account Holder',
        accountNumber: userData.accountNumber || 'N/A',
        statementPeriod: {
          from: dateRange.startDate || 'All time',
          to: dateRange.endDate || new Date().toISOString().split('T')[0]
        },
        generatedOn: new Date().toISOString(),
        transactions: filteredStatements.map(statement => ({
          date: statement.date,
          reference: statement.reference,
          description: statement.description,
          type: statement.type,
          category: statement.category,
          amount: statement.amount,
          balance: statement.balance,
          status: statement.status
        })),
        summary: {
          totalTransactions: filteredStatements.length,
          totalDebits: filteredStatements.filter(s => s.amount < 0).reduce((sum, s) => sum + Math.abs(s.amount), 0),
          totalCredits: filteredStatements.filter(s => s.amount > 0).reduce((sum, s) => sum + s.amount, 0)
        }
      };

      const dataStr = JSON.stringify(statementData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `account_statement_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error downloading statement:', error);
      setError('Failed to download statement');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    setFilterType('all');
    setFilterStatus('all');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStatements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStatements.length / itemsPerPage);

  // Calculate summary
  const totalCredits = filteredStatements.filter(s => s.amount > 0).reduce((sum, s) => sum + s.amount, 0);
  const totalDebits = filteredStatements.filter(s => s.amount < 0).reduce((sum, s) => sum + Math.abs(s.amount), 0);
  const totalTransactions = filteredStatements.length;

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

      {/* Gradient Header */}
      <div className="statements-header">
        <div className="statements-header-icon">
          <FileEarmarkText size={40} />
        </div>
        <div>
          <h2 className="mb-1">Account Statements</h2>
          <p className="mb-0">View and download your transaction history</p>
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="light" onClick={handleDownloadStatement} style={{ color: '#2563eb', fontWeight: 600 }}>
          <Download className="me-2" size={18} /> Download Statement
        </Button>
      </div>

      {/* Summary Card */}
      <div className="summary-card">
        <div className="summary-item">
          <span className="summary-label">Total Credits</span>
          <span className="summary-value credit">{TransactionService.formatCurrency(totalCredits)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Debits</span>
          <span className="summary-value debit">{TransactionService.formatCurrency(totalDebits)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Transactions</span>
          <span className="summary-value">{totalTransactions}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="statements-filters mb-4">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} style={{ color: '#64748b' }} />
              </InputAdornment>
            ),
            style: { background: 'rgba(255,255,255,0.9)', borderRadius: '0.8em', minWidth: 260 }
          }}
          sx={{ maxWidth: 320, mr: 1 }}
        />
        <Form.Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ maxWidth: 160 }}
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="transfer">Transfers</option>
          <option value="payment">Payments</option>
          <option value="withdrawal">Withdrawals</option>
        </Form.Select>
        <Form.Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ maxWidth: 160 }}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </Form.Select>
        <Form.Control
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          style={{ maxWidth: 160 }}
        />
        <Form.Control
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          style={{ maxWidth: 160 }}
        />
        <Button variant="outline-secondary" size="sm" onClick={clearFilters} style={{ marginLeft: 'auto' }}>
          Clear Filters
        </Button>
      </div>

      {/* Statements Table (replaced with card list) */}
      <div className="transactions-card mb-4">
        <div className="transactions-header">
          <h5 className="transactions-title">All Transactions</h5>
        </div>
        <div className="transactions-content">
          {currentItems.length === 0 ? (
            <div className="empty-transactions">
              <FileEarmarkText size={48} className="empty-icon" />
              <h6 className="empty-title">No Transactions Found</h6>
              <p className="empty-subtitle">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="transactions-list">
              {currentItems.map((statement) => (
                <div key={statement.id} className="transaction-item">
                  <div className="transaction-icon">
                    {getTransactionIcon(statement.type)}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-main">
                      <h6 className="transaction-description">{statement.description}</h6>
                      <div className="transaction-meta">
                        <span className="transaction-date">
                          {TransactionService.formatDate(statement.date)}
                        </span>
                        <span className="transaction-separator">•</span>
                        <span className="transaction-type text-capitalize">
                          {statement.type}
                        </span>
                      </div>
                    </div>
                    <div className="transaction-amount-section">
                      <span className={`transaction-amount ${statement.amount > 0 ? 'success' : 'danger'}`}>{statement.amount > 0 ? '+' : ''}{TransactionService.formatCurrency(Math.abs(statement.amount))}</span>
                      <Badge bg={TransactionService.getStatusColorClass(statement.status)} className="transaction-status">
                        {statement.status}
                      </Badge>
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(statement)} className="ms-2">
                        <Eye size={14} className="me-1" /> View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center p-3 border-top">
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="me-2"
            >
              Previous
            </Button>
            <span className="mx-3 small text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="ms-2"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered dialogClassName="statements-modal">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div>
              <div className="text-center mb-4">
                {getTransactionIcon(selectedTransaction.type)}
                <h5 className="mt-2">{selectedTransaction.description}</h5>
              </div>
              <div className="border rounded p-3 bg-light">
                <Row className="mb-2">
                  <Col xs={4} className="text-muted">Transaction ID:</Col>
                  <Col xs={8}><strong>{selectedTransaction.id}</strong></Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="text-muted">Reference:</Col>
                  <Col xs={8}>{selectedTransaction.reference}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="text-muted">Date:</Col>
                  <Col xs={8}>{TransactionService.formatDate(selectedTransaction.date)}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="text-muted">Type:</Col>
                  <Col xs={8}>
                    <Badge bg="secondary" className="text-capitalize">
                      {selectedTransaction.type}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="text-muted">Category:</Col>
                  <Col xs={8}>{selectedTransaction.category}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="text-muted">Amount:</Col>
                  <Col xs={8}>
                    <strong className={selectedTransaction.amount > 0 ? 'text-credit' : 'text-debit'}>
                      {selectedTransaction.amount > 0 ? '+' : ''}
                      {TransactionService.formatCurrency(Math.abs(selectedTransaction.amount))}
                    </strong>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="text-muted">Balance After:</Col>
                  <Col xs={8}>
                    <strong>{TransactionService.formatCurrency(selectedTransaction.balance)}</strong>
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} className="text-muted">Status:</Col>
                  <Col xs={8}>
                    <Badge bg={TransactionService.getStatusColorClass(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default _userStatements;