import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Modal, 
  Badge, 
  Spinner, 
  Alert,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Dropdown
} from 'react-bootstrap';
import { 
  Search, 
  Download, 
  Filter, 
  Eye, 
  Calendar,
  ArrowUpRight,  ArrowDownLeft,
  CreditCard2Front,
  FileEarmarkText,  ArrowClockwise,
  ArrowUp,
  ArrowDown,
  DashCircle,
  PlusCircle,
  ExclamationTriangleFill,
  CheckCircleFill,
  InfoCircle
} from 'react-bootstrap-icons';
import UserService from '../../services/user.Service';
import TransactionService from '../../services/transaction.Service';
import '../../styles/userStyles/_userTransactions.css';

const _userTransactions = () => {
  // State management
  const [user, setUser] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadUserData();
    loadLedgerData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [ledgerData, searchTerm, filterType, dateRange]);

  const loadUserData = async () => {
    try {
      const userData = UserService.getUserData();
      if (!userData.userId) {
        setError('User not authenticated');
        return;
      }

      const userProfile = await UserService.getUserProfile(userData.userId);
      setUser(userProfile);
    } catch (err) {
      setError(err.message || 'Failed to load user data');
    }
  };

  const loadLedgerData = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const userData = UserService.getUserData();
      if (!userData.userId) {
        setError('User not authenticated');
        return;
      }

      // Get comprehensive ledger data
      const options = {
        limit: 100, // Load more entries for better filtering
        ...dateRange
      };

      const ledger = await TransactionService.getUserLedger(userData.userId, options);
      setLedgerData(ledger);
      setError('');

    } catch (err) {
      setError(err.message || 'Failed to load transaction ledger');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    if (!ledgerData?.entries) {
      setFilteredEntries([]);
      return;
    }

    let filtered = [...ledgerData.entries];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.description.toLowerCase().includes(searchLower) ||
        entry.reference.toLowerCase().includes(searchLower) ||
        (entry.relatedUser?.name || '').toLowerCase().includes(searchLower) ||
        entry.type.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(entry => entry.type === filterType);
    }

    // Date range filter (client-side additional filtering)
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        return true;
      });
    }

    setFilteredEntries(filtered);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadLedgerData(true);
  };

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  };

  const handleExport = (format) => {
    try {
      const exportData = {
        accountHolder: ledgerData.accountHolder,
        accountNumber: ledgerData.accountNumber,
        exportDate: new Date().toISOString(),
        period: {
          from: dateRange.startDate || 'All time',
          to: dateRange.endDate || new Date().toISOString().split('T')[0]
        },
        summary: ledgerData.summary,
        entries: filteredEntries.map(entry => ({
          date: entry.date,
          reference: entry.reference,
          description: entry.description,
          debit: entry.debit || '',
          credit: entry.credit || '',
          balance: entry.balance,
          type: entry.type,
          relatedParty: entry.relatedUser?.name || ''
        }))
      };

      if (format === 'json') {
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `ledger_${new Date().toISOString().split('T')[0]}.json`);
        linkElement.click();
      } else if (format === 'csv') {
        const csvContent = [
          ['Date', 'Reference', 'Description', 'Debit', 'Credit', 'Balance', 'Type', 'Related Party'],
          ...exportData.entries.map(entry => [
            new Date(entry.date).toLocaleDateString(),
            entry.reference,
            entry.description,
            entry.debit || '',
            entry.credit || '',
            entry.balance,
            entry.type,
            entry.relatedParty
          ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ledger_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      setShowExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setDateRange({ startDate: '', endDate: '' });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
      case 'transfer_in':
        return <ArrowDownLeft className="text-success" size={20} />;
      case 'transfer_out':
      case 'withdrawal':
        return <ArrowUpRight className="text-danger" size={20} />;
      default:
        return <CreditCard2Front className="text-muted" size={20} />;
    }
  };

  const getTypeDisplay = (type) => {
    const typeMap = {
      'deposit': 'Deposit',
      'transfer_in': 'Incoming Transfer',
      'transfer_out': 'Outgoing Transfer',
      'withdrawal': 'Withdrawal'
    };
    return typeMap[type] || type;
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'deposit':
      case 'transfer_in':
        return 'success';
      case 'transfer_out':
      case 'withdrawal':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="text-center">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Loading transaction ledger...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4 d-flex align-items-center">
          <ExclamationTriangleFill className="me-2" />
          {error}
        </Alert>
      )}

      {/* Header Section */}
      <div className="ledger-header">
        <div className="ledger-header-content">
          <div className="ledger-header-icon">
            <FileEarmarkText size={40} />
          </div>
          <div>
            <h2 className="mb-1">Account Ledger</h2>
            <p className="mb-0">Complete transaction history with running balance</p>
          </div>
          <div className="ledger-header-actions">
            <Button 
              variant="outline-primary" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="me-2"
            >
              <ArrowClockwise size={16} className={refreshing ? 'spinning' : ''} />
              {refreshing ? ' Refreshing...' : ' Refresh'}
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setShowExportModal(true)}
            >
              <Download size={16} className="me-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {ledgerData?.summary && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="summary-card credit-card">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Total Credits</h6>
                    <h4 className="mb-0 text-success">
                      {TransactionService.formatCurrency(ledgerData.summary.totalCredits)}
                    </h4>
                  </div>
                  <ArrowUp size={24} className="text-success" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card debit-card">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Total Debits</h6>
                    <h4 className="mb-0 text-danger">
                      {TransactionService.formatCurrency(ledgerData.summary.totalDebits)}
                    </h4>
                  </div>
                  <ArrowDown size={24} className="text-danger" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card balance-card">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Current Balance</h6>
                    <h4 className="mb-0 text-primary">
                      {TransactionService.formatCurrency(ledgerData.summary.currentBalance)}
                    </h4>
                  </div>
                  <CreditCard2Front size={24} className="text-primary" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card entries-card">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Total Entries</h6>
                    <h4 className="mb-0 text-info">
                      {ledgerData.summary.totalEntries}
                    </h4>
                  </div>
                  <FileEarmarkText size={24} className="text-info" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters Section */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Label>Search Transactions</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by description, reference, or party"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="transfer_in">Incoming Transfers</option>
                <option value="transfer_out">Outgoing Transfers</option>
                <option value="withdrawal">Withdrawals</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              />
            </Col>
            <Col md={2}>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              />
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Ledger Table */}
      <Card>
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FileEarmarkText className="me-2" />
              Transaction Ledger
            </h5>
            <Badge bg="secondary">
              Showing {currentItems.length} of {filteredEntries.length} entries
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {currentItems.length === 0 ? (
            <div className="text-center py-5">
              <FileEarmarkText size={48} className="text-muted mb-3" />
              <h6 className="text-muted">No transactions found</h6>
              <p className="text-muted mb-0">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="ledger-table mb-0" hover>
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="text-end">Debit (−)</th>
                    <th className="text-end">Credit (+)</th>
                    <th className="text-end">Balance</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((entry, index) => (
                    <tr key={entry.id || index} className="ledger-entry">
                      <td>
                        <div className="date-cell">
                          {TransactionService.formatDate(entry.date)}
                          <small className="text-muted d-block">
                            {new Date(entry.date).toLocaleTimeString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="description-cell">
                          <div className="d-flex align-items-center">
                            {getTransactionIcon(entry.type)}
                            <div className="ms-2">
                              <div className="fw-semibold">{entry.description}</div>
                              <small className="text-muted">{entry.reference}</small>
                              {entry.relatedUser && (
                                <small className="d-block text-muted">
                                  {entry.relatedUser.name}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        {entry.debit && (
                          <span className="amount debit">
                            <DashCircle className="me-1" size={14} />
                            {TransactionService.formatCurrency(entry.debit)}
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        {entry.credit && (
                          <span className="amount credit">
                            <PlusCircle className="me-1" size={14} />
                            {TransactionService.formatCurrency(entry.credit)}
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        <strong className="balance-amount">
                          {TransactionService.formatCurrency(entry.balance)}
                        </strong>
                      </td>
                      <td>
                        <Badge bg={getTypeBadgeVariant(entry.type)}>
                          {getTypeDisplay(entry.type)}
                        </Badge>
                      </td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>View Details</Tooltip>}
                        >
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewDetails(entry)}
                          >
                            <Eye size={14} />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card.Footer className="bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                Page {currentPage} of {totalPages}
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* Transaction Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)} 
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FileEarmarkText className="me-2" />
            Transaction Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEntry && (
            <Row>
              <Col md={6}>
                <Card className="h-100">
                  <Card.Header>
                    <h6 className="mb-0">Basic Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="detail-row">
                      <strong>Reference:</strong>
                      <span className="font-monospace">{selectedEntry.reference}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Date & Time:</strong>
                      <span>{TransactionService.formatDate(selectedEntry.date)} at {new Date(selectedEntry.date).toLocaleTimeString()}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Type:</strong>
                      <Badge bg={getTypeBadgeVariant(selectedEntry.type)}>
                        {getTypeDisplay(selectedEntry.type)}
                      </Badge>
                    </div>
                    <div className="detail-row">
                      <strong>Description:</strong>
                      <span>{selectedEntry.description}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100">
                  <Card.Header>
                    <h6 className="mb-0">Financial Details</h6>
                  </Card.Header>
                  <Card.Body>
                    {selectedEntry.debit && (
                      <div className="detail-row">
                        <strong>Debit Amount:</strong>
                        <span className="text-danger">
                          −{TransactionService.formatCurrency(selectedEntry.debit)}
                        </span>
                      </div>
                    )}
                    {selectedEntry.credit && (
                      <div className="detail-row">
                        <strong>Credit Amount:</strong>
                        <span className="text-success">
                          +{TransactionService.formatCurrency(selectedEntry.credit)}
                        </span>
                      </div>
                    )}
                    <div className="detail-row">
                      <strong>Balance After:</strong>
                      <span className="text-primary fw-bold">
                        {TransactionService.formatCurrency(selectedEntry.balance)}
                      </span>
                    </div>
                    {selectedEntry.relatedUser && (
                      <>
                        <div className="detail-row">
                          <strong>Related Party:</strong>
                          <span>{selectedEntry.relatedUser.name}</span>
                        </div>
                        {selectedEntry.relatedUser.accountNumber !== 'SYSTEM' && (
                          <div className="detail-row">
                            <strong>Account Number:</strong>
                            <span className="font-monospace">{selectedEntry.relatedUser.accountNumber}</span>
                          </div>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Export Modal */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Download className="me-2" />
            Export Ledger
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose your preferred export format:</p>
          <div className="d-grid gap-2">
            <Button 
              variant="outline-primary" 
              onClick={() => handleExport('csv')}
              className="d-flex align-items-center justify-content-center"
            >
              <FileEarmarkText className="me-2" />
              Export as CSV (Spreadsheet)
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => handleExport('json')}
              className="d-flex align-items-center justify-content-center"
            >
              <FileEarmarkText className="me-2" />
              Export as JSON (Data)
            </Button>
          </div>
          <div className="mt-3">
            <small className="text-muted">
              <InfoCircle className="me-1" />
              Export includes {filteredEntries.length} filtered entries
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default _userTransactions;