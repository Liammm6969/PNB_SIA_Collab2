import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Settings,
  User,
  CreditCard,
  ArrowRightLeft,
  BarChart3,
  Edit,
  Plus,
  Eye,
  EyeOff,
  Shield,
  Wallet,
  Building
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import '../styles/MyAccount.css';
import Header from '../components/Header';
import { getUserById, updateUser } from '../services/users.Service';

export default function MyAccount() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCardEnlarged, setIsCardEnlarged] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    dateOfBirth: '',
    gender: 'Male'
  });
  const navigate = useNavigate();
  const enlargedCardRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('pnb-token');
    const storedUser = localStorage.getItem('pnb-user');

    if (!token || !storedUser) {
      navigate('/');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUserData(parsedUser);
    setFormData({
      fullName: parsedUser.fullName || '',
      address: parsedUser.address || '',
      dateOfBirth: parsedUser.dateOfBirth ? new Date(parsedUser.dateOfBirth).toISOString().split('T')[0] : '',
      gender: parsedUser.gender || 'Male'
    });

    const userId = parsedUser._id;

    const fetchUser = async () => {
      try {
        const freshUser = await getUserById(userId);
        setUserData(freshUser);
        setFormData({
          fullName: freshUser.fullName || '',
          address: freshUser.address || '',
          dateOfBirth: freshUser.dateOfBirth ? new Date(freshUser.dateOfBirth).toISOString().split('T')[0] : '',
          gender: freshUser.gender || 'Male'
        });
      } catch (error) {
        console.error('Failed to fetch latest user data:', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setEditMode(false);
    try {
      await updateUser(userData._id, formData);
      setUserData(prev => ({ ...prev, ...formData }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  };

  const handleCardMouseMove = (e) => {
    const card = enlargedCardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 10;
    const rotateY = ((x - width / 2) / (width / 2)) * 10;

    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleCardMouseLeave = () => {
    const card = enlargedCardRef.current;
    if (!card) return;
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  };

  return (
    <div className="account-page-container">
      <Sidebar />

      <div className="account-main-content">
        <Header userData={userData} />

        <main className="account-content-area">
          <div className="content-grid">
            <div className="content-col-left">
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-info">
                    <div>
                      <h2 className="profile-name">{formData.fullName}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`edit-profile-btn ${editMode ? 'edit-mode-active' : ''}`}
                  >
                    <Edit size={16} />
                    <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>

                <div className="profile-card-body">
                  <div className="form-grid">
                    <div className="form-group-full">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        disabled={!editMode}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group-full">
                      <label className="form-label">Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!editMode}
                        rows="3"
                        className="form-textarea"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={!editMode}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        disabled={!editMode}
                        className="form-select"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {editMode && (
                    <div className="form-actions">
                      <button onClick={handleSave} className="form-btn-save">
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="withdrawal-methods-card">
                <div className="withdrawal-header">
                  <h3 className="withdrawal-title">Saved Withdrawal Methods</h3>
                  <button className="add-method-btn">
                    <Plus size={16} />
                    <span>Add Method</span>
                  </button>
                </div>
                <div className="methods-list">
                  {userData?.withdrawalMethods && userData.withdrawalMethods.length > 0 ? (
                    userData.withdrawalMethods.map((method, index) => (
                      <div className="method-item" key={index}>
                        <div>
                          <p>{method.type} - PHP</p>
                          <span>Local | **** **** **** {method.cardNumber.slice(-4)}</span>
                        </div>
                        <button><Edit size={20} /></button>
                      </div>
                    ))
                  ) : (
                    <p>No saved withdrawal methods found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="content-col-right">
              <div className="bank-card" onClick={() => setIsCardEnlarged(true)}>
                <div className="bank-card-header">
                  <img src={'/src/assets/pnb.png'} alt="PNB" className="bank-card-logo" />
                  <div className="bank-card-currency">
                    <span>USD</span>
                    <span className="active">PHP</span>
                    <span>EUR</span>
                  </div>
                </div>
                <div className="bank-card-number-container">
                  <p className="bank-card-number">
                    {userData?.accountNumber
                      ? userData.accountNumber.replace(/-/g, ' ')
                      : 'XXXX XXXX XXXX XXXX'}
                  </p>
                </div>
                <div>
                  <p className="bank-card-name">{formData.fullName}</p>
                </div>
              </div>

              <div className="quick-actions-card">
                <h3 className="quick-actions-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                  <button className="quick-action-btn">
                    <ArrowRightLeft className="quick-action-icon" />
                    <span>Transfer</span>
                  </button>
                  <button className="quick-action-btn">
                    <CreditCard className="quick-action-icon" />
                    <span>Pay Bills</span>
                  </button>
                </div>
                <button className="view-statement-btn">
                  <Building className="statement-icon" />
                  <span>View Statement</span>
                </button>
              </div>

              <div className="summary-card">
                <h3 className="summary-title">Account Summary</h3>
                <div className="summary-list">
                  <div className="summary-item">
                    <span>Available Balance</span>
                    <span className="summary-amount-balance">₱{userData?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                  </div>
                  <div className="summary-item">
                    <span>Pending Transactions</span>
                    <span className="summary-amount-pending">₱2,350.00</span>
                  </div>
                  <div className="summary-item">
                    <span>Credit Limit</span>
                    <span className="summary-amount-limit">₱50,000.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isCardEnlarged && (
        <div
          className="card-modal-overlay"
          onClick={() => setIsCardEnlarged(false)}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="enlarged-bank-card" ref={enlargedCardRef} onClick={(e) => e.stopPropagation()}>
            <div className="bank-card-header">
              <img src={'/src/assets/pnb.png'} alt="PNB" className="bank-card-logo" />
              <div className="bank-card-currency">
                <span>USD</span>
                <span className="active">PHP</span>
                <span>EUR</span>
              </div>
            </div>
            <div className="bank-card-number-container">
              <p className="bank-card-number">
                {userData?.accountNumber
                  ? userData.accountNumber.replace(/-/g, ' ')
                  : 'XXXX XXXX XXXX XXXX'}
              </p>
            </div>
            <div>
              <p className="bank-card-name">{formData.fullName}</p>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-notification">
          <span>✓</span>
          <span className="success-text">Profile updated successfully!</span>
        </div>
      )}
    </div>
  );
}
