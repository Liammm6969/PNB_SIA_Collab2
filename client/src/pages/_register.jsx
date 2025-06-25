import React from 'react'
import { Container, Row, Col, Form, Button, Alert, InputGroup, Card } from 'react-bootstrap'
import { Eye, EyeSlash, Person, Building } from 'react-bootstrap-icons'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../services/user.Service.js'

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
    <div className="register-page" style={{ height: '100vh', overflow: 'hidden' }}>
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Banner Section */}
          <Col lg={5} className="d-none d-lg-flex align-items-center justify-content-center p-0" style={{ maxWidth: '40%' }}>            <div 
              className="banner-section w-100 h-100 d-flex align-items-center justify-content-center position-relative"
              style={{ 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #6366f1 100%)',
                height: '100vh'
              }}
            >
              {/* Background Pattern */}
              <div 
                className="position-absolute w-100 h-100"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  opacity: 0.3
                }}
              />              {/* Banner Content */}
              <div className="text-center text-white position-relative z-index-1 px-4">
                <div className="mb-4">
                  <img 
                    src="/Logo.png" 
                    alt="PNB Logo" 
                    style={{ 
                      width: '220px', 
                      height: '220px', 
                      objectFit: 'contain',
                      marginBottom: '0'
                    }}
                    className="mb-3"
                  />
                </div>
                <h1 className="h2 fw-bold mb-3">Join PNB Today</h1>
                <h4 className="fw-light mb-3">Banking System</h4>
                <p className="mb-4 opacity-75" style={{ fontSize: '16px' }}>
                  Create your account and experience secure, modern banking solutions.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <div className="text-center">
                    <div className="fw-bold h5">Free</div>
                    <small className="opacity-75">Account Setup</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold h5">Instant</div>
                    <small className="opacity-75">Activation</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold h5">Secure</div>
                    <small className="opacity-75">Platform</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Register Form Section */}
          <Col lg={7} className="d-flex align-items-center justify-content-center p-3" style={{ height: '100vh', overflow: 'auto', minWidth: '60%' }}>
            <div className="w-100" style={{ maxWidth: '600px' }}>              {/* Header */}
              <div className="text-center mb-2">
                <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '24px' }}>Create Account</h2>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Join our banking platform</p>
              </div>

              {/* Alert */}
              {showAlert.show && (
                <Alert 
                  variant={showAlert.variant} 
                  dismissible 
                  onClose={() => setShowAlert({ show: false, message: '', variant: '' })}
                  className="mb-2"
                  style={{ fontSize: '13px' }}
                >
                  {showAlert.message}
                </Alert>
              )}

              {/* Account Type Selection */}
              <div className="mb-2">
                <Form.Label className="fw-semibold mb-1 d-block" style={styles.label}>Choose Account Type</Form.Label>
                <Row className="g-2">
                  <Col xs={6}>                    <Card 
                      className={`text-center cursor-pointer ${formData.accountType === 'personal' ? 'border-primary bg-light' : 'border-secondary'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={() => handleAccountTypeChange('personal')}
                    >
                      <Card.Body className="py-1">
                        <Person size={20} className={formData.accountType === 'personal' ? 'text-primary' : 'text-muted'} style={{ color: formData.accountType === 'personal' ? '#1e3a8a' : undefined }} />
                        <div className={`mt-1 fw-semibold ${formData.accountType === 'personal' ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '12px', color: formData.accountType === 'personal' ? '#1e3a8a' : undefined }}>
                          Personal
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={6}>                    <Card 
                      className={`text-center cursor-pointer ${formData.accountType === 'business' ? 'border-primary bg-light' : 'border-secondary'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={() => handleAccountTypeChange('business')}
                    >
                      <Card.Body className="py-1">
                        <Building size={20} className={formData.accountType === 'business' ? 'text-primary' : 'text-muted'} style={{ color: formData.accountType === 'business' ? '#1e3a8a' : undefined }} />
                        <div className={`mt-1 fw-semibold ${formData.accountType === 'business' ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '12px', color: formData.accountType === 'business' ? '#1e3a8a' : undefined }}>
                          Business
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Register Form */}
              <Form onSubmit={handleSubmit}>
                {formData.accountType === 'personal' && (
                  <Row className="g-2">
                    <Col xs={6}>
                      <Field label="First Name" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                    </Col>
                    <Col xs={6}>
                      <Field label="Last Name" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
                    </Col>
                  </Row>
                )}
                {formData.accountType === 'business' && (
                  <Row className="g-2">
                    <Col xs={12}>
                      <Field label="Business Name" name="businessName" placeholder="Enter business name" value={formData.businessName} onChange={handleChange} error={errors.businessName} />
                    </Col>
                  </Row>
                )}
                <Row className="g-2">
                  <Col xs={12}>
                    <Field label="Email Address" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} error={errors.email} />
                  </Col>
                </Row>
                <Row className="g-2">
                  <Col xs={6}>
                    <PasswordField 
                      label="Password" 
                      name="password" 
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      show={showPassword}
                      toggleShow={() => setShowPassword(v => !v)}
                    />
                  </Col>
                  <Col xs={6}>
                    <PasswordField 
                      label="Confirm Password" 
                      name="confirmPassword" 
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      show={showConfirmPassword}
                      toggleShow={() => setShowConfirmPassword(v => !v)}
                    />
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-semibold mt-2 mb-2"
                  disabled={isLoading}
                  style={{ 
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    height: '35px'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                <div className="text-center">
                  <span className="text-muted" style={{ fontSize: '12px' }}>
                    Already have an account?{' '}
                    <Link 
                      to="/login"
                      className="text-decoration-none fw-semibold"
                      style={{ fontSize: '12px' }}
                    >
                      Sign In
                    </Link>
                  </span>
                </div>
              </Form>

              {/* Footer */}
              <div className="text-center mt-1">
                <p className="text-muted mb-0" style={{ fontSize: '10px' }}>
                  © 2025 PNB Banking System. All rights reserved.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Register
