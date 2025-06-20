import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

export default function PNBLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
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
        <div className="pnb-login-card">
          {/* PNB Logo */}
          <div className="pnb-logo-section">
            <div className="pnb-logo-text">
             <img src="./src/assets/pnb.png" alt="" />
            </div>
          </div>

          <h2 className="pnb-login-title">Log in</h2>

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
                />
              </div>
            </div>

            {/* Password Field */}
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
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="pnb-eye-button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="pnb-forgot-password">
                <button className="pnb-forgot-link">Forgot password?</button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleClick}
              className="pnb-login-button"
            >
              Log in
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

            {/* Google Login */}
            <button
              onClick={() => console.log('Google login clicked')}
              className="pnb-google-button"
            >
              <svg className="pnb-google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="pnb-google-text">Log in using Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
