import React from 'react'
import { Container, Row, Col, Form, Button, Alert, InputGroup, Card } from 'react-bootstrap'
import { Eye, EyeSlash, Person, Building, Lock, Envelope, GeoAlt, Calendar, Calendar3 } from 'react-bootstrap-icons'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../services/user.Service.js'
import '../styles/Register.css'

// Custom hook for register form logic
function useRegisterForm(getInitialFormState, navigate) {
  const [formData, setFormData] = React.useState(getInitialFormState())
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [errors, setErrors] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState({ show: false, message: '', variant: '' })

  const clearError = React.useCallback((fieldName) => {
    if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: '' }))
  }, [errors])

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    clearError(name)
  }, [clearError])

  const handleAccountTypeChange = React.useCallback((accountType) => {
    setFormData(prev => ({
      ...prev,
      accountType,
      firstName: accountType === 'business' ? '' : prev.firstName,
      lastName: accountType === 'business' ? '' : prev.lastName,
      businessName: accountType === 'personal' ? '' : prev.businessName
    }))
    setErrors(prev => {
      const newErrors = { ...prev }
      if (accountType === 'business') {
        delete newErrors.firstName
        delete newErrors.lastName
      } else {
        delete newErrors.businessName
      }
      return newErrors
    })
  }, [])

  const validatePassword = React.useCallback((password) => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/\d/.test(password)) return 'Password must contain at least one number'
    return ''
  }, [])

  const validateForm = React.useCallback(() => {
    const newErrors = {}
    if (formData.accountType === 'personal') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    } else {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, validatePassword])

  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const userData = formData.accountType === 'personal'
        ? UserService.createPersonalAccountData(
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.password
          )
        : UserService.createBusinessAccountData(
            formData.businessName,
            formData.email,
            formData.password
          )
      await UserService.registerUser(userData)
      setShowAlert({
        show: true,
        message: 'Registration successful! Redirecting to login...',
        variant: 'success'
      })
      setFormData(getInitialFormState())
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setShowAlert({
        show: true,
        message: error.message || 'Registration failed. Please try again.',
        variant: 'danger'
      })
    } finally {
      setIsLoading(false)
    }
  }, [formData, getInitialFormState, navigate, validateForm])

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errors,
    isLoading,
    showAlert,
    setShowAlert,
    handleChange,
    handleAccountTypeChange,
    handleSubmit
  }
}

const styles = {
  input: { fontSize: '13px', height: '30px' },
  label: { fontSize: '12px' },
  feedback: { fontSize: '11px' },
  eyeToggle: { cursor: 'pointer', height: '30px', display: 'flex', alignItems: 'center' }
}

function Field({ label, name, type = 'text', placeholder, value, onChange, error, ...rest }) {
  return (
    <Form.Group className="mb-2">
      <Form.Label className="fw-semibold" style={styles.label}>{label}</Form.Label>
      <Form.Control
        size="sm"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isInvalid={!!error}
        style={styles.input}
        {...rest}
      />
      <Form.Control.Feedback type="invalid" style={styles.feedback}>
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

function PasswordField({ label, name, placeholder, value, onChange, error, show, toggleShow }) {
  return (
    <Form.Group className="mb-2">
      <Form.Label className="fw-semibold" style={styles.label}>{label}</Form.Label>
      <InputGroup size="sm">
        <Form.Control
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          isInvalid={!!error}
          style={styles.input}
        />
        <InputGroup.Text style={styles.eyeToggle} onClick={toggleShow}>
          {show ? <EyeSlash className="text-muted" size={14} /> : <Eye className="text-muted" size={14} />}
        </InputGroup.Text>
      </InputGroup>
      <Form.Control.Feedback type="invalid" style={styles.feedback}>
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

const Register = () => {
  const navigate = useNavigate()
  const getInitialFormState = React.useCallback(() => ({
    accountType: 'personal',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    dateOfBirth: '',
    businessName: '',
    password: '',
    confirmPassword: ''
  }), [])

  const {
    formData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errors,
    isLoading,
    showAlert,
    setShowAlert,
    handleChange,
    handleAccountTypeChange,
    handleSubmit
  } = useRegisterForm(getInitialFormState, navigate)

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="form-side">
          {/* PNB Logo */}
          <div className="pnb-logo">
            <img src="/Logo.png" alt="PNB Logo" />
          </div>
          
          {/* Form header */}
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Join our banking platform</p>
          </div>
          
          {/* Alert for messages */}
          {showAlert.show && (
            <Alert 
              variant={showAlert.variant} 
              dismissible 
              onClose={() => setShowAlert({ show: false, message: '', variant: '' })}
              className="mb-4"
            >
              {showAlert.message}
            </Alert>
          )}
          
          {/* Account type selection */}
          <div className="account-type">
            <div className="account-type-label">Choose Account Type</div>
            <div className="account-type-options">
              <div 
                className={`account-type-option ${formData.accountType === 'personal' ? 'active' : ''}`}
                onClick={() => handleAccountTypeChange('personal')}
              >
                <div className="icon">
                  <Person />
                </div>
                <div className="label">Personal</div>
              </div>
              <div 
                className={`account-type-option ${formData.accountType === 'business' ? 'active' : ''}`}
                onClick={() => handleAccountTypeChange('business')}
              >
                <div className="icon">
                  <Building />
                </div>
                <div className="label">Business</div>
              </div>
            </div>
          </div>
          
          <Form onSubmit={handleSubmit}>
            {/* Name fields - conditional based on account type */}
            {formData.accountType === 'personal' ? (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
              </div>
            ) : (
              <div className="form-group mb-3">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.businessName ? 'is-invalid' : ''}`}
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                />
                {errors.businessName && <div className="invalid-feedback">{errors.businessName}</div>}
              </div>
            )}
            
            {/* Address field */}
            <div className="form-group mb-3">
              <label className="form-label">Address</label>
              <div className="input-with-icon">
                <GeoAlt className="input-icon" />
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
            </div>
            
            {/* Date of Birth field */}
            <div className="form-group mb-3">
              <label className="form-label">Date of Birth</label>
              <div className="input-with-icon">
                <Calendar3 className="input-icon" />
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Email field */}
            <div className="form-group mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Envelope className="input-icon" />
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>
            
            {/* Password field */}
            <div className="form-group mb-3">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeSlash /> : <Eye />}
                </div>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            
            {/* Confirm Password field */}
            <div className="form-group mb-4">
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                <div className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeSlash /> : <Eye />}
                </div>
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
            
            {/* Submit button */}
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </Form>
          
          {/* Sign in link */}
          <div className="sign-in-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
          
          {/* Copyright */}
          <div className="text-center mt-4">
            <small className="text-muted">© 2025 PNB Banking System. All rights reserved.</small>
          </div>
        </div>
        
        {/* Right side - Banner */}
        <div className="banner-side">
          <div className="banner-content">
            <h2>Hello,</h2>
            <div className="tagline">Welcome!</div>
            <h3>Your success is our promise</h3>
            <p>PNB crafts every service around your needs and future vision.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register