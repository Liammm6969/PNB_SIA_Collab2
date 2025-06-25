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

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FileEarmarkText size={32} className="text-primary me-3" />
              <div>
                <h2 className="mb-0">Account Statements</h2>
                <p className="text-muted mb-0">View and download your transaction history</p>
              </div>
            </div>
            <Button variant="primary" onClick={handleDownloadStatement}>
              <Download className="me-2" size={16} />
              Download Statement
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="glass-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input"
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="glass-input"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="transfer">Transfers</option>
                <option value="payment">Payments</option>
                <option value="withdrawal">Withdrawals</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="glass-input"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="glass-input"
                placeholder="Start Date"
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="glass-input"
                placeholder="End Date"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {currentItems.length} of {filteredStatements.length} transactions
                </small>
                <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Statements Table */}
      <Card className="glass-card">
        <Card.Body className="p-0">
          {currentItems.length === 0 ? (
            <div className="text-center py-5">
              <FileEarmarkText size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No transactions found</h5>
              <p className="text-muted">Try adjusting your filters or date range</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Balance</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((statement) => (
                      <tr key={statement.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {getTransactionIcon(statement.type)}
                            <div className="ms-2">
                              <div className="small fw-bold">
                                {TransactionService.formatDate(statement.date)}
                              </div>
                              <div className="text-muted small">
                                {statement.reference}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold">{statement.description}</div>
                            <div className="text-muted small">{statement.category}</div>
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary" className="text-capitalize">
                            {statement.type}
                          </Badge>
                        </td>
                        <td>
                          <span className={`fw-bold ${getAmountColor(statement.amount)}`}>
                            {statement.amount > 0 ? '+' : ''}
                            {TransactionService.formatCurrency(Math.abs(statement.amount))}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold">
                            {TransactionService.formatCurrency(statement.balance)}
                          </span>
                        </td>
                        <td>
                          <Badge bg={TransactionService.getStatusColorClass(statement.status)}>
                            {statement.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewDetails(statement)}
                          >
                            <Eye size={14} className="me-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
            </>
          )}
        </Card.Body>
      </Card>

      {/* Transaction Details Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
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
              
              <div className="border rounded p-3">
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
                    <strong className={getAmountColor(selectedTransaction.amount)}>
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