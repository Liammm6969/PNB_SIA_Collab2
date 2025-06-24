import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Bank, Person, CreditCard, BarChart } from 'react-bootstrap-icons'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../services/user.Service.js'

const Dashboard = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    if (!UserService.isAuthenticated()) {
      navigate('/login')
      return
    }

    // Get user data from localStorage
    const storedUserData = UserService.getUserData()
    setUserData(storedUserData)

    // Fetch user profile if userId is available
    if (storedUserData.userId) {
      fetchUserProfile(storedUserData.userId)
    }
  }, [navigate])

  const fetchUserProfile = async (userId) => {
    try {
      const profile = await UserService.getUserProfile(userId)
      setUserProfile(profile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // If token is invalid, redirect to login
      if (error.message.includes('token') || error.message.includes('unauthorized')) {
        handleLogout()
      }
    }
  }

  const handleLogout = () => {
    UserService.logout()
    navigate('/login')
  }

  const getDisplayName = () => {
    if (userProfile) {
      if (userProfile.firstName && userProfile.lastName) {
        return `${userProfile.firstName} ${userProfile.lastName}`
      } else if (userProfile.businessName) {
        return userProfile.businessName
      }
    }
    return userData?.email || 'User'
  }
  return (
    <div className="dashboard-page" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        <Container>
          <div className="navbar-brand d-flex align-items-center">
            <Bank size={28} className="me-2" />
            <span className="fw-bold">PNB Banking System</span>
          </div>          <div className="navbar-nav ms-auto d-flex align-items-center">
            <span className="text-white me-3">Hello, {getDisplayName()}</span>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <Container className="py-5">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>                <h1 className="fw-bold text-dark">Welcome, {getDisplayName()}!</h1>
                <p className="text-muted">Manage your banking operations and account details</p>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Account Overview */}
          <Col lg={4} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#e3f2fd' }}>
                    <Person size={24} className="text-primary" />
                  </div>
                  <h5 className="fw-bold mb-0">Account Overview</h5>
                </div>
                <p className="text-muted mb-3">View and manage your account information</p>
                <Button variant="primary" className="w-100">View Details</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Transactions */}
          <Col lg={4} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#f3e5f5' }}>
                    <CreditCard size={24} className="text-success" />
                  </div>
                  <h5 className="fw-bold mb-0">Transactions</h5>
                </div>
                <p className="text-muted mb-3">View your transaction history and details</p>
                <Button variant="success" className="w-100">View Transactions</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Reports */}
          <Col lg={4} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#fff3e0' }}>
                    <BarChart size={24} className="text-warning" />
                  </div>
                  <h5 className="fw-bold mb-0">Reports</h5>
                </div>
                <p className="text-muted mb-3">Generate and view financial reports</p>
                <Button variant="warning" className="w-100">View Reports</Button>
              </Card.Body>
            </Card>
          </Col>        </Row>
      </Container>
    </div>
  )
}

export default Dashboard
