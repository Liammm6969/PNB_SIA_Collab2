import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/users.Service';

export default function PNBLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored email in local storage
    const savedEmail = localStorage.getItem('pnb-remembered-email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    return true;
  };
  const handleClick = async () => {
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    // Remember email if checked
    if (rememberMe) {
      localStorage.setItem('pnb-remembered-email', email);
    } else {
      localStorage.removeItem('pnb-remembered-email');
    }
    try {
      const response = await loginUser(email, password);

      // Store user data in localStorage for persistence across sessions
      localStorage.setItem('pnb-user', JSON.stringify(response.user));

      setLoading(false);
      navigate('/home');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Invalid email or password');
    }
  };
  return (
    <div className="pnb-container">
      <div className="pnb-main-wrapper">
        {/* Left Side - Welcome Text */}
        <div className="pnb-left-section">
          <h1 className="pnb-welcome-title">
            Welcome<br />
            Back!
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

        {/* Right Side - Login Form */}
        <div className="pnb-login-card">          {/* PNB Logo */}          <div className="pnb-logo-section">
          <div className="pnb-logo-text">
            <img src="/src/assets/pnb.png" alt="PNB Logo" />
          </div>
        </div>

          <h2 className="pnb-login-title">Welcome Back</h2>

          {error && (
            <div className="pnb-error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="pnb-form-container">
            {/* Email Field */}
            <div className="pnb-field-group">
              <label className="pnb-label">Email</label>
              <div className="pnb-input-wrapper">
                <Mail className="pnb-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pnb-input"
                  style={{ color: 'black' }}
                />
              </div>
            </div>            {/* Password Field */}
            <div className="pnb-field-group">
              <label className="pnb-label">Password</label>
              <div className="pnb-input-wrapper">
                <Lock className="pnb-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pnb-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
                  style={{ color: 'black' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pnb-eye-button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="pnb-password-options">
                <div className="pnb-remember-me">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me">Remember me</label>
                </div>
                <div className="pnb-forgot-password">
                  <button type="button" className="pnb-forgot-link">Forgot password?</button>
                </div>
              </div>
            </div>            {/* Login Button */}
            <button
              onClick={handleClick}
              disabled={loading}
              className="pnb-login-button"
            >
              {loading ? (
                <>
                  <Loader className="pnb-loader" size={20} />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="pnb-signup-section">
              Don't have an account?{' '}
              <button className="pnb-signup-link">Sign up</button>
            </div>

            {/* Divider */}
            <div className="pnb-divider">
              <div className="pnb-divider-line">
                <div className="pnb-divider-border"></div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
}
