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
  Modal,
  Badge,
  ListGroup
} from 'react-bootstrap';
import {
  ArrowUpRight,
  PersonCheck,
  CreditCard2Front,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  StarFill
} from 'react-bootstrap-icons';
import UserService from '../../services/user.Service';
import TransferService from '../../services/transfer.Service';
import TransactionService from '../../services/transaction.Service';

const _userTransfer = () => {
  const [formData, setFormData] = useState({
    recipientAccount: '',
    amount: '',
    description: '',
    saveAsBeneficiary: false,
    beneficiaryNickname: ''
  });
  const [recipient, setRecipient] = useState(null);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validatingRecipient, setValidatingRecipient] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [recentTransfers, setRecentTransfers] = useState([]);

  useEffect(() => {
    loadUserData();
    loadBeneficiaries();
    loadRecentTransfers();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = UserService.getUserData();
      if (!userData.userId) {
        setError('User not authenticated');
        return;
      }

      const userProfile = await UserService.getUserProfile(userData.userId);
      setUser(userProfile.user || userProfile);
      setBalance(userProfile.user?.balance || userProfile.balance || 25000.50);
    } catch (err) {
      setError(err.message || 'Failed to load user data');
    }
  };

  const loadBeneficiaries = async () => {
    try {
      const userData = UserService.getUserData();
      if (userData.userId) {
        // Mock beneficiaries data for now
        const mockBeneficiaries = [
          {
            id: '1',
            accountNumber: '123-4567-890-1234',
            name: 'John Doe',
            nickname: 'John',
            isFavorite: true
          },
          {
            id: '2',
            accountNumber: '234-5678-901-2345',
            name: 'Jane Smith',
            nickname: 'Jane',
            isFavorite: false
          }
        ];
        setBeneficiaries(mockBeneficiaries);
      }
    } catch (err) {
      console.error('Failed to load beneficiaries:', err);
    }
  };

  const loadRecentTransfers = async () => {
    try {
      const userData = UserService.getUserData();
      if (userData.userId) {
        // Mock recent transfers data
        const mockTransfers = [
          {
            id: '1',
            recipientName: 'John Doe',
            recipientAccount: '123-4567-890-1234',
            amount: 5000,
            date: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: '2',
            recipientName: 'Jane Smith',
            recipientAccount: '234-5678-901-2345',
            amount: 3000,
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed'
          }
        ];
        setRecentTransfers(mockTransfers);
      }
    } catch (err) {
      console.error('Failed to load recent transfers:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear recipient when account number changes
    if (name === 'recipientAccount') {
      setRecipient(null);
    }
  };

  const validateRecipient = async () => {
    if (!formData.recipientAccount) return;

    const validation = TransferService.validateAccountNumber(formData.recipientAccount);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    try {
      setValidatingRecipient(true);
      setError('');
      
      // Mock recipient validation
      const mockRecipient = {
        accountNumber: formData.recipientAccount,
        name: 'John Doe',
        accountType: 'personal',
        isActive: true
      };
      
      setRecipient(mockRecipient);
    } catch (err) {
      setError(err.message || 'Failed to validate recipient');
      setRecipient(null);
    } finally {
      setValidatingRecipient(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.recipientAccount || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (!recipient) {
      setError('Please validate the recipient account');
      return;
    }

    const amountValidation = TransferService.validateTransferAmount(
      parseFloat(formData.amount),
      balance
    );

    if (!amountValidation.isValid) {
      setError(amountValidation.errors[0]);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmTransfer = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const userData = UserService.getUserData();
      const transferData = {
        fromUserId: userData.userId,
        toAccountNumber: formData.recipientAccount,
        amount: parseFloat(formData.amount),
        description: formData.description || `Transfer to ${recipient.name}`,
        type: 'internal'
      };

      // Mock transfer success
      setSuccess(`Transfer of ${TransactionService.formatCurrency(transferData.amount)} to ${recipient.name} completed successfully!`);
      
      // Reset form
      setFormData({
        recipientAccount: '',
        amount: '',
        description: '',
        saveAsBeneficiary: false,
        beneficiaryNickname: ''
      });
      setRecipient(null);

      // Reload data
      loadUserData();
      loadRecentTransfers();

    } catch (err) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const selectBeneficiary = (beneficiary) => {
    setFormData(prev => ({
      ...prev,
      recipientAccount: beneficiary.accountNumber
    }));
    setRecipient({
      accountNumber: beneficiary.accountNumber,
      name: beneficiary.name,
      accountType: 'personal',
      isActive: true
    });
  };

  const formatAccountNumberInput = (value) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 3) {
      formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3);
    }
    if (cleaned.length > 7) {
      formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7) + '-' + cleaned.slice(7);
    }
    if (cleaned.length > 10) {
      formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7) + '-' + cleaned.slice(7, 10) + '-' + cleaned.slice(10, 14);
    }
    
    return formatted;
  };

  return (
    <Container fluid className="py-4">
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      <Row>
        {/* Transfer Form */}
        <Col lg={8}>
          <Card className="glass-card mb-4">
            <Card.Header className="bg-transparent border-0">
              <div className="d-flex align-items-center">
                <ArrowUpRight className="text-primary me-2" size={24} />
                <h5 className="mb-0">Send Money</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Recipient Account Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="recipientAccount"
                        value={formData.recipientAccount}
                        onChange={(e) => {
                          const formatted = formatAccountNumberInput(e.target.value);
                          handleInputChange({
                            target: { name: 'recipientAccount', value: formatted }
                          });
                        }}
                        onBlur={validateRecipient}
                        placeholder="XXX-XXXX-XXX-XXXX"
                        className="glass-input"
                        maxLength="17"
                        required
                      />
                      {validatingRecipient && (
                        <div className="mt-2">
                          <Spinner size="sm" className="me-2" />
                          <small className="text-muted">Validating recipient...</small>
                        </div>
                      )}
                      {recipient && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <div className="d-flex align-items-center">
                            <PersonCheck className="text-success me-2" />
                            <div>
                              <strong>{recipient.name}</strong>
                              <div className="text-muted small">
                                {recipient.accountNumber} • {recipient.accountType}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="glass-input"
                        min="1"
                        step="0.01"
                        required
                      />
                      <Form.Text className="text-muted">
                        Available balance: {TransactionService.formatCurrency(balance)}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="What's this transfer for?"
                    className="glass-input"
                  />
                </Form.Group>

                <Form.Check
                  type="checkbox"
                  name="saveAsBeneficiary"
                  checked={formData.saveAsBeneficiary}
                  onChange={handleInputChange}
                  label="Save as beneficiary for future transfers"
                  className="mb-3"
                />

                {formData.saveAsBeneficiary && (
                  <Form.Group className="mb-3">
                    <Form.Label>Beneficiary Nickname</Form.Label>
                    <Form.Control
                      type="text"
                      name="beneficiaryNickname"
                      value={formData.beneficiaryNickname}
                      onChange={handleInputChange}
                      placeholder="e.g., John, Mom, Work Account"
                      className="glass-input"
                    />
                  </Form.Group>
                )}

                <div className="d-flex gap-3">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading || !recipient}
                    className="flex-grow-1"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="me-2" />
                        Send Money
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline-secondary"
                    onClick={() => {
                      setFormData({
                        recipientAccount: '',
                        amount: '',
                        description: '',
                        saveAsBeneficiary: false,
                        beneficiaryNickname: ''
                      });
                      setRecipient(null);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Saved Beneficiaries */}
          <Card className="glass-card mb-4">
            <Card.Header className="bg-transparent border-0">
              <h6 className="mb-0">Saved Beneficiaries</h6>
            </Card.Header>
            <Card.Body className="p-0">
              {beneficiaries.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-muted mb-0 small">No saved beneficiaries</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {beneficiaries.slice(0, 5).map((beneficiary) => (
                    <ListGroup.Item 
                      key={beneficiary.id}
                      className="border-0 px-3 py-2 cursor-pointer"
                      onClick={() => selectBeneficiary(beneficiary)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex align-items-center">
                            <strong className="small">{beneficiary.nickname}</strong>
                            {beneficiary.isFavorite && (
                              <StarFill className="text-warning ms-1" size={12} />
                            )}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {beneficiary.accountNumber}
                          </div>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectBeneficiary(beneficiary);
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          {/* Recent Transfers */}
          <Card className="glass-card">
            <Card.Header className="bg-transparent border-0">
              <h6 className="mb-0">Recent Transfers</h6>
            </Card.Header>
            <Card.Body className="p-0">
              {recentTransfers.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-muted mb-0 small">No recent transfers</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {recentTransfers.slice(0, 5).map((transfer) => (
                    <ListGroup.Item key={transfer.id} className="border-0 px-3 py-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="small fw-bold">{transfer.recipientName}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {transfer.recipientAccount}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {TransactionService.formatDate(transfer.date)}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="small fw-bold text-danger">
                            -{TransactionService.formatCurrency(transfer.amount)}
                          </div>
                          <Badge bg={TransactionService.getStatusColorClass(transfer.status)} className="small">
                            {transfer.status}
                          </Badge>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <ArrowUpRight size={48} className="text-primary mb-3" />
            <h5>Transfer Summary</h5>
          </div>
          
          <div className="border rounded p-3 mb-3">
            <Row>
              <Col xs={4} className="text-muted">To:</Col>
              <Col xs={8}>
                <strong>{recipient?.name}</strong><br />
                <small className="text-muted">{formData.recipientAccount}</small>
              </Col>
            </Row>
            <hr className="my-2" />
            <Row>
              <Col xs={4} className="text-muted">Amount:</Col>
              <Col xs={8}>
                <strong className="text-primary">
                  {TransactionService.formatCurrency(parseFloat(formData.amount || 0))}
                </strong>
              </Col>
            </Row>
            <hr className="my-2" />
            <Row>
              <Col xs={4} className="text-muted">Fee:</Col>
              <Col xs={8}>
                <strong>₱0.00</strong> <small className="text-success">(Free)</small>
              </Col>
            </Row>
            <hr className="my-2" />
            <Row>
              <Col xs={4} className="text-muted">Total:</Col>
              <Col xs={8}>
                <strong className="text-primary">
                  {TransactionService.formatCurrency(parseFloat(formData.amount || 0))}
                </strong>
              </Col>
            </Row>
            {formData.description && (
              <>
                <hr className="my-2" />
                <Row>
                  <Col xs={4} className="text-muted">Note:</Col>
                  <Col xs={8}>{formData.description}</Col>
                </Row>
              </>
            )}
          </div>

          <Alert variant="info" className="small">
            <Clock className="me-2" size={16} />
            This transfer will be processed immediately.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmTransfer} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Confirm Transfer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default _userTransfer;