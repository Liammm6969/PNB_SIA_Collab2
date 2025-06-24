import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { Eye, EyeSlash, Person, Lock, Bank, Shield, Clock, Globe } from 'react-bootstrap-icons'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: '' })
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Auto-hide alerts after 5 seconds
  useEffect(() => {
    if (showAlert.show) {
      const timer = setTimeout(() => {
        setShowAlert({ show: false, message: '', variant: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showAlert.show])
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Password strength calculation
    if (name === 'password') {
      calculatePasswordStrength(value)
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength += 25
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
      // TODO: Replace with actual API call
      console.log('Login attempt:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setShowAlert({
        show: true,
        message: 'Login successful! Redirecting...',
        variant: 'success'
      })
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
      
    } catch (error) {
      setShowAlert({
        show: true,
        message: 'Login failed. Please check your credentials.',
        variant: 'danger'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page" style={{ height: '100vh', overflow: 'hidden' }}>
      <Container fluid className="h-100">        <Row className="h-100">
          {/* Banner Section - Left Side (Desktop) / Top (Mobile) */}
          <Col lg={5} className="d-none d-lg-flex align-items-center justify-content-center p-0" style={{ maxWidth: '40%' }}>
            <div 
              className="banner-section w-100 h-100 d-flex align-items-center justify-content-center position-relative"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                <h1 className="h2 fw-bold mb-3">Welcome to PNB</h1>
                <h4 className="fw-light mb-3">Banking System</h4>
                <p className="mb-4 opacity-75" style={{ fontSize: '16px' }}>
                  Secure, reliable, and modern banking solutions for your financial needs.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <div className="text-center">
                    <div className="fw-bold h5">24/7</div>
                    <small className="opacity-75">Support</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold h5">256-bit</div>
                    <small className="opacity-75">Encryption</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold h5">10M+</div>
                    <small className="opacity-75">Customers</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Login Form Section - Right Side */}
          <Col lg={7} className="d-flex align-items-center justify-content-center p-4" style={{ height: '100vh', overflow: 'auto', minWidth: '60%' }}>            <div className="w-100" style={{ maxWidth: '600px' }}>
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '32px' }}>Sign In</h2>
                <p className="text-muted mb-0" style={{ fontSize: '18px' }}>Access your account</p>
              </div>

              {/* Alert */}
              {showAlert.show && (
                <Alert 
                  variant={showAlert.variant} 
                  dismissible 
                  onClose={() => setShowAlert({ show: false, message: '', variant: '' })}
                  className="mb-4"
                  style={{ fontSize: '15px' }}
                >
                  {showAlert.message}
                </Alert>
              )}

              {/* Login Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={{ fontSize: '16px' }}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    isInvalid={!!errors.email}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: '14px' }}>
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={{ fontSize: '16px' }}>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      isInvalid={!!errors.password}
                      style={{ fontSize: '16px', height: '48px' }}
                    />
                    <InputGroup.Text 
                      style={{ 
                        cursor: 'pointer',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash className="text-muted" size={20} /> : <Eye className="text-muted" size={20} />}
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid" style={{ fontSize: '14px' }}>
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check 
                    type="checkbox" 
                    label="Remember me" 
                    className="text-muted"
                    style={{ fontSize: '15px' }}
                  />
                  <Button 
                    variant="link" 
                    className="text-decoration-none p-0"
                    style={{ fontSize: '15px' }}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-semibold mb-4"
                  disabled={isLoading}
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    height: '50px'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-muted" style={{ fontSize: '15px' }}>
                    Don't have an account?{' '}
                    <Link 
                      to="/register"
                      className="text-decoration-none fw-semibold"
                      style={{ fontSize: '15px' }}
                    >
                      Sign Up
                    </Link>
                  </span>
                </div>
              </Form>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
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

export default Login
