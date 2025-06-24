import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert, InputGroup, Badge } from 'react-bootstrap'
import { Eye, EyeSlash, Bank, PersonBadge, Person } from 'react-bootstrap-icons'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../services/user.Service.js'
import StaffService from '../services/staff.Service.js'

const Login = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    identifier: '', // Can be email for users or staffStringId for staff
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: '' })
  const [detectedType, setDetectedType] = useState(null) // 'user' or 'staff'

  // Common styles
  const styles = {
    input: { fontSize: '16px', height: '48px' },
    label: { fontSize: '16px' },
    feedback: { fontSize: '14px' },
    eyeToggle: { 
      cursor: 'pointer',
      height: '48px',
      display: 'flex',
      alignItems: 'center'
    }
  }
  // Auto-detect account type based on input
  const detectAccountType = (identifier) => {
    const emailPattern = /\S+@\S+\.\S+/
    if (emailPattern.test(identifier)) {
      return 'user'
    } else if (identifier.startsWith('STAFF_') || identifier.toLowerCase().includes('staff')) {
      return 'staff'
    }
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-detect account type for identifier field
    if (name === 'identifier') {
      const type = detectAccountType(value)
      setDetectedType(type)
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  const validateForm = () => {
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
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      let loginResponse
      const accountType = detectAccountType(formData.identifier)
      
      if (accountType === 'staff') {
        // Staff login
        const result = await StaffService.loginStaff(formData.identifier, formData.password)
        
        if (result.success) {
          loginResponse = result.data
          
          // Store staff data in localStorage
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
          
          // Route based on department
          setTimeout(() => {
            switch (loginResponse.department.toLowerCase()) {
              case 'admin':
                navigate('/admin/dashboard')
                break
              case 'finance':
                navigate('/admin/dashboard') // Redirect finance to admin dashboard for now
                break
              case 'loan':
                navigate('/loan/dashboard') // Redirect loan to admin dashboard for now
                break
            }
          }, 1500)
          
        } else {
          throw new Error(result.error)
        }
      } else if (accountType === 'user') {
        // User login
        loginResponse = await UserService.loginUser(formData.identifier, formData.password)
        
        if (loginResponse.userId) {
          UserService.setUserData({
            userId: loginResponse.userId,
            email: formData.identifier
          })
        }
        
        setShowAlert({
          show: true,
          message: 'Login successful! Redirecting to dashboard...',
          variant: 'success'
        })
        
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        throw new Error('Unable to determine account type. Please check your credentials.')
      }
      
      setFormData({ identifier: '', password: '' })
      
    } catch (error) {
      console.error('Login error:', error)
      setShowAlert({
        show: true,
        message: error.message || 'Login failed. Please check your credentials.',
        variant: 'danger'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page" style={{ height: '100vh', overflow: 'hidden' }}>
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Banner Section */}
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

          {/* Login Form Section */}
          <Col lg={7} className="d-flex align-items-center justify-content-center p-4" style={{ height: '100vh', overflow: 'auto', minWidth: '60%' }}>
            <div className="w-100" style={{ maxWidth: '600px' }}>              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '32px' }}>Sign In</h2>
                <p className="text-muted mb-3" style={{ fontSize: '18px' }}>Access your account with email or staff ID</p>
                
                {/* Account Type Detection Indicator */}
                {detectedType && (
                  <div className="mb-3">
                    <Badge 
                      bg={detectedType === 'staff' ? 'primary' : 'success'} 
                      className="px-3 py-2"
                      style={{ fontSize: '14px' }}
                    >
                      {detectedType === 'staff' ? (
                        <>
                          <PersonBadge className="me-2" size={16} />
                          Staff Account Detected
                        </>
                      ) : (
                        <>
                          <Person className="me-2" size={16} />
                          Customer Account Detected
                        </>
                      )}
                    </Badge>
                  </div>
                )}
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
              )}              {/* Login Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={styles.label}>
                    Email or Staff ID
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your email address or Staff ID (e.g., user@example.com or STAFF_3000)"
                    isInvalid={!!errors.identifier}
                    style={{
                      ...styles.input,
                      borderColor: detectedType === 'staff' ? '#6f42c1' : detectedType === 'user' ? '#198754' : ''
                    }}
                  />
                  <Form.Control.Feedback type="invalid" style={styles.feedback}>
                    {errors.identifier}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={styles.label}>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      isInvalid={!!errors.password}
                      style={styles.input}
                    />
                    <InputGroup.Text 
                      style={styles.eyeToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash className="text-muted" size={20} /> : <Eye className="text-muted" size={20} />}
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid" style={styles.feedback}>
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check 
                    type="checkbox" 
                    label="Remember me" 
                    className="text-muted"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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
