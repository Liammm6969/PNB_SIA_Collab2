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
  InputGroup,
  Tabs,
  Tab,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  PersonCircle,
  Shield,
  Bell,
  CreditCard,
  Eye,
  EyeSlash,
  Pencil,
  Check,
  X,
  Gear,
  Lock,
  Phone,
  Envelope,
  Globe,
  QuestionCircle,
  CheckCircleFill,
  InfoCircle,
  ShieldLock,
  BellFill,
  PaletteFill,
  CloudArrowUp,
  ThreeDots,
  ClockHistory,
  ArrowClockwise,
  ExclamationTriangleFill,
  PersonBadge,
  GearFill,
  FileEarmarkText
} from 'react-bootstrap-icons';
import '../../styles/UserSettings.css';
import UserService from '../../services/user.Service';

const _userSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    businessName: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'PHP',
    timezone: 'Asia/Manila',
    theme: 'light'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = UserService.getUserData();
      
      if (!userData.userId) {
        setError('User not authenticated');
        return;
      }

      const userProfile = await UserService.getUserProfile(userData.userId);
      const userInfo = userProfile.user || userProfile;
      setUser(userInfo);

      // Set profile data
      setProfileData({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        businessName: userInfo.businessName || ''
      });

      // Mock settings data
      setNotificationSettings({
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        transactionAlerts: true,
        securityAlerts: true,
        marketingEmails: false
      });

      setPreferences({
        language: 'en',
        currency: 'PHP',
        timezone: 'Asia/Manila',
        theme: 'light'
      });

    } catch (err) {
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (field, value) => {
    try {
      setSaving(true);
      setError('');

      // Mock update - replace with actual API call
      setProfileData(prev => ({ ...prev, [field]: value }));
      setEditingField(null);
      setSuccess('Profile updated successfully');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (securityData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Mock password change - replace with actual API call
      setSuccess('Password changed successfully');
      setShowPasswordModal(false);
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: securityData.twoFactorEnabled
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = async (setting) => {
    try {
      setNotificationSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
      
      // Mock update - replace with actual API call
      setSuccess('Notification settings updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update notification settings');
    }
  };

  const handlePreferenceChange = async (setting, value) => {
    try {
      setPreferences(prev => ({
        ...prev,
        [setting]: value
      }));
      
      // Mock update - replace with actual API call
      setSuccess('Preferences updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update preferences');
    }
  };

  // Original renderEditableField function replaced with the enhanced version below

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-2" style={{ color: '#0e2554', width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-muted">Loading your settings...</p>
        </div>
      </Container>
    );
  }

  const renderEditableField = (field, label, value, type = 'text', icon) => {
    const isEditing = editingField === field;
    
    return (
      <Form.Group className="mb-4">
        <Form.Label className="settings-form-label d-flex align-items-center">
          {icon && <span className="me-2">{icon}</span>}
          {label}
        </Form.Label>
        <InputGroup className="settings-input-group">
          {isEditing ? (
            <>
              <Form.Control
                type={type}
                value={value}
                onChange={(e) => setProfileData(prev => ({ ...prev, [field]: e.target.value }))}
                className={`settings-form-control editable-field-active`}
                autoFocus
              />
              <Button 
                variant="success" 
                onClick={() => handleProfileUpdate(field, profileData[field])}
                disabled={saving}
                className="d-flex align-items-center justify-content-center"
              >
                {saving ? <Spinner size="sm" /> : <Check size={18} />}
              </Button>
              <Button 
                variant="light" 
                onClick={() => {
                  setEditingField(null);
                  loadUserData(); // Reset value
                }}
                className="d-flex align-items-center justify-content-center"
              >
                <X size={18} />
              </Button>
            </>
          ) : (
            <>
              <Form.Control
                type={type}
                value={value}
                readOnly
                className="settings-form-control"
              />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Edit {label.toLowerCase()}</Tooltip>}
              >
                <Button 
                  variant="outline-primary" 
                  onClick={() => setEditingField(field)}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Pencil size={16} />
                </Button>
              </OverlayTrigger>
            </>
          )}
        </InputGroup>
      </Form.Group>
    );
  };

  return (
    <Container fluid className="settings-container animate-fade-in">
      {error && (
        <Alert variant="danger" className="mb-4 d-flex align-items-center">
          <ExclamationTriangleFill className="me-2" />
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4 d-flex align-items-center">
          <CheckCircleFill className="me-2" />
          {success}
        </Alert>
      )}

      {/* Header */}
      <Row className="settings-header">
        <Col>
          <div className="d-flex align-items-center">
            <div className="icon-circle">
              <GearFill size={22} />
            </div>
            <div>
              <h2 className="settings-title">Account Settings</h2>
              <p className="text-muted mb-0">Manage your profile, security, and preferences</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          {/* Profile Summary Card */}
          <Card className="user-profile-card mb-4">
            <Card.Body className="text-center">
              <div className="user-avatar">
                <PersonCircle size={60} />
              </div>
              <h4 className="mb-2 fw-bold">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.businessName || 'User'
                }
              </h4>
              <p className="text-white-50 mb-3">{user?.email}</p>
              
              <div className="user-account-type d-inline-block">
                <div className="d-flex align-items-center">
                  <PersonBadge size={16} className="me-2" />
                  <span className="text-capitalize">{user?.accountType || 'Personal'} Account</span>
                </div>
              </div>
              
              <div className="user-account-number">
                <small className="d-block text-white-50 mb-1">Account Number</small>
                <h5 className="mb-0">{user?.accountNumber || 'N/A'}</h5>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="settings-card mb-4">
            <Card.Body>
              <h6 className="section-title">
                <ClockHistory />
                Recent Activity
              </h6>
              <div className="d-flex align-items-center mb-2 pb-2 border-bottom">
                <div className="me-3">
                  <Badge bg="info" pill className="p-2">
                    <ArrowClockwise size={16} />
                  </Badge>
                </div>
                <div>
                  <small className="d-block">Password changed</small>
                  <small className="text-muted">2 days ago</small>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <Badge bg="success" pill className="p-2">
                    <CloudArrowUp size={16} />
                  </Badge>
                </div>
                <div>
                  <small className="d-block">Profile updated</small>
                  <small className="text-muted">5 days ago</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="settings-card">
            <Card.Body className="p-0">
              <Tabs 
                activeKey={activeTab} 
                onSelect={(k) => setActiveTab(k)}
                className="settings-tabs"
              >
                {/* Profile Tab */}
                <Tab eventKey="profile" title={
                  <span><PersonCircle className="me-2" size={16} />Profile</span>
                }>
                  <div className="p-4">
                    <Card className="settings-card mb-4">
                      <Card.Body>
                        <h5 className="section-title">
                          <PersonCircle />
                          Personal Information
                        </h5>
                        <Row>
                          {user?.accountType === 'personal' ? (
                            <>
                              <Col md={6}>
                                {renderEditableField('firstName', 'First Name', profileData.firstName, 'text', <PersonCircle size={16} />)}
                              </Col>
                              <Col md={6}>
                                {renderEditableField('lastName', 'Last Name', profileData.lastName, 'text', <PersonCircle size={16} />)}
                              </Col>
                            </>
                          ) : (
                            <Col md={12}>
                              {renderEditableField('businessName', 'Business Name', profileData.businessName, 'text', <CreditCard size={16} />)}
                            </Col>
                          )}
                        </Row>
                      </Card.Body>
                    </Card>

                    <Card className="settings-card">
                      <Card.Body>
                        <h5 className="section-title">
                          <Envelope />
                          Contact Information
                        </h5>
                        <Row>
                          <Col md={6}>
                            {renderEditableField('email', 'Email Address', profileData.email, 'email', <Envelope size={16} />)}
                          </Col>
                          <Col md={6}>
                            {renderEditableField('phone', 'Phone Number', profileData.phone, 'tel', <Phone size={16} />)}
                          </Col>
                          <Col md={12}>
                            {renderEditableField('address', 'Address', profileData.address, 'text', <Globe size={16} />)}
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label className="settings-form-label d-flex align-items-center">
                            <CreditCard size={16} className="me-2" />
                            Account Type
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              value={user?.accountType || 'Personal'}
                              readOnly
                              className="settings-form-control text-capitalize"
                            />
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Contact support to change account type</Tooltip>}
                            >
                              <div className="ms-2">
                                <InfoCircle />
                              </div>
                            </OverlayTrigger>
                          </div>
                          <Form.Text className="text-muted">
                            Account type changes require support assistance
                          </Form.Text>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </div>
                </Tab>

                {/* Security Tab */}
                <Tab eventKey="security" title={
                  <span><ShieldLock className="me-2" size={16} />Security</span>
                }>
                  <div className="p-4">
                    <Card className="settings-card mb-4">
                      <Card.Body>
                        <h5 className="section-title">
                          <ShieldLock />
                          Account Security
                        </h5>
                        
                        <div className="settings-switch-item">
                          <div>
                            <h6 className="settings-switch-label">Password Management</h6>
                            <p className="settings-switch-description">Change your account password regularly</p>
                          </div>
                          <Button 
                            variant="primary" 
                            className="settings-btn-primary"
                            onClick={() => setShowPasswordModal(true)}
                          >
                            <Lock className="me-2" size={16} />
                            Change Password
                          </Button>
                        </div>

                        <div className="settings-switch-item">
                          <div>
                            <h6 className="settings-switch-label">Two-Factor Authentication</h6>
                            <p className="settings-switch-description">Add an extra layer of security to your account</p>
                          </div>
                          <Form.Check
                            type="switch"
                            id="two-factor-switch"
                            checked={securityData.twoFactorEnabled}
                            onChange={(e) => setSecurityData(prev => ({
                              ...prev,
                              twoFactorEnabled: e.target.checked
                            }))}
                            className="fs-4"
                          />
                        </div>
                      </Card.Body>
                    </Card>

                    <Card className="settings-card">
                      <Card.Body>
                        <h5 className="section-title text-danger">
                          <ExclamationTriangleFill />
                          Danger Zone
                        </h5>
                        
                        <div className="settings-switch-item border border-danger-subtle">
                          <div>
                            <h6 className="settings-switch-label text-danger">Delete Account</h6>
                            <p className="settings-switch-description">Permanently delete your account and all data</p>
                          </div>
                          <Button 
                            variant="outline-danger" 
                            className="settings-btn-outline-danger"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            Delete Account
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Tab>

                {/* Notifications Tab */}
                <Tab eventKey="notifications" title={
                  <span><BellFill className="me-2" size={16} />Notifications</span>
                }>
                  <div className="p-4">
                    <Card className="settings-card">
                      <Card.Body>
                        <h5 className="section-title">
                          <BellFill />
                          Notification Preferences
                        </h5>
                        
                        <Row>
                          <Col lg={6}>
                            <h6 className="mb-3 text-muted">Communication Channels</h6>
                            
                            {Object.entries({
                              emailNotifications: {
                                label: 'Email Notifications',
                                icon: <Envelope size={16} className="me-2" />,
                                description: 'Receive updates via email'
                              },
                              smsNotifications: {
                                label: 'SMS Notifications', 
                                icon: <Phone size={16} className="me-2" />,
                                description: 'Get text alerts to your phone'
                              },
                              pushNotifications: {
                                label: 'Push Notifications',
                                icon: <Bell size={16} className="me-2" />,
                                description: 'Receive alerts in your browser'
                              }
                            }).map(([key, info]) => (
                              <div key={key} className="settings-switch-item">
                                <div>
                                  <h6 className="settings-switch-label d-flex align-items-center">
                                    {info.icon}
                                    {info.label}
                                  </h6>
                                  <p className="settings-switch-description">{info.description}</p>
                                </div>
                                <Form.Check
                                  type="switch"
                                  id={`switch-${key}`}
                                  checked={notificationSettings[key]}
                                  onChange={() => handleNotificationToggle(key)}
                                  className="fs-4"
                                />
                              </div>
                            ))}
                          </Col>
                          
                          <Col lg={6}>
                            <h6 className="mb-3 text-muted">Alert Types</h6>
                            
                            {Object.entries({
                              transactionAlerts: {
                                label: 'Transaction Alerts',
                                icon: <CreditCard size={16} className="me-2" />,
                                description: 'Get notified about account activities'
                              },
                              securityAlerts: {
                                label: 'Security Alerts',
                                icon: <ShieldLock size={16} className="me-2" />,
                                description: 'Important security notifications'
                              },
                              marketingEmails: {
                                label: 'Marketing Communications',
                                icon: <FileEarmarkText size={16} className="me-2" />,
                                description: 'Receive news and special offers'
                              }
                            }).map(([key, info]) => (
                              <div key={key} className="settings-switch-item">
                                <div>
                                  <h6 className="settings-switch-label d-flex align-items-center">
                                    {info.icon}
                                    {info.label}
                                  </h6>
                                  <p className="settings-switch-description">{info.description}</p>
                                </div>
                                <Form.Check
                                  type="switch"
                                  id={`switch-${key}`}
                                  checked={notificationSettings[key]}
                                  onChange={() => handleNotificationToggle(key)}
                                  className="fs-4"
                                />
                              </div>
                            ))}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </div>
                </Tab>

                {/* Preferences Tab */}
                <Tab eventKey="preferences" title={
                  <span><PaletteFill className="me-2" size={16} />Preferences</span>
                }>
                  <div className="p-4">
                    <Card className="settings-card">
                      <Card.Body>
                        <h5 className="section-title">
                          <PaletteFill />
                          Application Settings
                        </h5>
                        
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="settings-form-label d-flex align-items-center">
                                <Globe size={16} className="me-2" />
                                Language
                              </Form.Label>
                              <Form.Select
                                value={preferences.language}
                                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                className="settings-form-control"
                              >
                                <option value="en">English</option>
                                <option value="fil">Filipino</option>
                              </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label className="settings-form-label d-flex align-items-center">
                                <CreditCard size={16} className="me-2" />
                                Currency
                              </Form.Label>
                              <Form.Select
                                value={preferences.currency}
                                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                                className="settings-form-control"
                              >
                                <option value="PHP">Philippine Peso (₱)</option>
                                <option value="USD">US Dollar ($)</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="settings-form-label d-flex align-items-center">
                                <ClockHistory size={16} className="me-2" />
                                Timezone
                              </Form.Label>
                              <Form.Select
                                value={preferences.timezone}
                                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                                className="settings-form-control"
                              >
                                <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                                <option value="UTC">UTC (GMT+0)</option>
                              </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label className="settings-form-label d-flex align-items-center">
                                <PaletteFill size={16} className="me-2" />
                                Theme
                              </Form.Label>
                              <Form.Select
                                value={preferences.theme}
                                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                                className="settings-form-control"
                              >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto (System Default)</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Password Change Modal */}
      <Modal 
        show={showPasswordModal} 
        onHide={() => setShowPasswordModal(false)} 
        centered
        className="settings-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Lock className="me-2 text-primary" />
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordChange}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="settings-form-label">Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  className="settings-form-control"
                  required
                />
              </InputGroup>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="settings-form-label">New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  className="settings-form-control"
                  minLength="8"
                  required
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Password must be at least 8 characters long
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="settings-form-label">Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={(e) => setSecurityData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  className="settings-form-control"
                  required
                />
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowPasswordModal(false)}
              className="settings-btn-outline"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={saving}
              className="settings-btn-primary"
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        className="settings-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger d-flex align-items-center">
            <ExclamationTriangleFill className="me-2" />
            Delete Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <ExclamationTriangleFill className="me-2" />
            <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <p className="mb-0">Are you sure you want to delete your account? This will immediately log you out and remove all your personal information from our system.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDeleteModal(false)}
            className="settings-btn-outline"
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            className="settings-btn-primary"
            style={{background: 'linear-gradient(135deg, #dc3545 0%, #b02a37 100%)'}}
          >
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default _userSettings;