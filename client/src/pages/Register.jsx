import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaUniversity } from 'react-icons/fa';
import userService from '../service/user.Service.js';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Account type selection, 2: Registration form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: ''
  });  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAccountTypeSelect = (accountType) => {
    setFormData({
      ...formData,
      accountType: accountType
    });
    setStep(2);
  };

  const handleBackToAccountType = () => {
    setStep(1);
    setValidated(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false || formData.password !== formData.confirmPassword) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call the user service register method
      const response = await userService.registerUser(formData);
      
      if (response.message) {
        setSuccess(response.message);
        console.log('Registration successful:', response);
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Account Type Selection Step
  const renderAccountTypeSelection = () => (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="min-vh-100 m-0">
        <Col xs={12} lg={6} className="d-none d-lg-flex align-items-center justify-content-center auth-banner slide-in-left">
          <div className="text-center text-white p-3 p-md-5">
            <div className="mb-3 mb-md-4 fade-in">
              <h1 className="display-6 display-md-5 fw-bold mb-3 mb-md-4">Choose Your</h1>
              <img 
                src="https://www.pnb.com.ph/wp-content/themes/pnbrevamp/images/PNB-logo-01.svg" 
                alt="Account Type Banner" 
                className="img-fluid mb-3 mb-md-4"
                style={{ maxWidth: '300px', width: '100%' }}
              />
              <h2 className="display-6 fw-bold">Account Type</h2>
            </div>
            <p className="lead mb-3 mb-md-4 fade-in-up stagger-1 fs-6 fs-md-5">
              Select the account type that best suits your needs
            </p>
            <div className="features fade-in-up stagger-2">
              <p className="mb-2 small">✓ Tailored Banking Solutions</p>
              <p className="mb-2 small">✓ Customized Features</p>
              <p className="mb-2 small">✓ Dedicated Support</p>
            </div>
          </div>
        </Col>

        <Col xs={12} lg={6} className="p-3 p-md-5 d-flex align-items-center justify-content-center slide-in-right">
          <div className="w-100" style={{ maxWidth: '500px' }}>
            <div className="text-center mb-4 mb-md-5 fade-in">
              <h2 className="fw-bold mb-2 fs-3 fs-md-2">Select Account Type</h2>
              <p className="text-muted small">Choose the account that fits your banking needs</p>
            </div>
            
            <div className="row g-3 g-md-4 fade-in-up">
              <div className="col-12">
                <div 
                  className="card h-100 border-2 cursor-pointer account-type-card"
                  onClick={() => handleAccountTypeSelect('personal')}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0d6efd';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(13, 110, 253, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body text-center p-3 p-md-4">
                    <div className="mb-3">
                      <FaUser size={window.innerWidth < 768 ? 32 : 48} className="text-primary" />
                    </div>
                    <h4 className="card-title mb-2 mb-md-3 fs-5 fs-md-4">Personal Savings Account</h4>
                    <p className="card-text text-muted mb-2 mb-md-3 small">
                      Perfect for individual banking needs with features designed for personal finance management.
                    </p>
                    <ul className="list-unstyled text-start">
                      <li className="mb-1 mb-md-2 small">✓ Personal savings and checking</li>
                      <li className="mb-1 mb-md-2 small">✓ Online and mobile banking</li>
                      <li className="mb-1 mb-md-2 small">✓ Debit card access</li>
                      <li className="mb-1 mb-md-2 small">✓ Low maintenance fees</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="col-12">
                <div 
                  className="card h-100 border-2 cursor-pointer account-type-card"
                  onClick={() => handleAccountTypeSelect('business')}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0d6efd';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(13, 110, 253, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body text-center p-3 p-md-4">
                    <div className="mb-3">
                      <FaUniversity size={window.innerWidth < 768 ? 32 : 48} className="text-primary" />
                    </div>
                    <h4 className="card-title mb-2 mb-md-3 fs-5 fs-md-4">Business Account</h4>
                    <p className="card-text text-muted mb-2 mb-md-3 small">
                      Comprehensive banking solutions designed for businesses of all sizes.
                    </p>
                    <ul className="list-unstyled text-start">
                      <li className="mb-1 mb-md-2 small">✓ Business checking and savings</li>
                      <li className="mb-1 mb-md-2 small">✓ Merchant services</li>
                      <li className="mb-1 mb-md-2 small">✓ Business loans and credit</li>
                      <li className="mb-1 mb-md-2 small">✓ Cash management tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 mt-md-4 text-center fade-in">
              <p className="mb-0 text-muted small">Already have an account?{' '}
                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
  // Registration Form Step
  const renderRegistrationForm = () => (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="min-vh-100 m-0">
        <Col xs={12} lg={6} className="d-none d-lg-flex align-items-center justify-content-center auth-banner slide-in-left">
          <div className="text-center text-white p-3 p-md-5">
            <div className="mb-3 mb-md-4 fade-in">
              <h1 className="display-6 display-md-5 fw-bold mb-3 mb-md-4">
                {formData.accountType === 'personal' ? 'Personal' : 'Business'}
              </h1>
              <img 
                src="https://www.pnb.com.ph/wp-content/themes/pnbrevamp/images/PNB-logo-01.svg" 
                alt="Register Banner" 
                className="img-fluid mb-3 mb-md-4"
                style={{ maxWidth: '300px', width: '100%' }}
              />
              <h2 className="display-6 fw-bold">Account Registration</h2>
            </div>
            <p className="lead mb-3 mb-md-4 fade-in-up stagger-1 fs-6 fs-md-5">
              {formData.accountType === 'personal' 
                ? 'Start your journey towards financial excellence with PNB'
                : 'Grow your business with our comprehensive banking solutions'
              }
            </p>
            <div className="features fade-in-up stagger-2">
              {formData.accountType === 'personal' ? (
                <>
                  <p className="mb-2 small">✓ Free Account Creation</p>
                  <p className="mb-2 small">✓ Instant Account Activation</p>
                  <p className="mb-2 small">✓ Access to All Banking Services</p>
                </>
              ) : (
                <>
                  <p className="mb-2 small">✓ Business Account Setup</p>
                  <p className="mb-2 small">✓ Advanced Business Tools</p>
                  <p className="mb-2 small">✓ Dedicated Business Support</p>
                </>
              )}
            </div>
          </div>
        </Col>

        <Col xs={12} lg={6} className="p-3 p-md-5 d-flex align-items-center justify-content-center slide-in-right">
          <div className="w-100" style={{ maxWidth: '450px' }}>
            <div className="d-flex align-items-center mb-3 mb-md-4">
              <Button 
                variant="link" 
                className="p-0 me-2 me-md-3 text-primary d-flex align-items-center"
                onClick={handleBackToAccountType}
              >
                ← <span className="d-none d-sm-inline ms-1">Back</span>
              </Button>              <div className="flex-grow-1 text-center fade-in">
                <h2 className="fw-bold mb-2 fs-4 fs-md-3">
                  Create {formData.accountType === 'personal' ? 'Personal' : 'Business'} Account
                </h2>
                <p className="text-muted small">Please fill in your information</p>
              </div>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-3">
                {success}
              </Alert>
            )}
            
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="fade-in-up">
              <Row className="stagger-1">
                <Col xs={12} sm={6}>
                  <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label className="small fw-medium">First Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light d-none d-sm-flex">
                        <FaUser className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="border-start-0 py-2 py-md-3"
                      />
                      <Form.Control.Feedback type="invalid">
                        First name is required.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label className="small fw-medium">Last Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light d-none d-sm-flex">
                        <FaUser className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="border-start-0 py-2 py-md-3"
                      />
                      <Form.Control.Feedback type="invalid">
                        Last name is required.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3 stagger-2" controlId="formAccountType">
                <Form.Label className="small fw-medium">Account Type</Form.Label>
                <div className="p-2 p-md-3 bg-light rounded d-flex align-items-center">
                  {formData.accountType === 'personal' ? (
                    <>
                      <FaUser className="text-primary me-2" />
                      <span className="fw-medium small">Personal Savings Account</span>
                    </>
                  ) : (
                    <>
                      <FaUniversity className="text-primary me-2" />
                      <span className="fw-medium small">Business Account</span>
                    </>
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3 stagger-2" controlId="formEmail">
                <Form.Label className="small fw-medium">Email address</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light d-none d-sm-flex">
                    <FaEnvelope className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-start-0 py-2 py-md-3"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3 stagger-2" controlId="formPassword">
                <Form.Label className="small fw-medium">Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light d-none d-sm-flex">
                    <FaLock className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="border-start-0 border-end-0 py-2 py-md-3"
                  />
                  <InputGroup.Text 
                    className="bg-light cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? 
                      <FaEyeSlash className="text-muted" /> : 
                      <FaEye className="text-muted" />
                    }
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3 mb-md-4 stagger-3" controlId="formConfirmPassword">
                <Form.Label className="small fw-medium">Confirm Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light d-none d-sm-flex">
                    <FaLock className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    isInvalid={validated && formData.password !== formData.confirmPassword}
                    className="border-start-0 border-end-0 py-2 py-md-3"
                  />
                  <InputGroup.Text 
                    className="bg-light cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showConfirmPassword ? 
                      <FaEyeSlash className="text-muted" /> : 
                      <FaEye className="text-muted" />
                    }
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    Passwords do not match.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <div className="d-grid gap-2 stagger-3">
                <Button 
                  variant="primary" 
                  type="submit"
                  className="py-2 py-md-3 fw-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>

              <div className="mt-3 mt-md-4 text-center fade-in">
                <p className="mb-0 text-muted small">Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none">
                    Sign In
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );

  return (
    <>
      {step === 1 ? renderAccountTypeSelection() : renderRegistrationForm()}
    </>
  );
};

export default Register;