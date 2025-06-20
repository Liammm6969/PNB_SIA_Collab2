import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader, Map, Calendar } from 'lucide-react';
import '../styles/SignUp.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUser } from '../services/users.Service';

export default function SignUp() {
  const location = useLocation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('personal'); // Default to personal
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get account type from navigation state if available
    if (location.state && location.state.accountType) {
      setAccountType(location.state.accountType);
    }
  }, [location]);
  const validateForm = () => {
    if (accountType === 'personal') {
      if (!firstName.trim()) {
        setError('First name is required');
        return false;
      }
      if (!lastName.trim()) {
        setError('Last name is required');
        return false;
      }
      if (!dateOfBirth) {
        setError('Date of birth is required');
        return false;
      }
    } else if (accountType === 'business') {
      if (!companyName.trim()) {
        setError('Company name is required');
        return false;
      }
    }
    
    if (!address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };
  const handleSignUp = async () => {
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      let userData;
      
      if (accountType === 'personal') {
        userData = {
          fullName: `${firstName} ${lastName}`,
          email,
          password,
          address,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
          accountType: 'personal',
        };
      } else if (accountType === 'business') {
        userData = {
          companyName,
          email,
          password,
          address,
          accountType: 'business',
        };
      }
      
      await createUser(userData);
      
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="pnb-container">
      <div className="pnb-main-wrapper">
        {/* Form Side */}        <div className="pnb-signup-card">
          {/* PNB Logo */}
          <div className="pnb-logo-section">
            <div className="pnb-logo-text">
              <img src="/src/assets/pnb.png" alt="PNB Logo" />
            </div>
          </div>

          <h2 className="pnb-signup-title">Sign up{accountType === 'business' && ' - Business Account'}</h2>
          
          {error && (
            <div className="pnb-error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}          <div className="pnb-form-container">
            {accountType === 'personal' ? (
              <>
                {/* Name Fields - Row */}
                <div className="pnb-name-row">
                  {/* First Name Field */}
                  <div className="pnb-field-group">
                    <label className="pnb-label">First Name</label>
                    <div className="pnb-input-wrapper">
                      <input
                        type="text"
                        className="pnb-input"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                      />
                    </div>
                  </div>

                  {/* Last Name Field */}
                  <div className="pnb-field-group">
                    <label className="pnb-label">Last Name</label>
                    <div className="pnb-input-wrapper">
                      <input
                        type="text"
                        className="pnb-input"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ paddingLeft: '12px' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Address Field */}
                <div className="pnb-field-group">
                  <label className="pnb-label">Address</label>
                  <div className="pnb-input-wrapper">
                    <Map size={16} className="pnb-input-icon" />
                    <input
                      type="text"
                      className="pnb-input"
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Date of birth Field */}
                <div className="pnb-field-group">
                  <label className="pnb-label">Date of birth</label>
                  <div className="pnb-input-wrapper">
                    <Calendar size={16} className="pnb-input-icon" />
                    <input
                      type="date"
                      className="pnb-input"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Company Name Field */}
                <div className="pnb-field-group">
                  <label className="pnb-label">Company Name</label>
                  <div className="pnb-input-wrapper">
                    <input
                      type="text"
                      className="pnb-input"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      style={{ paddingLeft: '12px' }}
                    />
                  </div>
                </div>
                
                {/* Address Field */}
                <div className="pnb-field-group">
                  <label className="pnb-label">Address</label>
                  <div className="pnb-input-wrapper">
                    <Map size={16} className="pnb-input-icon" />
                    <input
                      type="text"
                      className="pnb-input"
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Email Field */}
            <div className="pnb-field-group">
              <label className="pnb-label">Email</label>
              <div className="pnb-input-wrapper">
                <Mail size={16} className="pnb-input-icon" />
                <input
                  type="email"
                  className="pnb-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="pnb-field-group">
              <label className="pnb-label">Password</label>
              <div className="pnb-input-wrapper">
                <Lock size={16} className="pnb-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="pnb-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="pnb-eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {/* Confirm Password Field */}
            <div className="pnb-field-group">
              <label className="pnb-label">Confirm Password</label>
              <div className="pnb-input-wrapper">
                <Lock size={16} className="pnb-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="pnb-input"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="pnb-eye-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>            {/* Sign Up Button */}
            <button
              className="pnb-login-button"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="pnb-loader" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                'Log in'
              )}
            </button>
            
            {/* Or Divider */}
            <div className="pnb-divider-container">
              <div className="pnb-divider-text">or</div>
            </div>
            
            {/* Already have account */}
            <div className="pnb-signup-section">
              Already have an account?{' '}
              <button className="pnb-signup-link" onClick={() => navigate('/')}>
                Sign in
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Welcome Text */}
        <div className="pnb-right-section">
          <h1 className="pnb-welcome-title">
            Hello,<br />
            Welcome!
          </h1>
          <h2 className="pnb-success-title">
            Your success<br />
            is our promise
          </h2>
          <p className="pnb-subtitle">
            PNB crafts every service around your needs<br />
            and future vision.
          </p>
        </div>
      </div>
    </div>
  );
}
