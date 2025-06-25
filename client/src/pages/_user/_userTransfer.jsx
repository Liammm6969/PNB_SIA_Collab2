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
import BeneficiaryService from '../../services/beneficiary.Service';

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
  const [success, setSuccess] = useState('');  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [loadingTransfers, setLoadingTransfers] = useState(false);

  useEffect(() => {
    loadUserData();
    loadBeneficiaries();
    loadRecentTransfers();
  }, []);  const loadUserData = async () => {
    try {
      const userData = UserService.getUserData();
      if (!userData.userId) {
        setError('User not authenticated');
        return;
      }

      const userProfile = await UserService.getUserProfile(userData.userId);
      const user = userProfile.user || userProfile;
      setUser(user);
      setBalance(user?.balance || 0); // Use real balance, default to 0
      
      // Store account number in localStorage if not already stored
      if (user?.accountNumber && !userData.accountNumber) {
        UserService.setUserData({ ...userData, accountNumber: user.accountNumber });
      }
    } catch (err) {
      setError(err.message || 'Failed to load user data');
    }
  };  const loadBeneficiaries = async () => {
    try {
      setLoadingBeneficiaries(true);
      const userData = UserService.getUserData();
      if (userData.userId) {
        // Get real beneficiaries from backend
        const realBeneficiaries = await BeneficiaryService.getBeneficiaries(userData.userId);
        
        // Transform backend data to match frontend expectations
        const transformedBeneficiaries = realBeneficiaries.map(beneficiary => ({
          id: beneficiary.beneficiaryId,
          accountNumber: beneficiary.accountNumber,
          name: beneficiary.name,
          nickname: beneficiary.nickname,
          isFavorite: beneficiary.isFavorite,
          accountType: beneficiary.accountType,
          lastUsed: beneficiary.lastUsed
        }));
        
        setBeneficiaries(transformedBeneficiaries);
      }
    } catch (err) {
      console.error('Failed to load beneficiaries:', err);
      // Set empty array on error
      setBeneficiaries([]);
    } finally {
      setLoadingBeneficiaries(false);
    }
  };  const loadRecentTransfers = async () => {
    try {
      setLoadingTransfers(true);
      const userData = UserService.getUserData();
      if (userData.userId) {
        // Get userIdSeq - handle both string and numeric IDs
        let userIdSeq;
        if (typeof userData.userId === 'string' && userData.userId.includes('-')) {
          userIdSeq = parseInt(userData.userId.split('-')[1]);
        } else {
          userIdSeq = parseInt(userData.userId);
        }
          console.log('Loading transfers for userIdSeq:', userIdSeq);
        
        const realTransfers = await TransactionService.getUserPayments(userIdSeq, { limit: 10 });
        console.log('Raw transfers from backend:', realTransfers);
        
        if (!realTransfers || realTransfers.length === 0) {
          console.log('No transfers found for user:', userIdSeq);
          setRecentTransfers([]);
          return;
        }
        
        // Transform backend data and enhance with recipient info
        const transformedTransfers = await Promise.all(
          realTransfers
            .filter(transfer => parseInt(transfer.fromUser) === userIdSeq) // Only outgoing transfers
            .map(async (transfer) => {
              let recipientName = transfer.details || 'Unknown Recipient';
              let recipientAccount = 'N/A';
              
              try {
                // Try to get recipient details from user records
                const recipientUser = await UserService.getUserByUserIdSeq(transfer.toUser);
                if (recipientUser) {
                  recipientName = recipientUser.displayName?.fullName || recipientUser.firstName + ' ' + recipientUser.lastName || recipientUser.businessName || 'Unknown User';
                  recipientAccount = recipientUser.accountNumber || 'N/A';
                }
              } catch (err) {
                console.warn('Could not fetch recipient details for user:', transfer.toUser, err);
              }
              
              return {
                id: transfer.paymentId || transfer.transactionId,
                recipientName: recipientName,
                recipientAccount: recipientAccount,
                amount: Math.abs(transfer.amount),
                date: transfer.createdAt || transfer.date,
                status: 'completed'
              };
            })
        );
        
        console.log('Transformed transfers:', transformedTransfers);
        setRecentTransfers(transformedTransfers);
      }
    } catch (err) {
      console.error('Failed to load recent transfers:', err);
      // Set empty array on error
      setRecentTransfers([]);
    } finally {
      setLoadingTransfers(false);
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
  };  const validateRecipient = async () => {
    if (!formData.recipientAccount) return;

    const validation = TransferService.validateAccountNumber(formData.recipientAccount);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    try {
      setValidatingRecipient(true);
      setError('');
      
      // Use real backend validation
      const recipientData = await BeneficiaryService.validateRecipient(formData.recipientAccount);
      
      setRecipient({
        accountNumber: recipientData.accountNumber,
        name: recipientData.name,
        accountType: recipientData.accountType,
        isActive: recipientData.isActive,
        userId: recipientData.userId
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to validate recipient');
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
  };  const confirmTransfer = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);
      setError('');

      // Get account number from user object or localStorage
      const userData = UserService.getUserData();
      const fromAccount = user?.accountNumber || userData.accountNumber;
      
      if (!fromAccount) {
        setError('Unable to get sender account information');
        return;
      }

      const transferData = {
        fromUser: fromAccount,
        toUser: formData.recipientAccount,
        amount: parseFloat(formData.amount),
        details: formData.description || `Transfer to ${recipient.name}`
      };

      console.log('Transfer Data:', transferData); // Debug log      // Call the real transfer API
      const result = await TransactionService.transferMoney(transferData);
      
      setSuccess(`Transfer of ${TransactionService.formatCurrency(transferData.amount)} to ${recipient.name} completed successfully!`);
        // Handle beneficiary saving if requested
      if (formData.saveAsBeneficiary && formData.beneficiaryNickname) {
        try {
          const userData = UserService.getUserData();
          const userIdSeq = userData.userId.includes('-') 
            ? userData.userId.split('-')[1] 
            : userData.userId;
          
          await BeneficiaryService.addBeneficiary({
            userId: userIdSeq,
            accountNumber: formData.recipientAccount,
            nickname: formData.beneficiaryNickname,
            name: recipient.name,
            accountType: recipient.accountType,
            isFavorite: false
          });
          
          setSuccess(`Transfer completed and ${formData.beneficiaryNickname} saved as beneficiary!`);
          
          // Reload beneficiaries to show the new one
          await loadBeneficiaries();
        } catch (beneficiaryError) {
          console.warn('Failed to save beneficiary:', beneficiaryError);
          // Still show success for transfer, but mention beneficiary save failed
          setSuccess(`Transfer completed successfully! (Note: Could not save beneficiary: ${beneficiaryError.message})`);
        }
      }
      
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
      setError(err.response?.data?.error || err.message || 'Transfer failed');
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
      accountType: beneficiary.accountType || 'personal',
      isActive: true
    });
  };
  const toggleBeneficiaryFavorite = async (beneficiaryId, currentFavorite) => {
    try {
      await BeneficiaryService.toggleFavorite(beneficiaryId, !currentFavorite);
      // Reload beneficiaries to reflect the change
      await loadBeneficiaries();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const quickTransferFromRecent = (transfer) => {
    setFormData(prev => ({
      ...prev,
      recipientAccount: transfer.recipientAccount,
      description: `Repeat transfer to ${transfer.recipientName}`
    }));
    
    // If we have the account number, validate it
    if (transfer.recipientAccount && transfer.recipientAccount !== 'N/A') {
      setRecipient({
        accountNumber: transfer.recipientAccount,
        name: transfer.recipientName,
        accountType: 'personal', // Default
        isActive: true
      });
    }
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
            </Card.Header>            <Card.Body className="p-0">
              {loadingBeneficiaries ? (
                <div className="text-center py-3">
                  <Spinner size="sm" className="me-2" />
                  <small className="text-muted">Loading beneficiaries...</small>
                </div>
              ) : beneficiaries.length === 0 ? (
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
                      <div className="d-flex justify-content-between align-items-center">                        <div>
                          <div className="d-flex align-items-center">
                            <strong className="small">{beneficiary.nickname}</strong>
                            <button
                              className="btn btn-link p-0 ms-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBeneficiaryFavorite(beneficiary.id, beneficiary.isFavorite);
                              }}
                              style={{ border: 'none', background: 'none' }}
                            >
                              {beneficiary.isFavorite ? (
                                <StarFill className="text-warning" size={12} />
                              ) : (
                                <Star className="text-muted" size={12} />
                              )}
                            </button>
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
            </Card.Header>            <Card.Body className="p-0">
              {loadingTransfers ? (
                <div className="text-center py-3">
                  <Spinner size="sm" className="me-2" />
                  <small className="text-muted">Loading transfers...</small>
                </div>
              ) : recentTransfers.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-muted mb-0 small">No recent transfers</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {recentTransfers.slice(0, 5).map((transfer) => (                    <ListGroup.Item key={transfer.id} className="border-0 px-3 py-2">
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
                          {transfer.recipientAccount !== 'N/A' && (
                            <div className="mt-1">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => quickTransferFromRecent(transfer)}
                                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                              >
                                Repeat
                              </Button>
                            </div>
                          )}
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