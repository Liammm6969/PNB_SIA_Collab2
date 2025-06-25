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
        if (loginResponse.userId) {
          UserService.setUserData({ userId: loginResponse.userId, email: formData.identifier })
        }
        setShowAlert({
          show: true,
          message: 'Login successful! Redirecting to dashboard...',
          variant: 'success'
        })
        setTimeout(() => navigate('/user/dashboard'), 1500)
      } else {
        throw new Error('Unable to determine account type. Please check your credentials.')
      }
      setFormData({ identifier: '', password: '' })
    } catch (error) {
      setShowAlert({
        show: true,
        message: error.message || 'Login failed. Please check your credentials.',
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

// Form Input Component
function FormInput({ label, name, type = 'text', placeholder, value, onChange, error, className, ...rest }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${className || ''} ${error ? 'error' : ''}`}
        {...rest}
      />
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}
    </div>
  )
}

// Password Input Component
function PasswordInput({ label, name, placeholder, value, onChange, error, show, onToggle }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <div className="password-input-group">
        <input
          id={name}
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${error ? 'error' : ''}`}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeSlash size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}
    </div>
  )
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Banner Section */}
          <div className="banner-section">
            <div className="banner-pattern"></div>
            <div className="banner-content">
              <img 
                src="/Logo.png" 
                alt="PNB Logo" 
                className="banner-logo"
              />
              <h1 className="banner-title">Welcome to PNB</h1>
              <h2 className="banner-subtitle">Banking System</h2>
              <p className="banner-description">
                Secure, reliable, and modern banking solutions for your financial needs.
              </p>
              <div className="banner-features">
                <div className="banner-feature">
                  <div className="banner-feature-value">24/7</div>
                  <div className="banner-feature-label">Support</div>
                </div>
                <div className="banner-feature">
                  <div className="banner-feature-value">256-bit</div>
                  <div className="banner-feature-label">Encryption</div>
                </div>
                <div className="banner-feature">
                  <div className="banner-feature-value">10M+</div>
                  <div className="banner-feature-label">Customers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <div className="form-container">
              {/* Header */}
              <div className="form-header">
                <h1 className="form-title">Sign In</h1>
                <p className="form-subtitle">Access your account with email or staff ID</p>
                
                {/* Account Type Detection Badge */}
                {detectedType && (
                  <div className={`account-type-badge ${detectedType}`}>
                    {detectedType === 'staff' ? (
                      <>
                        <PersonBadge className="account-type-icon" size={16} />
                        Staff Account Detected
                      </>
                    ) : (
                      <>
                        <Person className="account-type-icon" size={16} />
                        Customer Account Detected
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Alert */}
              <Alert 
                show={showAlert.show}
                variant={showAlert.variant}
                message={showAlert.message}
                onClose={() => setShowAlert({ show: false, message: '', variant: '' })}
              />

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Email or Staff ID"
                  name="identifier"
                  placeholder="Enter your email address or Staff ID (e.g., STAFF_3000)"
                  value={formData.identifier}
                  onChange={handleChange}
                  error={errors.identifier}
                  className={detectedType ? `${detectedType}-detected` : ''}
                />

                <PasswordInput
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />

                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="form-footer">
                  <div className="signup-link">
                    Don't have an account?{' '}
                    <Link to="/register">Sign Up</Link>
                  </div>
                </div>
              </form>

              {/* Copyright */}
              <div className="copyright">
                © 2025 PNB Banking System. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login