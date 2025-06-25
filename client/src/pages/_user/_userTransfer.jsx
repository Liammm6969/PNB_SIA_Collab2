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
  StarFill,
  Send,
  CreditCard,
  Check,
  Plus,
  Repeat,
  Search,
  X,
  ArrowRight
} from 'react-bootstrap-icons';
import UserService from '../../services/user.Service';
import TransferService from '../../services/transfer.Service';
import TransactionService from '../../services/transaction.Service';
import BeneficiaryService from '../../services/beneficiary.Service';
import '../../styles/_userTransfer.css';

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
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('beneficiaries');

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
  };

  const loadBeneficiaries = async () => {
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
  };

  const loadRecentTransfers = async () => {
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
  };

  const confirmTransfer = async () => {
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
      };      console.log('Transfer Data:', transferData); // Debug log      // Call the real transfer API
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

  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="transfer-outer">
      <div className="transfer-center">
        <div className="transfer-main-card">
          <div className="transfer-header">
            <h1 className="transfer-title">Send Money</h1>
            <p className="transfer-subtitle">Transfer funds instantly to anyone, anywhere</p>
          </div>
          <div className="transfer-balance-card">
            <div className="balance-info">
              <p className="balance-label">Available Balance</p>
              <p className="balance-amount">₱{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="balance-icon">
              <CreditCard className="icon-lg" />
            </div>
          </div>
          <div className="transfer-main-row">
            <form className="transfer-form" onSubmit={handleSubmit} autoComplete="off">
              {/* Recipient Section */}
              <div className="form-section">
                <label className="form-label" htmlFor="recipientAccount">Recipient Account Number</label>
                <div className="input-icon-group">
                  <input
                    type="text"
                    id="recipientAccount"
                    name="recipientAccount"
                    value={formData.recipientAccount}
                    onChange={(e) => {
                      const formatted = formatAccountNumberInput(e.target.value);
                      handleInputChange({ target: { name: 'recipientAccount', value: formatted } });
                    }}
                    onBlur={validateRecipient}
                    placeholder="XXX-XXXX-XXX-XXXX"
                    className="transfer-input"
                    maxLength="17"
                    autoComplete="off"
                  />
                  <span className="input-icon"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/><path d="M4.5 19.5a7.5 7.5 0 0115 0v.25a.25.25 0 01-.25.25h-14.5a.25.25 0 01-.25-.25V19.5z"/></svg></span>
                </div>
                {recipient && (
                  <div className="recipient-info">
                    <div className="recipient-avatar"><Check className="icon-md" /></div>
                    <div>
                      <p className="recipient-name">{recipient.name}</p>
                      <p className="recipient-details">{recipient.accountNumber} • {recipient.accountType}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Section */}
              <div className="form-section">
                <label className="form-label" htmlFor="amount">Amount</label>
                <div className="input-icon-group">
                  <span className="input-prefix">₱</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="transfer-input input-amount"
                    min="1"
                    step="0.01"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-section">
                <label className="form-label" htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="What's this transfer for?"
                  rows={3}
                  className="transfer-input textarea"
                  autoComplete="off"
                />
              </div>

              {/* Save as Beneficiary */}
              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="saveAsBeneficiary"
                  name="saveAsBeneficiary"
                  checked={formData.saveAsBeneficiary}
                  onChange={handleInputChange}
                  className="checkbox"
                />
                <label className="checkbox-label" htmlFor="saveAsBeneficiary">
                  Save as beneficiary for future transfers
                </label>
              </div>

              {formData.saveAsBeneficiary && (
                <div className="form-section">
                  <input
                    type="text"
                    name="beneficiaryNickname"
                    value={formData.beneficiaryNickname}
                    onChange={handleInputChange}
                    placeholder="e.g., John, Mom, Work Account"
                    className="transfer-input"
                    autoComplete="off"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={!recipient || !formData.amount}
                  className="btn-primary"
                >
                  <Send className="icon-lg" />
                  <span>Send Money</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      recipientAccount: '',
                      amount: '',
                      description: '',
                      saveAsBeneficiary: false,
                      beneficiaryNickname: ''
                    });
                    setRecipient(null);
                  }}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </form>
            <div className="transfer-sidebar">
              <div className="sidebar-tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab('beneficiaries')}
                  className={`sidebar-tab${activeTab === 'beneficiaries' ? ' active' : ''}`}
                >
                  Beneficiaries
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('recent')}
                  className={`sidebar-tab${activeTab === 'recent' ? ' active' : ''}`}
                >
                  Recent
                </button>
              </div>
              <div className="sidebar-content">
                {activeTab === 'beneficiaries' && (
                  <div>
                    <div className="sidebar-search">
                      <span className="sidebar-search-icon"><Search /></span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search beneficiaries..."
                        className="sidebar-search-input"
                      />
                    </div>
                    <div className="sidebar-list">
                      {filteredBeneficiaries.length === 0 ? (
                        <div className="sidebar-empty">
                          <span className="sidebar-empty-icon"><svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/><path d="M4.5 19.5a7.5 7.5 0 0115 0v.25a.25.25 0 01-.25.25h-14.5a.25.25 0 01-.25-.25V19.5z"/></svg></span>
                          <p>No beneficiaries found</p>
                        </div>
                      ) : (
                        filteredBeneficiaries.map((beneficiary) => (
                          <div
                            key={beneficiary.id}
                            onClick={() => selectBeneficiary(beneficiary)}
                            className="sidebar-list-item"
                          >
                            <div className="sidebar-list-item-main">
                              <div className="sidebar-avatar">{beneficiary.nickname.charAt(0)}</div>
                              <div>
                                <div className="sidebar-list-item-title">
                                  <span>{beneficiary.nickname}</span>
                                  {beneficiary.isFavorite && <StarFill className="sidebar-favorite" />}
                                </div>
                                <span className="sidebar-list-item-account">{beneficiary.accountNumber}</span>
                              </div>
                            </div>
                            <ArrowRight className="sidebar-list-arrow" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {activeTab === 'recent' && (
                  <div className="sidebar-list">
                    {recentTransfers.length === 0 ? (
                      <div className="sidebar-empty">
                        <span className="sidebar-empty-icon"><svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
                        <p>No recent transfers</p>
                      </div>
                    ) : (
                      recentTransfers.map((transfer) => (
                        <div key={transfer.id} className="sidebar-list-item">
                          <div className="sidebar-list-item-main">
                            <div>
                              <span className="sidebar-list-item-title">{transfer.recipientName}</span>
                              <span className="sidebar-list-item-account">{transfer.recipientAccount}</span>
                              <span className="sidebar-list-item-date">{transfer.date.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="sidebar-list-item-actions">
                            <span className="sidebar-list-item-amount">-₱{transfer.amount.toLocaleString()}</span>
                            <span className="sidebar-list-item-status completed">completed</span>
                            <button
                              type="button"
                              onClick={() => quickTransferFromRecent(transfer)}
                              className="sidebar-repeat-btn"
                            >
                              <Repeat className="icon-xs" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="transfer-modal-overlay">
          <div className="transfer-modal">
            <div className="modal-header">
              <div className="modal-icon"><Send className="icon-lg" /></div>
              <h3 className="modal-title">Confirm Transfer</h3>
              <p className="modal-subtitle">Please review your transfer details</p>
            </div>
            <div className="modal-details">
              <div className="modal-details-row">
                <span className="modal-details-label">To:</span>
                <div className="modal-details-value">
                  <span className="modal-details-name">{recipient?.name}</span>
                  <span className="modal-details-account">{formData.recipientAccount}</span>
                </div>
              </div>
              <div className="modal-details-row">
                <span className="modal-details-label">Amount:</span>
                <span className="modal-details-amount">₱{parseFloat(formData.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="modal-details-row">
                <span className="modal-details-label">Fee:</span>
                <span className="modal-details-fee">Free</span>
              </div>
              {formData.description && (
                <div className="modal-details-row">
                  <span className="modal-details-label">Note:</span>
                  <span className="modal-details-note">{formData.description}</span>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmTransfer}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <span className="modal-spinner"></span>
                ) : (
                  <Check className="icon-sm" />
                )}
                <span>{loading ? 'Processing...' : 'Confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default _userTransfer;