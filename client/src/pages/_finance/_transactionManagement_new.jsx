import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, InputGroup, Tabs, Tab, Spinner } from 'react-bootstrap'
import { 
  Cash, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Upload,
  FileText,
  Calendar,
  Building,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  CheckCircle,
  XCircle,
  GraphUp,
  Printer,
  Send,
  Flag,
  PersonCircle
} from 'react-bootstrap-icons'
import TransactionService from '../../services/transaction.Service'

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load all payments/transactions
      const allPayments = await TransactionService.getAllPayments()
      
      // Transform payments to transaction format
      const transformedTransactions = allPayments.map(payment => ({
        id: payment.paymentStringId || payment.paymentId,
        paymentId: payment.paymentId,
        fromUser: payment.fromUser,
        toUser: payment.toUser,
        amount: payment.amount,
        type: payment.fromUser === 0 ? 'Deposit' : 'Transfer',
        status: 'Completed', // All saved payments are completed
        description: payment.details || 'No description',
        date: payment.createdAt || payment.date,
        balanceAfter: payment.balanceAfterPayment
      }))
      
      setTransactions(transformedTransactions)
      
    } catch (error) {
      console.error('Failed to load transactions:', error)
      setError('Failed to load transactions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions based on type, status, and search term
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'All' || transaction.type === filterType
    const matchesStatus = filterStatus === 'All' || transaction.status === filterStatus
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.fromUser.toString().includes(searchTerm) ||
                         transaction.toUser.toString().includes(searchTerm)
    
    return matchesType && matchesStatus && matchesSearch
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      Completed: { bg: 'success', icon: <CheckCircle size={12} className="me-1" />, text: 'Completed' },
      Processing: { bg: 'primary', icon: <Clock size={12} className="me-1" />, text: 'Processing' },
      Failed: { bg: 'danger', icon: <XCircle size={12} className="me-1" />, text: 'Failed' },
      Pending: { bg: 'warning', icon: <Clock size={12} className="me-1" />, text: 'Pending' }
    }

    const config = statusConfig[status] || { bg: 'secondary', icon: null, text: status }
    return (
      <Badge bg={config.bg} className="d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const getTypeBadge = (type) => {
    const typeConfig = {
      Deposit: { bg: 'success', icon: <ArrowDownCircle size={12} className="me-1" /> },
      Transfer: { bg: 'primary', icon: <ArrowUpCircle size={12} className="me-1" /> },
      Withdrawal: { bg: 'warning', icon: <ArrowUpCircle size={12} className="me-1" /> }
    }

    const config = typeConfig[type] || { bg: 'secondary', icon: null }
    return (
      <Badge bg={config.bg} className="d-flex align-items-center">
        {config.icon}
        {type}
      </Badge>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailModal(true)
  }

  const getTransactionStats = () => {
    return {
      total: transactions.length,
      deposits: transactions.filter(t => t.type === 'Deposit').length,
      transfers: transactions.filter(t => t.type === 'Transfer').length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      completed: transactions.filter(t => t.status === 'Completed').length
    }
  }

  const stats = getTransactionStats()

  if (loading) {
    return (
      <Container fluid className="px-4 py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading transactions...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="px-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
          {error}
        </Alert>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <CreditCard size={28} className="me-2 text-success" />
            Transaction Management
          </h1>
          <p className="text-muted mb-0">
            Monitor and manage all financial transactions and transfers
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-success" onClick={loadTransactions}>
            <Download size={16} className="me-2" />
            Refresh
          </Button>
          <Button variant="success">
            <Upload size={16} className="me-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Transaction Statistics */}
      <Row className="g-3 mb-4">
        <Col xl={3} md={6}>
          <Card className="border-0 transaction-stat-card bg-primary text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{stats.total}</h4>
              <small>Total Transactions</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="border-0 transaction-stat-card bg-success text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{stats.deposits}</h4>
              <small>Deposits</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="border-0 transaction-stat-card bg-info text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{stats.transfers}</h4>
              <small>Transfers</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="border-0 transaction-stat-card bg-warning text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{formatCurrency(stats.totalAmount)}</h4>
              <small>Total Volume</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="border-0 transaction-card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col lg={4}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by transaction ID, description, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={2}>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Deposit">Deposits</option>
                <option value="Transfer">Transfers</option>
                <option value="Withdrawal">Withdrawals</option>
              </Form.Select>
            </Col>
            <Col lg={2}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Col>
            <Col lg={4} className="text-end">
              <span className="text-muted">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Transactions Table */}
      <Card className="border-0 transaction-card">
        <Card.Header className="bg-transparent border-bottom-0 pb-0">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            <FileText size={20} className="me-2 text-success" />
            All Transactions
          </h5>
        </Card.Header>
        <Card.Body className="pt-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <p className="text-muted">No transactions found</p>
              <small className="text-muted">
                {transactions.length === 0 ? 'No transactions have been processed yet' : 'Try adjusting your search filters'}
              </small>
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
                  <th className="border-0 text-muted fw-semibold">Status</th>
                  <th className="border-0 text-muted fw-semibold">Date</th>
                  <th className="border-0 text-muted fw-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="border-0">
                      <div>
                        <div className="fw-semibold text-primary">{transaction.id}</div>
                        <small className="text-muted">Payment ID: {transaction.paymentId}</small>
                      </div>
                    </td>
                    <td className="border-0">
                      {getTypeBadge(transaction.type)}
                    </td>
                    <td className="border-0">
                      <div className="d-flex align-items-center">
                        <PersonCircle size={16} className="me-2 text-muted" />
                        <span className="text-muted">
                          {transaction.fromUser === 0 ? 'System' : `User ${transaction.fromUser}`}
                        </span>
                      </div>
                    </td>
                    <td className="border-0">
                      <div className="d-flex align-items-center">
                        <PersonCircle size={16} className="me-2 text-muted" />
                        <span>User {transaction.toUser}</span>
                      </div>
                    </td>
                    <td className="border-0">
                      <div className="fw-bold text-success fs-6">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="border-0">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="border-0">
                      <small className="text-muted">{formatDate(transaction.date)}</small>
                    </td>
                    <td className="border-0">
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="p-2"
                          title="View Details"
                          onClick={() => handleViewTransaction(transaction)}
                        >
                          <Eye size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Transaction Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fw-bold">
            <Eye size={24} className="me-2" />
            Transaction Details - {selectedTransaction?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedTransaction && (
            <div className="p-4">
              <Row className="g-4">
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-bold text-success mb-3">
                        <CreditCard size={18} className="me-2" />
                        Transaction Information
                      </h6>
                      <div className="mb-2">
                        <strong>Transaction ID:</strong> {selectedTransaction.id}
                      </div>
                      <div className="mb-2">
                        <strong>Payment ID:</strong> {selectedTransaction.paymentId}
                      </div>
                      <div className="mb-2">
                        <strong>Type:</strong> {getTypeBadge(selectedTransaction.type)}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong> {getStatusBadge(selectedTransaction.status)}
                      </div>
                      <div className="mb-2">
                        <strong>Amount:</strong> 
                        <span className="fs-5 fw-bold text-success ms-2">
                          {formatCurrency(selectedTransaction.amount)}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-bold text-success mb-3">
                        <PersonCircle size={18} className="me-2" />
                        Parties Involved
                      </h6>
                      <div className="mb-2">
                        <strong>From:</strong> 
                        <span className="ms-2">
                          {selectedTransaction.fromUser === 0 ? 'System (External Deposit)' : `User ${selectedTransaction.fromUser}`}
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>To:</strong> 
                        <span className="ms-2">User {selectedTransaction.toUser}</span>
                      </div>
                      {selectedTransaction.balanceAfter && (
                        <div className="mb-2">
                          <strong>Balance After:</strong> 
                          <span className="ms-2 text-success fw-bold">
                            {formatCurrency(selectedTransaction.balanceAfter)}
                          </span>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={12}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-bold text-success mb-3">
                        <FileText size={18} className="me-2" />
                        Transaction Details
                      </h6>
                      <div className="mb-2">
                        <strong>Description:</strong>
                        <p className="text-muted mt-1">{selectedTransaction.description}</p>
                      </div>
                      <div className="mb-2">
                        <strong>Date:</strong> {formatDate(selectedTransaction.date)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button variant="outline-primary">
            <Printer size={16} className="me-2" />
            Print Receipt
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style>{`
        .transaction-stat-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .transaction-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .transaction-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          transition: all 0.3s ease;
        }

        .transaction-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2);
        }

        .table tbody tr:hover {
          background-color: rgba(40, 167, 69, 0.05) !important;
        }

        .btn-outline-info:hover {
          background-color: #17a2b8;
          border-color: #17a2b8;
        }
      `}</style>
    </Container>
  )
}

export default TransactionManagement
