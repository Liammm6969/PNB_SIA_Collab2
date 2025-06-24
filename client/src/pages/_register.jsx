import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert, InputGroup, Card } from 'react-bootstrap'
import { Eye, EyeSlash, Person, Lock, Bank, Envelope, Phone, Building } from 'react-bootstrap-icons'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../services/user.Service.js'

const Register = () => {  
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    accountType: 'personal', // Default to personal account
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: '' })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))    }
  }
  const handleAccountTypeChange = (accountType) => {
    setFormData(prev => ({
      ...prev,
      accountType,
      // Clear fields based on account type
      firstName: accountType === 'business' ? '' : prev.firstName,
      lastName: accountType === 'business' ? '' : prev.lastName,
      businessName: accountType === 'personal' ? '' : prev.businessName
    }))
    
    // Clear errors for fields that are no longer relevant
    const newErrors = { ...errors }
    if (accountType === 'business') {
      delete newErrors.firstName
      delete newErrors.lastName
    } else {
      delete newErrors.businessName
    }
    setErrors(newErrors)
  }
  const validateForm = () => {
    const newErrors = {}
    
    // First name is only required for personal accounts
    if (formData.accountType === 'personal' && !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    // Last name is only required for personal accounts
    if (formData.accountType === 'personal' && !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Business name is only required for business accounts
    if (formData.accountType === 'business' && !formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required for business accounts'
    }
      if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else {
      // More detailed password validation feedback
      const hasLower = /[a-z]/.test(formData.password)
      const hasUpper = /[A-Z]/.test(formData.password)
      const hasNumber = /\d/.test(formData.password)
      
      if (!hasLower) {
        newErrors.password = 'Password must contain at least one lowercase letter'
      } else if (!hasUpper) {
        newErrors.password = 'Password must contain at least one uppercase letter'
      } else if (!hasNumber) {
        newErrors.password = 'Password must contain at least one number'
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare user data based on account type
      let userData;
      
      if (formData.accountType === 'personal') {
        userData = UserService.createPersonalAccountData(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password
        );
      } else {
        userData = UserService.createBusinessAccountData(
          formData.businessName,
          formData.email,
          formData.password
        );
      }
      
      // Register the user
      const response = await UserService.registerUser(userData);
        setShowAlert({
        show: true,
        message: 'Registration successful! Redirecting to login...',
        variant: 'success'
      })
      
      // Clear form
      setFormData({
        accountType: 'personal',
        firstName: '',
        lastName: '',
        email: '',
        businessName: '',
        password: '',
        confirmPassword: ''
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (error) {
      console.error('Registration error:', error);
      setShowAlert({
        show: true,
        message: error.message || 'Registration failed. Please try again.',
        variant: 'danger'
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="register-page" style={{ height: '100vh', overflow: 'hidden' }}>
      <Container fluid className="h-100">        <Row className="h-100">
          {/* Banner Section - Left Side (Desktop) / Top (Mobile) */}
          <Col lg={5} className="d-none d-lg-flex align-items-center justify-content-center p-0" style={{ maxWidth: '40%' }}>
            <div 
              className="banner-section w-100 h-100 d-flex align-items-center justify-content-center position-relative"
              style={{ 
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
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
              />
              
              {/* Banner Content */}
              <div className="text-center text-white position-relative z-index-1 px-4">
                <div className="mb-3">
                  <Bank size={60} className="text-white mb-3" />
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

          {/* Register Form Section - Right Side */}
          <Col lg={7} className="d-flex align-items-center justify-content-center p-3" style={{ height: '100vh', overflow: 'auto', minWidth: '60%' }}>
            <div className="w-100" style={{ maxWidth: '600px' }}>
              {/* Header */}
              <div className="text-center mb-2">
                <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '24px' }}>Create Account</h2>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Join our banking platform</p>
              </div>              {/* Alert */}
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
                <Form.Label className="fw-semibold mb-1 d-block" style={{ fontSize: '13px' }}>Choose Account Type</Form.Label>
                <Row className="g-2">
                  <Col xs={6}>
                    <Card 
                      className={`text-center cursor-pointer ${formData.accountType === 'personal' ? 'border-success bg-light' : 'border-secondary'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={() => handleAccountTypeChange('personal')}
                    >
                      <Card.Body className="py-1">
                        <Person size={20} className={formData.accountType === 'personal' ? 'text-success' : 'text-muted'} />
                        <div className={`mt-1 fw-semibold ${formData.accountType === 'personal' ? 'text-success' : 'text-dark'}`} style={{ fontSize: '12px' }}>
                          Personal
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={6}>
                    <Card 
                      className={`text-center cursor-pointer ${formData.accountType === 'business' ? 'border-success bg-light' : 'border-secondary'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={() => handleAccountTypeChange('business')}
                    >
                      <Card.Body className="py-1">
                        <Building size={20} className={formData.accountType === 'business' ? 'text-success' : 'text-muted'} />
                        <div className={`mt-1 fw-semibold ${formData.accountType === 'business' ? 'text-success' : 'text-dark'}`} style={{ fontSize: '12px' }}>
                          Business
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>              {/* Register Form */}
              <Form onSubmit={handleSubmit}>
                {/* Personal Account Fields - First Name and Last Name */}
                {formData.accountType === 'personal' && (
                  <Row className="g-2">
                    <Col xs={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="fw-semibold" style={{ fontSize: '12px' }}>First Name</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First name"
                          isInvalid={!!errors.firstName}
                          style={{ fontSize: '13px', height: '30px' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '11px' }}>
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="fw-semibold" style={{ fontSize: '12px' }}>Last Name</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last name"
                          isInvalid={!!errors.lastName}
                          style={{ fontSize: '13px', height: '30px' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '11px' }}>
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {/* Business Account Fields - Business Name */}
                {formData.accountType === 'business' && (
                  <Row className="g-2">
                    <Col xs={12}>
                      <Form.Group className="mb-2">
                        <Form.Label className="fw-semibold" style={{ fontSize: '12px' }}>Business Name</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          placeholder="Enter business name"
                          isInvalid={!!errors.businessName}
                          style={{ fontSize: '13px', height: '30px' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '11px' }}>
                          {errors.businessName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                )}<Row className="g-2">
                  <Col xs={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-semibold" style={{ fontSize: '12px' }}>Email Address</Form.Label>
                      <Form.Control
                        size="sm"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        isInvalid={!!errors.email}
                        style={{ fontSize: '13px', height: '30px' }}
                      />
                      <Form.Control.Feedback type="invalid" style={{ fontSize: '11px' }}>
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>                </Row>

                <Row className="g-2">
                  <Col xs={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-semibold" style={{ fontSize: '12px' }}>Password</Form.Label>
                      <InputGroup size="sm">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create password"
                          isInvalid={!!errors.password}
                          style={{ fontSize: '13px', height: '30px' }}
                        />
                        <InputGroup.Text 
                          style={{ 
                            cursor: 'pointer',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeSlash className="text-muted" size={14} /> : <Eye className="text-muted" size={14} />}
                        </InputGroup.Text>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid" style={{ fontSize: '11px' }}>
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-semibold" style={{ fontSize: '12px' }}>Confirm Password</Form.Label>
                      <InputGroup size="sm">
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          isInvalid={!!errors.confirmPassword}
                          style={{ fontSize: '13px', height: '30px' }}
                        />
                        <InputGroup.Text 
                          style={{ 
                            cursor: 'pointer',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeSlash className="text-muted" size={14} /> : <Eye className="text-muted" size={14} />}
                        </InputGroup.Text>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid" style={{ fontSize: '11px' }}>
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="success"
                  type="submit"
                  className="w-100 fw-semibold mt-2 mb-2"
                  disabled={isLoading}
                  style={{ 
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
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