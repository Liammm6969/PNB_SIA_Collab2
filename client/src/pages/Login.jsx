import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login data:', formData);
      
      // Mock authentication check - replace with actual API response
      const mockResponse = {
        success: true,
        user: {
          email: formData.email,
          role: formData.email.includes('admin') ? 'admin' : 'user'
        }
      };

      if (mockResponse.success) {
        // Store user data in localStorage or state management
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        // Navigate based on user role
        if (mockResponse.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="min-vh-100 m-0">
        <Col xs={12} lg={6} className="p-3 p-md-5 d-flex align-items-center justify-content-center slide-in-left">
          <div className="w-100" style={{ maxWidth: '450px' }}>
            <div className="text-center mb-3 mb-md-4 fade-in">
              <h2 className="fw-bold mb-2 fs-3 fs-md-2">Welcome Back!</h2>
              <p className="text-muted small">Please enter your credentials to continue</p>
            </div>
              <Form noValidate validated={validated} onSubmit={handleSubmit} className="fade-in-up">
              <Form.Group className="mb-3 stagger-1" controlId="formEmail">
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

              <Form.Group className="mb-3 mb-md-4 stagger-2" controlId="formPassword">
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
                <div className="d-flex justify-content-end mt-2">
                  <Link to="/forgot-password" className="text-primary text-decoration-none small">
                    Forgot Password?
                  </Link>
                </div>
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
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>

              <div className="mt-3 mt-md-4 text-center fade-in">
                <p className="mb-0 text-muted small">Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-bold text-decoration-none">
                    Create Account
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>        <Col xs={12} lg={6} className="d-none d-lg-flex align-items-center justify-content-center auth-banner slide-in-right">
          <div className="text-center text-white p-3 p-md-5">
            <div className="mb-3 mb-md-4 fade-in">
              <h1 className="display-5 display-md-4 fw-bold mb-3 mb-md-4">Welcome to</h1>
              <img 
                src="https://www.pnb.com.ph/wp-content/themes/pnbrevamp/images/PNB-logo-01.svg" 
                alt="Login Banner" 
                className="img-fluid mb-3 mb-md-4"
                style={{ maxWidth: '300px', width: '100%' }}
              />
            </div>
            <p className="lead mb-3 mb-md-4 fade-in-up stagger-1 fs-6 fs-md-5">
              Secure your financial future with our innovative banking solutions
            </p>
            <div className="features fade-in-up stagger-2">
              <p className="mb-2 small">✓ 24/7 Secure Banking</p>
              <p className="mb-2 small">✓ Easy Money Transfer</p>
              <p className="mb-2 small">✓ Mobile Banking</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;