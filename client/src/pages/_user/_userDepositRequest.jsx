import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Table, 
  Badge, 
  Modal, 
  Alert, 
  Spinner,
    InputGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { 
  PlusCircle, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle,
  InfoCircle,
  ArrowRepeat,
  CurrencyDollar,
  Cash,
  PersonCircle,
  Bank,
  Calendar3
} from 'react-bootstrap-icons';

import UserService from '../../services/user.Service';
import DepositRequestService from '../../services/depositRequest.Service';

const _userDepositRequest = () => {
  const [user, setUser] = useState(null);
  const [depositRequests, setDepositRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    amount: '',
    note: ''
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      const userData = UserService.getUserData();
      
      if (!userData.userId) {
        setError('User not authenticated');
        return;
      }

      // Load user profile
      const userProfile = await UserService.getUserProfile(userData.userId);
      setUser(userProfile);

      // Load deposit requests
      await loadDepositRequests(userData.userId);

    } catch (error) {
      console.error('Failed to load page data:', error);
      setError('Failed to load page data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDepositRequests = async (userId) => {
    try {
      const requests = await DepositRequestService.getDepositRequestsByUser(userId, 20);
      setDepositRequests(requests);
    } catch (error) {
      console.error('Failed to load deposit requests:', error);
      setError('Failed to load deposit requests');
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError('');
      
      const userData = UserService.getUserData();
      if (userData.userId) {
        await loadDepositRequests(userData.userId);
        setSuccess('Deposit requests refreshed successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to refresh deposit requests');
    } finally {
      setRefreshing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const userData = UserService.getUserData();
        const result = await DepositRequestService.createDepositRequest(
        userData.userId,
        parseFloat(formData.amount),
        formData.note      );

      setSuccess('Deposit request submitted successfully!');
      
      setShowRequestModal(false);
      setFormData({ amount: '', note: '' });
      
      // Refresh the requests list
      await loadDepositRequests(userData.userId);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="me-1" size={16} />;
      case 'approved':
        return <CheckCircle className="me-1" size={16} />;
      case 'rejected':
        return <XCircle className="me-1" size={16} />;
      default:
        return <InfoCircle className="me-1" size={16} />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container fluid className="py-4 deposit-request-page">
        <div className="text-center loading-container">
          <div className="loading-spinner">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          <p>Loading deposit requests...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="deposit-request-page py-4">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Deposit Requests</h2>
          <p className="text-muted subtitle">Request deposits to your account and track their status</p>
        </div>
        <div className="header-actions">
          <Button 
            variant="outline-primary" 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <ArrowRepeat className={refreshing ? 'spin' : ''} size={16} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
          <Button 
            variant="primary" 
            className="create-btn"
            onClick={() => setShowRequestModal(true)}
          >
            <PlusCircle size={18} />
            <span>New Request</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="custom-alert" dismissible onClose={() => setError('')}>
          <div className="alert-content">
            <XCircle size={20} className="alert-icon" />
            <span>{error}</span>
          </div>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="custom-alert" dismissible onClose={() => setSuccess('')}>
          <div className="alert-content">
            <CheckCircle size={20} className="alert-icon" />
            <span>{success}</span>
          </div>
        </Alert>
      )}

      {/* User Info Cards */}
      {user && (
        <div className="account-summary-section">
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <Card className="info-card account-card">
                <Card.Body>
                  <div className="card-icon">
                    <PersonCircle size={24} />
                  </div>
                  <h6 className="info-label">Account Holder</h6>
                  <div className="info-value">
                    {user.accountType === 'business' 
                      ? user.businessName 
                      : `${user.firstName} ${user.lastName}`}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="info-card balance-card">
                <Card.Body>
                  <div className="card-icon">
                    <CurrencyDollar size={24} />
                  </div>
                  <h6 className="info-label">Current Balance</h6>
                  <div className="info-value balance">
                    {formatCurrency(user.balance)}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="info-card account-number-card">
                <Card.Body>
                  <div className="card-icon">
                    <Bank size={24} />
                  </div>
                  <h6 className="info-label">Account Number</h6>
                  <div className="info-value">
                    <span className="masked-number">••••</span>
                    <span className="visible-number">{user.accountNumber?.slice(-4) || '0000'}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="info-card account-type-card">
                <Card.Body>
                  <div className="card-icon">
                    <CreditCard size={24} />
                  </div>
                  <h6 className="info-label">Account Type</h6>
                  <div className="info-value">
                    <Badge className="account-type-badge">
                      {user.accountType === 'business' ? 'Business' : 'Personal'}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Deposit Requests Table */}
      <Row>
        <Col>
          <Card className="deposits-card">
            <Card.Header>
              <div className="card-header-content">
                <h5><Cash className="header-icon" /> Your Deposit Requests</h5>
                <div className="header-count">
                  {depositRequests.length} request{depositRequests.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {depositRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <CreditCard size={60} />
                  </div>
                  <h4>No deposit requests yet</h4>
                  <p>Create your first deposit request to add funds to your account</p>
                  <Button 
                    variant="primary" 
                    className="create-first-btn"
                    onClick={() => setShowRequestModal(true)}
                  >
                    <PlusCircle size={16} />
                    Create Your First Request
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="deposits-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Note</th>
                        <th>Submitted</th>
                        <th>Processed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depositRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="id-cell">
                            <code>{request.id}</code>
                          </td>
                          <td className="amount-cell">
                            <div className="amount-value">
                              {formatCurrency(request.amount)}
                            </div>
                          </td>
                          <td className="status-cell">
                            <Badge 
                              className={`status-badge status-${request.status.toLowerCase()}`}
                            >
                              {getStatusIcon(request.status)}
                              <span>{request.status}</span>
                            </Badge>
                          </td>
                          <td className="note-cell">
                            {request.note ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${request.id}`}>
                                    {request.note}
                                  </Tooltip>
                                }
                              >
                                <span className="note-text">
                                  {request.note.length > 30 
                                    ? `${request.note.substring(0, 30)}...` 
                                    : request.note}
                                </span>
                              </OverlayTrigger>
                            ) : (
                              <span className="no-note">No note provided</span>
                            )}
                          </td>
                          <td className="date-cell">
                            <div className="date-info">
                              <Calendar3 size={12} className="date-icon" />
                              <span>{formatDate(request.createdAt)}</span>
                            </div>
                          </td>
                          <td className="date-cell">
                            {request.processedAt ? (
                              <div className="date-info">
                                <Calendar3 size={12} className="date-icon" />
                                <span>{formatDate(request.processedAt)}</span>
                              </div>
                            ) : (
                              <span className="pending-text">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* New Deposit Request Modal */}
      <Modal 
        show={showRequestModal} 
        onHide={() => setShowRequestModal(false)} 
        centered
        className="deposit-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            <div className="title-icon">
              <PlusCircle size={24} />
            </div>
            <div>New Deposit Request</div>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitRequest}>
          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label className="form-label">Amount to Deposit</Form.Label>
              <TextField></TextField>
              <InputGroup className="amount-input">
                <InputGroup.Text className="currency-symbol">₱</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  required
                />
              </InputGroup>
              <Form.Text className="input-help">
                Minimum amount: ₱1.00
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label">Note (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                className="note-textarea"
                rows={3}
                name="note"
                placeholder="Add a note about this deposit request..."
                value={formData.note}
                onChange={handleInputChange}
                maxLength={500}
              />
              <div className="character-count">
                <span className={formData.note.length > 400 ? 'text-warning' : ''}>
                  {formData.note.length}
                </span>
                <span>/500 characters</span>
              </div>
            </Form.Group>

            <div className="info-box">
              <InfoCircle size={18} className="info-icon" />
              <div className="info-content">
                Your deposit request will be reviewed by our Finance team. 
                Once approved, the amount will be added to your account balance.
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-actions">
            <Button 
              variant="outline-secondary" 
              className="cancel-btn"
              onClick={() => setShowRequestModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="submit-btn"
              type="submit"
              disabled={submitting || !formData.amount}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="submit-spinner" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        /* Main Page Styles */
        .deposit-request-page {
          background-color: #f8f9fa;
          min-height: calc(100vh - 56px);
          font-family: "Inter", "Segoe UI", sans-serif;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
        }
        
        .loading-spinner {
          margin-bottom: 1rem;
        }
        
        /* Header Styles */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .page-title {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1e3a8a;
        }
        
        .subtitle {
          font-size: 0.9rem;
          margin: 0;
        }
        
        .header-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        .refresh-btn, .create-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .create-btn {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          border: none;
        }
        
        .create-btn:hover {
          background: linear-gradient(135deg, #172b6a 0%, #1e50c6 100%);
        }
        
        /* Alert Styles */
        .custom-alert {
          border-radius: 8px;
          margin-bottom: 1.5rem;
          padding: 0.75rem 1rem;
          border: none;
        }
        
        .alert-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        /* Account Summary Section */
        .account-summary-section {
          margin-bottom: 2rem;
        }
        
        .info-card {
          height: 100%;
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .info-card .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .card-icon {
          background: rgba(30, 58, 138, 0.1);
          color: #1e3a8a;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        
        .balance-card .card-icon {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }
        
        .account-number-card .card-icon {
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
        }
        
        .account-type-card .card-icon {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }
        
        .info-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
        }
        
        .info-value.balance {
          color: #059669;
        }
        
        .masked-number {
          letter-spacing: 2px;
          margin-right: 3px;
        }
        
        .account-type-badge {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          border: none;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.85rem;
          color: white;
        }
        
        /* Deposits Card */
        .deposits-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .deposits-card .card-header {
          background: white;
          border-bottom: 1px solid #efefef;
          padding: 1rem 1.25rem;
        }
        
        .card-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .card-header-content h5 {
          margin: 0;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .header-icon {
          color: #1e3a8a;
        }
        
        .header-count {
          font-size: 0.85rem;
          color: #6b7280;
          background-color: #f3f4f6;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
        }
        
        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }
        
        .empty-state-icon {
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }
        
        .empty-state h4 {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .empty-state p {
          color: #6b7280;
          margin-bottom: 1.5rem;
          max-width: 400px;
        }
        
        .create-first-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
        }
        
        /* Table Styles */
        .deposits-table {
          margin-bottom: 0;
        }
        
        .deposits-table thead {
          background-color: #f9fafb;
        }
        
        .deposits-table th {
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.5px;
          color: #6b7280;
          padding: 0.75rem 1.25rem;
          border-bottom-width: 1px;
        }
        
        .deposits-table td {
          padding: 1rem 1.25rem;
          vertical-align: middle;
          border-bottom-color: #efefef;
        }
        
        .deposits-table tbody tr:hover {
          background-color: #f9fafb;
        }
        
        .id-cell code {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.85rem;
          color: #2563eb;
          background-color: #f1f5fd;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
        
        .amount-cell .amount-value {
          font-weight: 600;
          color: #059669;
        }
        
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.75rem;
          text-transform: capitalize;
          width: fit-content;
        }
        
        .status-pending {
          background-color: #fffbeb;
          color: #b45309;
        }
        
        .status-approved {
          background-color: #ecfdf5;
          color: #059669;
        }
        
        .status-rejected {
          background-color: #fef2f2;
          color: #dc2626;
        }
        
        .note-text {
          color: #4b5563;
          cursor: help;
        }
        
        .no-note {
          color: #9ca3af;
          font-style: italic;
        }
        
        .date-cell .date-info {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #6b7280;
          font-size: 0.85rem;
        }
        
        .pending-text {
          color: #9ca3af;
          font-style: italic;
          font-size: 0.85rem;
        }
        
        /* Modal Styles */
        .deposit-modal .modal-content {
          border-radius: 12px;
          border: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .deposit-modal .modal-header {
          border-bottom-color: #efefef;
          padding: 1.25rem;
        }
        
        .deposit-modal .modal-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
        }
        
        .title-icon {
          color: #1e3a8a;
        }
        
        .deposit-modal .modal-body {
          padding: 1.5rem 1.25rem;
        }
        
        .form-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .amount-input .form-control {
          height: 48px;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .currency-symbol {
          background-color: #f9fafb;
          border-color: #e5e7eb;
          color: #4b5563;
          font-weight: 500;
        }
        
        .input-help {
          margin-top: 0.4rem;
          font-size: 0.8rem;
        }
        
        .note-textarea {
          resize: none;
          border-color: #e5e7eb;
        }
        
        .note-textarea:focus {
          border-color: #1e3a8a;
          box-shadow: 0 0 0 0.25rem rgba(30, 58, 138, 0.15);
        }
        
        .character-count {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .info-box {
          background-color: #f1f5fd;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .info-icon {
          color: #2563eb;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        
        .info-content {
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.5;
        }
        
        .deposit-modal .modal-footer {
          border-top-color: #efefef;
          padding: 1rem 1.25rem;
          gap: 0.75rem;
        }
        
        .cancel-btn {
          border-color: #e5e7eb;
          color: #4b5563;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #172b6a 0%, #1e50c6 100%);
        }
        
        .submit-spinner {
          width: 16px;
          height: 16px;
        }
        
        /* Animation */
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </Container>
  );
};

export default _userDepositRequest;
