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
  Tab
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
  Globe
} from 'react-bootstrap-icons';
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

  const renderEditableField = (field, label, value, type = 'text') => {
    const isEditing = editingField === field;
    
    return (
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <InputGroup>
          {isEditing ? (
            <>
              <Form.Control
                type={type}
                value={value}
                onChange={(e) => setProfileData(prev => ({ ...prev, [field]: e.target.value }))}
                className="glass-input"
                autoFocus
              />
              <Button 
                variant="outline-success" 
                onClick={() => handleProfileUpdate(field, value)}
                disabled={saving}
              >
                <Check size={16} />
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setEditingField(null);
                  loadUserData(); // Reset value
                }}
              >
                <X size={16} />
              </Button>
            </>
          ) : (
            <>
              <Form.Control
                type={type}
                value={value}
                readOnly
                className="glass-input"
              />
              <Button 
                variant="outline-primary" 
                onClick={() => setEditingField(field)}
              >
                <Pencil size={16} />
              </Button>
            </>
          )}
        </InputGroup>
      </Form.Group>
    );
  };

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
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <Gear size={32} className="text-primary me-3" />
            <div>
              <h2 className="mb-0">Account Settings</h2>
              <p className="text-muted mb-0">Manage your account preferences and security</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          {/* Profile Summary Card */}
          <Card className="glass-card mb-4">
            <Card.Body className="text-center">
              <PersonCircle size={80} className="text-primary mb-3" />
              <h5 className="mb-1">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.businessName || 'User'
                }
              </h5>
              <p className="text-muted mb-2">{user?.email}</p>
              <Badge bg="success" className="text-capitalize">
                {user?.accountType || 'Personal'} Account
              </Badge>
              <div className="mt-3">
                <small className="text-muted d-block">Account Number</small>
                <strong>{user?.accountNumber || 'N/A'}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Card className="glass-card">
            <Card.Body>
              <Tabs 
                activeKey={activeTab} 
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                {/* Profile Tab */}
                <Tab eventKey="profile" title={
                  <span><PersonCircle className="me-2" size={16} />Profile</span>
                }>
                  <Row>
                    <Col md={6}>
                      <h6 className="text-muted mb-3">Personal Information</h6>
                      {user?.accountType === 'personal' ? (
                        <>
                          {renderEditableField('firstName', 'First Name', profileData.firstName)}
                          {renderEditableField('lastName', 'Last Name', profileData.lastName)}
                        </>
                      ) : (
                        renderEditableField('businessName', 'Business Name', profileData.businessName)
                      )}
                      {renderEditableField('email', 'Email Address', profileData.email, 'email')}
                    </Col>
                    <Col md={6}>
                      <h6 className="text-muted mb-3">Contact Information</h6>
                      {renderEditableField('phone', 'Phone Number', profileData.phone, 'tel')}
                      {renderEditableField('address', 'Address', profileData.address)}
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Account Type</Form.Label>
                        <Form.Control
                          value={user?.accountType || 'Personal'}
                          readOnly
                          className="glass-input text-capitalize"
                        />
                        <Form.Text className="text-muted">
                          Contact support to change account type
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Security Tab */}
                <Tab eventKey="security" title={
                  <span><Shield className="me-2" size={16} />Security</span>
                }>
                  <h6 className="text-muted mb-3">Security Settings</h6>
                  
                  <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                    <div>
                      <h6 className="mb-1">Password</h6>
                      <small className="text-muted">Change your account password</small>
                    </div>
                    <Button variant="outline-primary" onClick={() => setShowPasswordModal(true)}>
                      <Lock className="me-2" size={16} />
                      Change Password
                    </Button>
                  </div>

                  <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                    <div>
                      <h6 className="mb-1">Two-Factor Authentication</h6>
                      <small className="text-muted">Add an extra layer of security</small>
                    </div>
                    <Form.Check
                      type="switch"
                      checked={securityData.twoFactorEnabled}
                      onChange={(e) => setSecurityData(prev => ({
                        ...prev,
                        twoFactorEnabled: e.target.checked
                      }))}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center p-3 border rounded text-danger">
                    <div>
                      <h6 className="mb-1 text-danger">Delete Account</h6>
                      <small className="text-muted">Permanently delete your account and all data</small>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </Tab>

                {/* Notifications Tab */}
                <Tab eventKey="notifications" title={
                  <span><Bell className="me-2" size={16} />Notifications</span>
                }>
                  <h6 className="text-muted mb-3">Notification Preferences</h6>
                  
                  <Row>
                    <Col md={6}>
                      <h6 className="mb-3">Communication</h6>
                      {Object.entries({
                        emailNotifications: 'Email Notifications',
                        smsNotifications: 'SMS Notifications',
                        pushNotifications: 'Push Notifications'
                      }).map(([key, label]) => (
                        <div key={key} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                          <span>{label}</span>
                          <Form.Check
                            type="switch"
                            checked={notificationSettings[key]}
                            onChange={() => handleNotificationToggle(key)}
                          />
                        </div>
                      ))}
                    </Col>
                    <Col md={6}>
                      <h6 className="mb-3">Alerts</h6>
                      {Object.entries({
                        transactionAlerts: 'Transaction Alerts',
                        securityAlerts: 'Security Alerts',
                        marketingEmails: 'Marketing Emails'
                      }).map(([key, label]) => (
                        <div key={key} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                          <span>{label}</span>
                          <Form.Check
                            type="switch"
                            checked={notificationSettings[key]}
                            onChange={() => handleNotificationToggle(key)}
                          />
                        </div>
                      ))}
                    </Col>
                  </Row>
                </Tab>

                {/* Preferences Tab */}
                <Tab eventKey="preferences" title={
                  <span><Globe className="me-2" size={16} />Preferences</span>
                }>
                  <h6 className="text-muted mb-3">Application Preferences</h6>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Language</Form.Label>
                        <Form.Select
                          value={preferences.language}
                          onChange={(e) => handlePreferenceChange('language', e.target.value)}
                          className="glass-input"
                        >
                          <option value="en">English</option>
                          <option value="fil">Filipino</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Currency</Form.Label>
                        <Form.Select
                          value={preferences.currency}
                          onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                          className="glass-input"
                        >
                          <option value="PHP">Philippine Peso (₱)</option>
                          <option value="USD">US Dollar ($)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Timezone</Form.Label>
                        <Form.Select
                          value={preferences.timezone}
                          onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                          className="glass-input"
                        >
                          <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                          <option value="UTC">UTC (GMT+0)</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Theme</Form.Label>
                        <Form.Select
                          value={preferences.theme}
                          onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                          className="glass-input"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordChange}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
                className="glass-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                className="glass-input"
                minLength="8"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
                className="glass-input"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <p>Are you sure you want to delete your account?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger">
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default _userSettings;