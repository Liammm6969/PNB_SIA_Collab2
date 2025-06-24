import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaUniversity } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

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
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Registration data:', formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="vh-100 m-0">
        <Col md={6} className="d-none d-md-flex align-items-center justify-content-center auth-banner slide-in-left">
          <div className="text-center text-white p-5">
            <div className="mb-4 fade-in">
              <h1 className="display-4 fw-bold mb-4">Join</h1>
              <img 
                src="https://www.pnb.com.ph/wp-content/themes/pnbrevamp/images/PNB-logo-01.svg" 
                alt="Register Banner" 
                className="img-fluid mb-4"
                style={{ maxWidth: '400px' }}
              />
            </div>
            <p className="lead mb-4 fade-in-up stagger-1">
              Start your journey towards financial excellence with PNB
            </p>
            <div className="features fade-in-up stagger-2">
              <p className="mb-2">✓ Free Account Creation</p>
              <p className="mb-2">✓ Instant Account Activation</p>
              <p className="mb-2">✓ Access to All Banking Services</p>
            </div>
          </div>
        </Col>

        <Col md={6} className="p-5 d-flex align-items-center justify-content-center slide-in-right">
          <div className="w-100" style={{ maxWidth: '450px' }}>
            <div className="text-center mb-4 fade-in">
              <h2 className="fw-bold mb-2">Create Account</h2>
              <p className="text-muted">Please fill in your information</p>
            </div>
            
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="fade-in-up">
              <Row className="stagger-1">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <FaUser className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="border-start-0"
                      />
                      <Form.Control.Feedback type="invalid">
                        First name is required.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <FaUser className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="border-start-0"
                      />
                      <Form.Control.Feedback type="invalid">
                        Last name is required.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>              </Row>

              <Form.Group className="mb-3 stagger-2" controlId="formAccountType">
                <Form.Label>Account Type</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light">
                    <FaUniversity className="text-muted" />
                  </InputGroup.Text>
                  <Form.Select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    required
                    className="border-start-0"
                  >
                    <option value="">Select account type</option>
                    <option value="savings">Savings Account</option>
                    <option value="checking">Checking Account</option>
                    <option value="business">Business Account</option>
                    <option value="student">Student Account</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select an account type.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3 stagger-2" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light">
                    <FaEnvelope className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-start-0"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3 stagger-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light">
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
                    className="border-start-0 border-end-0"
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

              <Form.Group className="mb-4 stagger-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light">
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
                    className="border-start-0 border-end-0"
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
                  className="py-2"
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

              <div className="mt-4 text-center fade-in">
                <p className="mb-0 text-muted">Already have an account?{' '}
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
};

export default Register;