import React from 'react'
import { Eye, EyeSlash, PersonBadge, Person, X } from 'react-bootstrap-icons'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../services/user.Service.js'
import StaffService from '../services/staff.Service.js'
import '../styles/_login.css'

// Custom hook for login form logic
function useLoginForm(navigate) {
  const [formData, setFormData] = React.useState({ identifier: '', password: '' })
  const [rememberMe, setRememberMe] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [errors, setErrors] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState({ show: false, message: '', variant: '' })
  const [detectedType, setDetectedType] = React.useState(null)

  const detectAccountType = React.useCallback((identifier) => {
    const emailPattern = /\S+@\S+\.\S+/
    if (emailPattern.test(identifier)) return 'user'
    if (identifier.startsWith('STAFF_') || identifier.toLowerCase().includes('staff')) return 'staff'
    return null
  }, [])

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'identifier') setDetectedType(detectAccountType(value))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }, [detectAccountType, errors])

  const validateForm = React.useCallback(() => {
    const newErrors = {}
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or Staff ID is required'
    } else {
      const accountType = detectAccountType(formData.identifier)
      if (accountType === 'user' && !/\S+@\S+\.\S+/.test(formData.identifier)) {
        newErrors.identifier = 'Please enter a valid email address'
      } else if (accountType === 'staff' && !formData.identifier.startsWith('STAFF_')) {
        newErrors.identifier = 'Please enter a valid Staff ID (e.g., STAFF_3000)'
      } else if (!accountType) {
        newErrors.identifier = 'Please enter a valid email address or Staff ID (e.g., STAFF_3000)'
      }
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, detectAccountType])

  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      let loginResponse
      const accountType = detectAccountType(formData.identifier)
      if (accountType === 'staff') {
        const result = await StaffService.loginStaff(formData.identifier, formData.password)
        if (result.success) {
          loginResponse = result.data
          localStorage.setItem('staffId', loginResponse.staffId)
          localStorage.setItem('staffEmail', loginResponse.email)
          localStorage.setItem('staffDepartment', loginResponse.department)
          localStorage.setItem('staffFirstName', loginResponse.firstName)
          localStorage.setItem('staffLastName', loginResponse.lastName)
          localStorage.setItem('staffStringId', loginResponse.staffStringId)
          localStorage.setItem('accessToken', loginResponse.accessToken)
          setShowAlert({
            show: true,
            message: `Welcome ${loginResponse.firstName}! Redirecting to ${loginResponse.department} dashboard...`,
            variant: 'success'
          })
          setTimeout(() => {
            switch (loginResponse.department.toLowerCase()) {
              case 'admin':
                navigate('/admin/dashboard')
                break
              case 'finance':
                navigate('/finance/dashboard')
                break
              case 'loan':
                navigate('/loan/dashboard')
                break
              default:
                navigate('/admin/dashboard')
                break
            }
          }, 1500)
        } else {
          throw new Error(result.error)
        }
      } else if (accountType === 'user') {
        loginResponse = await UserService.loginUser(formData.identifier, formData.password)
        if (loginResponse.user && loginResponse.user.userId) {
          UserService.setUserData({ userId: loginResponse.user.userId, email: formData.identifier })
          localStorage.setItem('accessToken',loginResponse.accessToken)
          setShowAlert({
            show: true,
            message: 'Login successful! Redirecting to dashboard...',
            variant: 'success'
          })
          setTimeout(() => navigate('/user/dashboard'), 1500)
        } else {
          throw new Error('Login failed: Invalid response from server')
        }
      } else {
        throw new Error('Unable to determine account type. Please check your credentials.')
      }
      setFormData({ identifier: '', password: '' })
    } catch (error) {
      let errorMsg = error.message || 'Login failed. Please check your credentials.';
      if (errorMsg.toLowerCase().includes('invalid password')) {
        errorMsg = 'Incorrect Password';
      }
      setShowAlert({
        show: true,
        message: errorMsg,
        variant: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [formData, detectAccountType, navigate, validateForm])

  return {
    formData,
    setFormData,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    errors,
    isLoading,
    showAlert,
    setShowAlert,
    detectedType,
    handleChange,
    handleSubmit
  }
}

// Alert Component
function Alert({ show, variant, message, onClose }) {
  if (!show) return null
  return (
    <div className={`alert ${variant}`}>
      <span>{message}</span>
      <button
        type="button"
        className="alert-close"
        onClick={onClose}
        aria-label="Close alert"
      >
        <X size={18} />
      </button>
    </div>
  )
}

// Main Login Component
const Login = () => {
  const navigate = useNavigate()
  const {
    formData,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    errors,
    isLoading,
    showAlert,
    setShowAlert,
    detectedType,
    handleChange,
    handleSubmit
  } = useLoginForm(navigate)

  return (
    <div className="login-container">
      {/* Dynamic gradient background */}
      <div className="background">
        <div className="floating-elements">
          <div className="floating-blob blob-1"></div>
          <div className="floating-blob blob-2"></div>
          <div className="floating-blob blob-3"></div>
        </div>
        <div className="animated-grid">
          <div className="grid-pattern"></div>
        </div>
      </div>
      <div className="main-container">
        <div className="content-wrapper">
          <div className="grid-layout">
            {/* Left side - Branding */}
            <div className="branding-section">
              <div className="main-heading">
                <h2>
                  Banking
                  <br />
                  <span className="gradient-text">Reimagined</span>
                </h2>
                <p>
                  Experience the future of digital banking with our cutting-edge platform designed for the modern world.
                </p>
              </div>
              <div className="feature-cards">
                <div className="feature-card">
                  <span className="feature-icon shield"><span role="img" aria-label="shield">🛡️</span></span>
                  <div className="feature-number">256-bit</div>
                  <div className="feature-label">Encryption</div>
                </div>
                <div className="feature-card">
                  <span className="feature-icon zap"><span role="img" aria-label="zap">⚡</span></span>
                  <div className="feature-number">24/7</div>
                  <div className="feature-label">Support</div>
                </div>
                <div className="feature-card">
                  <span className="feature-icon users"><span role="img" aria-label="users">👥</span></span>
                  <div className="feature-number">10M+</div>
                  <div className="feature-label">Customers</div>
                </div>
              </div>
            </div>
            {/* Right side - Login form */}
            <div className="form-section">
              <div className="login-form">
                {/* Logo above the form header */}
                <img src="/Logo.png" alt="PNB Logo" className="login-logo" />
                <div className="form-header">
                  <div className="form-header-centered">
                    <h3>Welcome Back</h3>
                    <p>Access your account securely</p>
                    {/* Account type detection */}
                    {detectedType && (
                      <div className={`account-type-badge ${detectedType}`}>
                        {detectedType === 'staff' ? (
                          <><PersonBadge className="account-type-icon" size={16} /> Staff Account Detected</>
                        ) : (
                          <><Person className="account-type-icon" size={16} /> Customer Account Detected</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Alert */}
                <Alert
                  show={showAlert.show}
                  variant={showAlert.variant}
                  message={showAlert.message}
                  onClose={() => setShowAlert({ show: false, message: '', variant: '' })}
                />
                {/* Login form */}
                <form onSubmit={handleSubmit} className="form">
                  <div className="input-group">
                    <label className="input-label">
                      Email or Staff ID
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        placeholder="Enter your email or Staff ID"
                        className={`input ${errors.identifier
                            ? 'error'
                            : detectedType
                              ? detectedType === 'staff'
                                ? 'staff-detected'
                                : 'user-detected'
                              : ''
                          }`}
                      />
                      {errors.identifier && (
                        <p className="error-message">{errors.identifier}</p>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">
                      Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className={`input password-input ${errors.password ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                      {errors.password && (
                        <p className="error-message">{errors.password}</p>
                      )}
                    </div>
                  </div>
                  <div className="form-options">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="checkbox"
                      />
                      <span className="checkbox-label">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="forgot-password"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="submit-button"
                  >
                    {isLoading ? (
                      <div className="button-content">
                        <div className="loading-spinner"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                  <div className="signup-link">
                    <p>
                      Don't have an account?{' '}
                      <Link to="/register" className="signup-button">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
                <div className="form-footer">
                  <p>
                    © 2025 PNB Banking System. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login