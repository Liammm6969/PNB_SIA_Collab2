import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, ProgressBar, Form } from 'react-bootstrap'
import { 
  Cash, 
  GraphUp, 
  GraphDown, 
  People, 
  CreditCard, 
  Eye, 
  Download, 
  Filter,
  BarChart,
  Clock,
  CheckCircle,
  XCircle,
  ExclamationTriangle,
  FileText,
  Calculator,
  Building
} from 'react-bootstrap-icons'

const FinanceDashboard = () => {
  const [dateRange, setDateRange] = useState('7days')
  const [stats, setStats] = useState({
    totalDeposits: 2847500.00,
    pendingDeposits: 156000.00,
    processedToday: 89500.00,
    rejectedDeposits: 12000.00,
    totalUsers: 1247,
    activeTransactions: 89,
    averageDepositAmount: 15600.00,
    departmentRevenue: 98500.00
  })

  const [recentDeposits, setRecentDeposits] = useState([
    {
      id: 'DEP_001',
      user: 'John Smith',
      accountNumber: '****1234',
      amount: 25000.00,
      method: 'Bank Transfer',
      status: 'Pending',
      date: '2025-01-25 14:30',
      priority: 'High'
    },
    {
      id: 'DEP_002',
      user: 'Maria Garcia',
      accountNumber: '****5678',
      amount: 15000.00,
      method: 'Check Deposit',
      status: 'Processing',
      date: '2025-01-25 13:45',
      priority: 'Medium'
    },
    {
      id: 'DEP_003',
      user: 'Robert Johnson',
      accountNumber: '****9012',
      amount: 50000.00,
      method: 'Wire Transfer',
      status: 'Approved',
      date: '2025-01-25 12:15',
      priority: 'High'
    },
    {
      id: 'DEP_004',
      user: 'Lisa Chen',
      accountNumber: '****3456',
      amount: 8500.00,
      method: 'ATM Deposit',
      status: 'Pending',
      date: '2025-01-25 11:20',
      priority: 'Low'
    },
    {
      id: 'DEP_005',
      user: 'Michael Brown',
      accountNumber: '****7890',
      amount: 35000.00,
      method: 'Online Transfer',
      status: 'Rejected',
      date: '2025-01-25 10:45',
      priority: 'Medium'
    }
  ])

  const [departmentMetrics, setDepartmentMetrics] = useState([
    { metric: 'Processing Efficiency', value: 94, target: 95, trend: 'up' },
    { metric: 'Approval Rate', value: 89, target: 90, trend: 'down' },
    { metric: 'Average Processing Time', value: '2.4 hrs', target: '2.0 hrs', trend: 'up' },
    { metric: 'Customer Satisfaction', value: 96, target: 95, trend: 'up' }
  ])

  const getStatusBadge = (status) => {    const statusConfig = {
      Pending: { bg: 'warning', icon: <Clock size={12} className="me-1" />, text: 'Pending' },
      Processing: { bg: 'primary', icon: <BarChart size={12} className="me-1" />, text: 'Processing' },
      Approved: { bg: 'success', icon: <CheckCircle size={12} className="me-1" />, text: 'Approved' },
      Rejected: { bg: 'danger', icon: <XCircle size={12} className="me-1" />, text: 'Rejected' }
    }

    const config = statusConfig[status] || { bg: 'secondary', icon: null, text: status }
    return (
      <Badge bg={config.bg} className="d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      High: { bg: 'danger', text: 'High Priority' },
      Medium: { bg: 'warning', text: 'Medium' },
      Low: { bg: 'secondary', text: 'Low' }
    }

    const config = priorityConfig[priority] || { bg: 'secondary', text: priority }
    return <Badge bg={config.bg} className="ms-2">{config.text}</Badge>
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Container fluid className="px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <Building size={28} className="me-2 text-success" />
            Finance Dashboard
          </h1>
          <p className="text-muted mb-0">
            Monitor and manage all deposit operations and financial metrics
          </p>
        </div>
        <div className="d-flex gap-2">
          <Form.Select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="me-2"
            style={{ width: 'auto' }}
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
          </Form.Select>
          <Button variant="success" className="d-flex align-items-center">
            <Download size={16} className="me-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col xl={3} md={6}>
          <Card className="border-0 finance-stat-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Total Deposits</h6>
                  <h3 className="fw-bold mb-0 text-white">
                    {formatCurrency(stats.totalDeposits)}
                  </h3>                  <small className="text-white-50">
                    <GraphUp size={12} className="me-1" />
                    +18% from last month
                  </small>
                </div>                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <Cash size={24} className="text-white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 finance-stat-card-warning h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Pending Approval</h6>
                  <h3 className="fw-bold mb-0 text-white">
                    {formatCurrency(stats.pendingDeposits)}
                  </h3>                  <small className="text-white-50">
                    <ExclamationTriangle size={12} className="me-1" />
                    15 deposits waiting
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <Clock size={24} className="text-white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 finance-stat-card-info h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-dark-50 mb-1">Processed Today</h6>
                  <h3 className="fw-bold mb-0">
                    {formatCurrency(stats.processedToday)}
                  </h3>
                  <small className="text-dark-50">
                    <CheckCircle size={12} className="me-1" />
                    23 deposits completed
                  </small>
                </div>                <div className="p-3 bg-dark bg-opacity-20 rounded-circle">
                  <BarChart size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 finance-stat-card-success h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Department Revenue</h6>
                  <h3 className="fw-bold mb-0 text-white">
                    {formatCurrency(stats.departmentRevenue)}
                  </h3>                  <small className="text-white-50">
                    <GraphUp size={12} className="me-1" />
                    +22% processing fees
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <Calculator size={24} className="text-white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Department Performance Metrics */}
      <Row className="g-4 mb-4">
        <Col>
          <Card className="border-0 finance-card">
            <Card.Header className="bg-transparent border-bottom-0 pb-0">              <h5 className="fw-bold mb-0 d-flex align-items-center">
                <BarChart size={20} className="me-2 text-success" />
                Department Performance Metrics
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                {departmentMetrics.map((metric, index) => (
                  <Col md={3} key={index}>
                    <div className="text-center">
                      <h6 className="text-muted mb-2">{metric.metric}</h6>
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <h4 className="mb-0 me-2">{metric.value}</h4>                        {metric.trend === 'up' ? (
                          <GraphUp size={16} className="text-success" />
                        ) : (
                          <GraphDown size={16} className="text-danger" />
                        )}
                      </div>
                      <small className="text-muted">Target: {metric.target}</small>
                      {typeof metric.value === 'number' && (
                        <ProgressBar 
                          now={metric.value} 
                          className="mt-2" 
                          style={{ height: '6px' }}
                          variant={metric.value >= (typeof metric.target === 'number' ? metric.target : 90) ? 'success' : 'warning'}
                        />
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Deposits Table */}
      <Row className="g-4">
        <Col>
          <Card className="border-0 finance-card">
            <Card.Header className="bg-transparent border-bottom-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 d-flex align-items-center">
                  <FileText size={20} className="me-2 text-success" />
                  Recent Deposit Requests
                </h5>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" size="sm">
                    <Filter size={14} className="me-2" />
                    Filter
                  </Button>
                  <Button variant="success" size="sm">
                    View All Deposits
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="pt-3">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th className="border-0 text-muted fw-semibold">Deposit ID</th>
                    <th className="border-0 text-muted fw-semibold">Customer</th>
                    <th className="border-0 text-muted fw-semibold">Amount</th>
                    <th className="border-0 text-muted fw-semibold">Method</th>
                    <th className="border-0 text-muted fw-semibold">Status</th>
                    <th className="border-0 text-muted fw-semibold">Date</th>
                    <th className="border-0 text-muted fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeposits.map((deposit) => (
                    <tr 
                      key={deposit.id}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa'
                        e.currentTarget.style.transform = 'scale(1.01)'
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <td className="border-0">
                        <div>
                          <div className="fw-semibold text-primary">{deposit.id}</div>
                          {getPriorityBadge(deposit.priority)}
                        </div>
                      </td>
                      <td className="border-0">
                        <div>
                          <div className="fw-semibold">{deposit.user}</div>
                          <small className="text-muted">{deposit.accountNumber}</small>
                        </div>
                      </td>
                      <td className="border-0">
                        <div className="fw-bold text-success fs-6">
                          {formatCurrency(deposit.amount)}
                        </div>
                      </td>
                      <td className="border-0">
                        <span className="text-muted">{deposit.method}</span>
                      </td>
                      <td className="border-0">
                        {getStatusBadge(deposit.status)}
                      </td>
                      <td className="border-0">
                        <small className="text-muted">{formatDate(deposit.date)}</small>
                      </td>
                      <td className="border-0">
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="p-2"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </Button>
                          {deposit.status === 'Pending' && (
                            <>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="p-2"
                                title="Approve"
                              >
                                <CheckCircle size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="p-2"
                                title="Reject"
                              >
                                <XCircle size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Custom Styles */}
      <style>{`
        .finance-stat-card {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border-radius: 16px;
          color: white;
          transition: all 0.3s ease;
        }

        .finance-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
        }

        .finance-stat-card-warning {
          background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
          border-radius: 16px;
          color: white;
        }

        .finance-stat-card-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255, 193, 7, 0.3);
        }

        .finance-stat-card-info {
          background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
          border-radius: 16px;
          color: white;
        }

        .finance-stat-card-info:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(23, 162, 184, 0.3);
        }

        .finance-stat-card-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 16px;
          color: white;
        }

        .finance-stat-card-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(79, 172, 254, 0.3);
        }

        .finance-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          transition: all 0.3s ease;
        }

        .finance-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(31, 38, 135, 0.2);
        }

        .table tbody tr:hover {
          background-color: rgba(40, 167, 69, 0.05) !important;
        }

        .btn-outline-success:hover {
          background-color: #28a745;
          border-color: #28a745;
        }

        .btn-outline-primary:hover {
          background-color: #007bff;
          border-color: #007bff;
        }

        .btn-outline-danger:hover {
          background-color: #dc3545;
          border-color: #dc3545;
        }
      `}</style>
    </Container>
  )
}

export default FinanceDashboard