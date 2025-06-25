import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner } from 'react-bootstrap'
import { 
  Cash, 
  GraphUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Building,
  FileText,
  ArrowRepeat,
  PersonCircle
} from 'react-bootstrap-icons'
import DepositRequestService from '../../services/depositRequest.Service'
import TransactionService from '../../services/transaction.Service'

const FinanceDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  
  // Real data from API
  const [stats, setStats] = useState({
    pending: { count: 0, totalAmount: 0 },
    approved: { count: 0, totalAmount: 0 },
    rejected: { count: 0, totalAmount: 0 },
    processing: { count: 0, totalAmount: 0 }
  })
  
  const [recentDeposits, setRecentDeposits] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [analytics, setAnalytics] = useState({
    todayRequests: 0,
    monthlyApproved: 0,
    successRatio: 0
  })
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load deposit request statistics
      const statsData = await DepositRequestService.getDepositRequestStats()
      setStats(statsData)
      
      // Load recent deposit requests (pending ones first)
      const pendingRequests = await DepositRequestService.getAllDepositRequests('Pending', 10)
      setRecentDeposits(pendingRequests)
        // Load recent transactions from all users
      try {
        const allPayments = await TransactionService.getAllPayments()
        // Get the latest 10 payments
        const sortedPayments = allPayments.sort((a, b) => 
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        ).slice(0, 10)
        setRecentTransactions(sortedPayments)
      } catch (transactionError) {
        console.warn('Could not load payments:', transactionError.message)
        setRecentTransactions([])
      }
      
      // Calculate analytics
      const today = new Date().toDateString()
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()
      
      const todayRequests = recentDeposits.filter(deposit => 
        new Date(deposit.createdAt).toDateString() === today
      ).length
      
      const monthlyApproved = statsData.approved.totalAmount || 0
      const totalProcessed = (statsData.approved.count || 0) + (statsData.rejected.count || 0)
      const successRatio = totalProcessed > 0 ? 
        Math.round(((statsData.approved.count || 0) / totalProcessed) * 100) : 0
      
      setAnalytics({
        todayRequests,
        monthlyApproved,
        successRatio
      })
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await loadDashboardData()
    } catch (error) {
      setError('Failed to refresh dashboard data')
    } finally {
      setRefreshing(false)
    }
  }
  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { bg: 'warning', icon: <Clock size={12} className="me-1" />, text: 'Pending' },
      Approved: { bg: 'success', icon: <CheckCircle size={12} className="me-1" />, text: 'Approved' },
      Rejected: { bg: 'danger', icon: <XCircle size={12} className="me-1" />, text: 'Rejected' }
    }

    const config = statusConfig[status] || { bg: 'secondary', icon: null, text: status }
    return (
      <Badge bg={config.bg} className="d-flex align-items-center" style={{ fontSize: '0.75rem', width: 'fit-content' }}>
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const getTransactionTypeBadge = (type) => {
    const typeConfig = {
      deposit: { bg: 'success', text: 'Deposit' },
      transfer: { bg: 'primary', text: 'Transfer' },
      withdrawal: { bg: 'warning', text: 'Withdrawal' }
    }
    return typeConfig[type] || { bg: 'secondary', text: 'Transaction' }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
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

  if (loading) {
    return (
      <Container fluid className="px-4 py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading dashboard data...</p>
        </div>
      </Container>
    )
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
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <ArrowRepeat className={`me-1 ${refreshing ? 'spin' : ''}`} size={16} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="success" className="d-flex align-items-center">
            <Download size={16} className="me-2" />
            Export Report
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col xl={3} md={6}>
          <Card className="border-0 finance-stat-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Total Approved</h6>
                  <h3 className="fw-bold mb-0 text-white">
                    {formatCurrency(stats.approved.totalAmount)}
                  </h3>
                  <small className="text-white-50">
                    <CheckCircle size={12} className="me-1" />
                    {stats.approved.count} requests approved
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <CheckCircle size={24} className="text-white" />
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
                    {formatCurrency(stats.pending.totalAmount)}
                  </h3>
                  <small className="text-white-50">
                    <Clock size={12} className="me-1" />
                    {stats.pending.count} requests pending
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
          <Card className="border-0 finance-stat-card-danger h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Rejected</h6>
                  <h3 className="fw-bold mb-0 text-white">
                    {formatCurrency(stats.rejected.totalAmount)}
                  </h3>
                  <small className="text-white-50">
                    <XCircle size={12} className="me-1" />
                    {stats.rejected.count} requests rejected
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <XCircle size={24} className="text-white" />
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
                  <h6 className="text-white-50 mb-1">Total Requests</h6>
                  <h3 className="fw-bold mb-0 text-white">
                    {stats.pending.count + stats.approved.count + stats.rejected.count}
                  </h3>
                  <small className="text-white-50">
                    <FileText size={12} className="me-1" />
                    All deposit requests
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <FileText size={24} className="text-white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Deposit Requests */}
      <Row className="mb-4">
        <Col>
          <Card className="finance-card border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-success" />
                    Pending Deposit Requests
                  </h5>
                  <p className="text-muted mb-0 mt-1">Recent deposit requests awaiting approval</p>
                </div>
                <Button variant="outline-primary" size="sm" onClick={() => window.location.href = '/finance/deposits'}>
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="pt-3">
              {recentDeposits.length === 0 ? (
                <div className="text-center py-5">
                  <FileText size={48} className="text-muted mb-3" />
                  <p className="text-muted">No pending deposit requests</p>
                  <small className="text-muted">All deposit requests have been processed</small>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th className="border-0 text-muted fw-semibold">Request ID</th>
                      <th className="border-0 text-muted fw-semibold">Customer</th>
                      <th className="border-0 text-muted fw-semibold">Amount</th>
                      <th className="border-0 text-muted fw-semibold">Status</th>
                      <th className="border-0 text-muted fw-semibold">Date</th>
                      <th className="border-0 text-muted fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeposits.map((deposit) => (
                      <tr key={deposit.id}>
                        <td className="border-0">
                          <code className="text-primary">{deposit.id}</code>
                        </td>
                        <td className="border-0">
                          <div>
                            <div className="fw-semibold">{deposit.customerName}</div>
                            <small className="text-muted">{deposit.accountNumber}</small>
                          </div>
                        </td>
                        <td className="border-0">
                          <div className="fw-bold text-success fs-6">
                            {formatCurrency(deposit.amount)}
                          </div>
                        </td>
                        <td className="border-0">
                          {getStatusBadge(deposit.status)}
                        </td>
                        <td className="border-0">
                          <small className="text-muted">{formatDate(deposit.createdAt)}</small>
                        </td>
                        <td className="border-0">
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="p-2"
                              title="View Details"
                              onClick={() => window.location.href = `/finance/deposits`}
                            >
                              <Eye size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row className="mb-4">
        <Col>
          <Card className="finance-card border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-0 d-flex align-items-center">
                    <Cash size={20} className="me-2 text-success" />
                    Recent Transactions
                  </h5>
                  <p className="text-muted mb-0 mt-1">Latest financial transactions across all accounts</p>
                </div>
                <Button variant="outline-primary" size="sm" onClick={() => window.location.href = '/finance/transactions'}>
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="pt-3">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-5">
                  <Cash size={48} className="text-muted mb-3" />
                  <p className="text-muted">No recent transactions</p>
                  <small className="text-muted">Transaction data will appear here once available</small>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th className="border-0 text-muted fw-semibold">Transaction ID</th>
                      <th className="border-0 text-muted fw-semibold">Type</th>
                      <th className="border-0 text-muted fw-semibold">From</th>
                      <th className="border-0 text-muted fw-semibold">To</th>
                      <th className="border-0 text-muted fw-semibold">Amount</th>
                      <th className="border-0 text-muted fw-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction, index) => (
                      <tr key={transaction.paymentStringId || transaction.paymentId || transaction.id || `transaction-${index}`}>
                        <td className="border-0">
                          <code className="text-primary">{transaction.paymentStringId || transaction.paymentId || transaction.id}</code>
                        </td>
                        <td className="border-0">
                          <Badge bg={getTransactionTypeBadge(transaction.fromUser === 0 ? 'deposit' : 'transfer').bg}>
                            {transaction.fromUser === 0 ? 'Deposit' : 'Transfer'}
                          </Badge>
                        </td>                        <td className="border-0">
                          <span className="text-muted">
                            {transaction.fromUser === 0 ? 'Finance' : (transaction.fromUserDetails?.name || `User ${transaction.fromUser}`)}
                          </span>
                        </td>
                        <td className="border-0">
                          <div className="d-flex align-items-center">
                            <PersonCircle size={16} className="me-2 text-muted" />
                            <span>{transaction.toUserDetails?.name || `User ${transaction.toUser}`}</span>
                          </div>
                        </td>
                        <td className="border-0">
                          <div className="fw-bold text-success fs-6">
                            {formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="border-0">
                          <small className="text-muted">{formatDate(transaction.createdAt || transaction.date)}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{__html: `
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

        .finance-stat-card-danger {
          background: linear-gradient(135deg, #dc3545 0%, #e83e8c 100%);
          border-radius: 16px;
          color: white;
        }

        .finance-stat-card-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(220, 53, 69, 0.3);
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

        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </Container>
  )
}

export default FinanceDashboard
