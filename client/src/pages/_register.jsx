import React from 'react'
import { Container, Row, Col, Form, Button, Alert, InputGroup, Card } from 'react-bootstrap'
import { Eye, EyeSlash, Person, Building, Lock, Envelope, GeoAlt, Calendar3 } from 'react-bootstrap-icons'
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

// --- Form Side Component ---
function RegisterFormSide(props) {
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
  } = props

  return (
    <div className="form-side-pixel">
      {/* Logo and tagline */}
      <div className="pnb-logo-pixel">
        <img src="/Logo.png" alt="PNB Logo" />
      </div>
      {/* Header */}
      <div className="form-header-pixel">
        <h2>Sign up</h2>
      </div>
      {/* Name fields */}
      <Form onSubmit={handleSubmit} className="register-form-pixel">
        <div className="form-row-pixel">
          <div className="form-group-pixel">
            <Envelope className="input-icon-pixel" />
            <input
              type="text"
              className="form-control-pixel"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              autoComplete="off"
            />
          </div>
          <div className="form-group-pixel">
            <Envelope className="input-icon-pixel" />
            <input
              type="text"
              className="form-control-pixel"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="form-group-pixel">
          <Envelope className="input-icon-pixel" />
          <input
            type="text"
            className="form-control-pixel"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            autoComplete="off"
          />
        </div>
        <div className="form-group-pixel">
          <Envelope className="input-icon-pixel" />
          <input
            type="date"
            className="form-control-pixel"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            placeholder="Date of birth"
            autoComplete="off"
          />
        </div>
        <div className="form-group-pixel">
          <Envelope className="input-icon-pixel" />
          <input
            type="email"
            className="form-control-pixel"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="off"
          />
        </div>
        <div className="form-group-pixel">
          <Envelope className="input-icon-pixel" />
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control-pixel"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="off"
          />
          <div className="password-toggle-pixel" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeSlash /> : <Eye />}
          </div>
        </div>
        <div className="form-group-pixel">
          <Envelope className="input-icon-pixel" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="form-control-pixel"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="off"
          />
          <div className="password-toggle-pixel" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeSlash /> : <Eye />}
          </div>
        </div>
        <button type="submit" className="submit-button-pixel" disabled={isLoading}>
          Log in
        </button>
        <div className="or-divider-pixel">or</div>
        <div className="sign-in-link-pixel">
          Already have an account?{' '}
          <Link to="/login" className="sign-in-link-pixel-link">Sign in</Link>
        </div>
      </Form>
    </div>
  )
}

// --- Banner Side Component ---
function RegisterBannerSide() {
  return (
    <div className="banner-side-pixel">
      <div className="banner-content-pixel">
        <div className="banner-title-pixel">
          <h2>
            Hello, Welcome!
            </h2>
        <div className="banner-subtitle-gradient">
          <h2>
            <span>
              Your success <br /> is our promise
            </span>
          </h2>
        </div>
        </div>
        <div className="banner-desc-pixel">PNB crafts every service around your needs and future vision.</div>
      </div>
    </div>
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
    <div className="register-page-pixel">
      <div className="register-card-pixel">
        <RegisterFormSide
          formData={formData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          errors={errors}
          isLoading={isLoading}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          handleChange={handleChange}
          handleAccountTypeChange={handleAccountTypeChange}
          handleSubmit={handleSubmit}
        />
        <RegisterBannerSide />
      </div>
    </div>
  )
}

export default Register