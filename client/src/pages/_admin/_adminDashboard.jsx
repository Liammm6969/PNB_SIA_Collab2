import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Table, Badge, ProgressBar } from 'react-bootstrap'
import { 
  People, 
  CreditCard, 
  GraphUp, 
  Shield,
  Eye,
  Plus,
  Download
} from 'react-bootstrap-icons'
import AdminLayout from '../../layouts/adminLayout'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalTransactions: 8450,
    totalRevenue: 125000,
    securityAlerts: 3
  })

  const [recentUsers, setRecentUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      type: 'Personal',
      status: 'Active',
      joinDate: '2025-01-20'
    },
    {
      id: 2,
      name: 'ABC Corp',
      email: 'contact@abc.com',
      type: 'Business',
      status: 'Pending',
      joinDate: '2025-01-19'
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      type: 'Personal',
      status: 'Active',
      joinDate: '2025-01-18'
    }
  ])

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 'TXN001',
      user: 'John Doe',
      amount: 2500,
      type: 'Transfer',
      status: 'Completed',
      date: '2025-01-20 14:30'
    },
    {
      id: 'TXN002',
      user: 'ABC Corp',
      amount: 15000,
      type: 'Payment',
      status: 'Processing',
      date: '2025-01-20 13:15'
    },
    {
      id: 'TXN003',
      user: 'Jane Smith',
      amount: 750,
      type: 'Withdrawal',
      status: 'Completed',
      date: '2025-01-20 12:45'
    }
  ])

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { bg: 'success', text: 'Active' },
      'Pending': { bg: 'warning', text: 'Pending' },
      'Inactive': { bg: 'secondary', text: 'Inactive' },
      'Completed': { bg: 'success', text: 'Completed' },
      'Processing': { bg: 'primary', text: 'Processing' },
      'Failed': { bg: 'danger', text: 'Failed' }
    }
    
    const config = statusConfig[status] || { bg: 'secondary', text: status }
    return <Badge bg={config.bg}>{config.text}</Badge>
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Dashboard</h1>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your bank today.</p>
        </div>
        <Button variant="primary" className="btn-admin-primary">
          <Download size={16} className="me-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col xl={3} md={6}>
          <Card className="border-0 stats-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Total Users</h6>
                  <h3 className="fw-bold mb-0">{stats.totalUsers.toLocaleString()}</h3>                  <small className="text-white-50">
                    <GraphUp size={12} className="me-1" />
                    +12% from last month
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <People size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 stats-card-success h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Transactions</h6>
                  <h3 className="fw-bold mb-0">{stats.totalTransactions.toLocaleString()}</h3>                  <small className="text-white-50">
                    <GraphUp size={12} className="me-1" />
                    +8% from last month
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <CreditCard size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 stats-card-warning h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Revenue</h6>
                  <h3 className="fw-bold mb-0">{formatCurrency(stats.totalRevenue)}</h3>                  <small className="text-white-50">
                    <GraphUp size={12} className="me-1" />
                    +15% from last month
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <GraphUp size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 stats-card-info h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-black-50 mb-1">Security Alerts</h6>
                  <h3 className="fw-bold mb-0">{stats.securityAlerts}</h3>
                  <small className="text-black-50">
                    Requires attention
                  </small>
                </div>
                <div className="p-3 bg-black bg-opacity-10 rounded-circle">
                  <Shield size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row className="g-4">
        {/* Recent Users */}
        <Col lg={6}>
          <Card className="admin-card border-0 h-100">
            <Card.Header className="bg-transparent border-bottom-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Users</h5>
                <Button variant="link" size="sm" className="text-decoration-none">
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="pt-3">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th className="border-0 text-muted fw-semibold">User</th>
                    <th className="border-0 text-muted fw-semibold">Type</th>
                    <th className="border-0 text-muted fw-semibold">Status</th>
                    <th className="border-0 text-muted fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="border-0">
                        <div>
                          <div className="fw-semibold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </td>
                      <td className="border-0">
                        <span className="text-muted">{user.type}</span>
                      </td>
                      <td className="border-0">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="border-0">
                        <Button variant="link" size="sm" className="p-0 text-primary">
                          <Eye size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Transactions */}
        <Col lg={6}>
          <Card className="admin-card border-0 h-100">
            <Card.Header className="bg-transparent border-bottom-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Transactions</h5>
                <Button variant="link" size="sm" className="text-decoration-none">
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="pt-3">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th className="border-0 text-muted fw-semibold">Transaction</th>
                    <th className="border-0 text-muted fw-semibold">Amount</th>
                    <th className="border-0 text-muted fw-semibold">Status</th>
                    <th className="border-0 text-muted fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="border-0">
                        <div>
                          <div className="fw-semibold">{transaction.id}</div>
                          <small className="text-muted">{transaction.user}</small>
                        </div>
                      </td>
                      <td className="border-0">
                        <span className="fw-semibold">{formatCurrency(transaction.amount)}</span>
                      </td>
                      <td className="border-0">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="border-0">
                        <Button variant="link" size="sm" className="p-0 text-primary">
                          <Eye size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-4 mt-2">
        <Col>
          <Card className="admin-card border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Quick Actions</h5>
              <Row className="g-3">
                <Col md={3}>
                  <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <Plus size={24} className="mb-2" />
                    <span>Add User</span>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button variant="outline-success" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <People size={24} className="mb-2" />
                    <span>Manage Staff</span>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button variant="outline-warning" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <CreditCard size={24} className="mb-2" />
                    <span>View Transactions</span>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button variant="outline-info" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <Shield size={24} className="mb-2" />
                    <span>Security Settings</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  )
}

export default AdminDashboard