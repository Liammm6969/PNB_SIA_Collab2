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
  InputGroup
} from 'react-bootstrap';
import { 
  PlusCircle, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle,
  InfoCircle,
  ArrowRepeat
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
        formData.note
      );

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
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading deposit requests...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Deposit Requests</h2>
              <p className="text-muted mb-0">Request deposits to your account</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <ArrowRepeat className={`me-1 ${refreshing ? 'spin' : ''}`} size={16} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button 
                variant="primary" 
                onClick={() => setShowRequestModal(true)}
              >
                <PlusCircle className="me-2" size={18} />
                New Request
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* User Info Card */}
      {user && (
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <CreditCard size={24} className="text-primary me-3" />
                  <div>
                    <h6 className="mb-0">Account Information</h6>
                    <small className="text-muted">Your account details</small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <p className="mb-2"><strong>Name:</strong></p>
                    <p className="text-muted">
                      {user.accountType === 'business' 
                        ? user.businessName 
                        : `${user.firstName} ${user.lastName}`}
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2"><strong>Account:</strong></p>
                    <p className="text-muted">****{user.accountNumber?.slice(-4)}</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2"><strong>Current Balance:</strong></p>
                    <p className="text-success fw-bold">{formatCurrency(user.balance)}</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2"><strong>Account Type:</strong></p>
                    <Badge bg="info">{user.accountType}</Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Deposit Requests Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Your Deposit Requests</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {depositRequests.length === 0 ? (
                <div className="text-center py-5">
                  <CreditCard size={48} className="text-muted mb-3" />
                  <p className="text-muted">No deposit requests found</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowRequestModal(true)}
                  >
                    <PlusCircle className="me-2" size={16} />
                    Create Your First Request
                  </Button>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
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
                        <td>
                          <code className="text-primary">{request.id}</code>
                        </td>
                        <td>
                          <strong className="text-success">
                            {formatCurrency(request.amount)}
                          </strong>
                        </td>
                        <td>
                          <Badge 
                            bg={DepositRequestService.getStatusColor(request.status)}
                            className="d-flex align-items-center w-fit"
                          >
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                        </td>
                        <td>
                          <span className="text-muted">
                            {request.note || 'No note provided'}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatDate(request.createdAt)}
                          </small>
                        </td>
                        <td>
                          <small className="text-muted">
                            {request.processedAt 
                              ? formatDate(request.processedAt)
                              : '—'
                            }
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* New Deposit Request Modal */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <PlusCircle className="me-2" size={24} />
            New Deposit Request
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitRequest}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Amount to Deposit</Form.Label>
              <InputGroup>
                <InputGroup.Text>₱</InputGroup.Text>
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
              <Form.Text className="text-muted">
                Minimum amount: ₱1.00
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                placeholder="Add a note about this deposit request..."
                value={formData.note}
                onChange={handleInputChange}
                maxLength={500}
              />
              <Form.Text className="text-muted">
                {formData.note.length}/500 characters
              </Form.Text>
            </Form.Group>

            <Alert variant="info" className="mb-0">
              <InfoCircle className="me-2" size={16} />
              Your deposit request will be reviewed by our Finance team. 
              Once approved, the amount will be added to your account balance.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowRequestModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={submitting || !formData.amount}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>      <style dangerouslySetInnerHTML={{__html: `
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .w-fit {
          width: fit-content !important;
        }
      `}} />
    </Container>
  );
};

export default _userDepositRequest;
