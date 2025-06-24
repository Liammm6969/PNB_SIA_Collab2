import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Bank, Person, CreditCard, BarChart } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'

const Dashboard = () => {
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
          </div>
          <div className="navbar-nav ms-auto">
            <Link to="/login" className="nav-link text-white">
              <Button variant="outline-light" size="sm">Logout</Button>
            </Link>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <Container className="py-5">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="fw-bold text-dark">Welcome to Your Dashboard</h1>
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
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mt-5">
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Quick Statistics</h5>
                <Row className="text-center">
                  <Col md={3}>
                    <div className="p-3">
                      <h3 className="fw-bold text-primary">$12,500</h3>
                      <p className="text-muted mb-0">Current Balance</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="p-3">
                      <h3 className="fw-bold text-success">145</h3>
                      <p className="text-muted mb-0">Total Transactions</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="p-3">
                      <h3 className="fw-bold text-warning">$2,350</h3>
                      <p className="text-muted mb-0">Monthly Spending</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="p-3">
                      <h3 className="fw-bold text-info">98%</h3>
                      <p className="text-muted mb-0">Success Rate</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard
