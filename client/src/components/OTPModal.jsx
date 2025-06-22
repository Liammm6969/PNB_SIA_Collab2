import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, AlertCircle, Loader, RotateCcw } from 'lucide-react';
import '../styles/OTPModal.css';

export default function OTPModal({ isOpen, onClose, email, onVerifyOTP, onResendOTP }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setCountdown(30); 
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; 
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onVerifyOTP(email, otpString);
    } catch (error) {
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      await onResendOTP(email);
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal">
        <div className="otp-modal-header">
          <h2>Verify Your Email</h2>
          <button onClick={onClose} className="otp-modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="otp-modal-content">
          <div className="otp-icon">
            <Mail size={48} />
          </div>

          <p className="otp-description">
            We've sent a 6-digit verification code to
          </p>
          <p className="otp-email">{email}</p>

          {error && (
            <div className="otp-error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="otp-input-container">
            <label className="otp-label">Enter verification code</label>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="otp-input"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="otp-verify-button"
          >
            {loading ? (
              <>
                <Loader className="otp-loader" size={20} />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>

          <div className="otp-resend-section">
            <p>Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resendLoading || countdown > 0}
              className="otp-resend-button"
            >
              {resendLoading ? (
                <>
                  <Loader className="otp-loader" size={16} />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                <>
                  <RotateCcw size={16} />
                  Resend Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 