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
      Deposit: { bg: 'success', icon: <ArrowDownCircle size={12} className="me-1" />, text: 'Deposit' },
      Transfer: { bg: 'primary', icon: <Send size={12} className="me-1" />, text: 'Transfer' },
      Withdrawal: { bg: 'warning', icon: <ArrowUpCircle size={12} className="me-1" />, text: 'Withdrawal' },
      Payment: { bg: 'info', icon: <CreditCard size={12} className="me-1" />, text: 'Payment' }
    }

    const config = typeConfig[type] || { bg: 'secondary', icon: <FileText size={12} className="me-1" />, text: type }
    return (
      <Badge bg={config.bg} className="d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleShowDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedTransaction(null)
  }

  const exportTransactions = () => {
    const csvContent = [
      ['Transaction ID', 'Date', 'Type', 'From User', 'To User', 'Amount', 'Status', 'Description'],
      ...filteredTransactions.map(transaction => [
        transaction.id,
        formatDate(transaction.date),
        transaction.type,
        transaction.fromUser,
        transaction.toUser,
        transaction.amount,
        transaction.status,
        transaction.description
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading transactions...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Cash className="me-2" />
                Transaction Management
              </h2>
              <p className="text-muted mb-0">Monitor and manage all financial transactions</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={exportTransactions}>
                <Download className="me-1" />
                Export
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Filters and Search */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Deposit">Deposits</option>
            <option value="Transfer">Transfers</option>
            <option value="Withdrawal">Withdrawals</option>
            <option value="Payment">Payments</option>
          </Form.Select>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </Form.Select>
        </Col>
        <Col lg={6} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by transaction ID, description, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Transaction Summary */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FileText className="text-primary" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Total Transactions</h6>
                  <h4 className="mb-0">{filteredTransactions.length}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <CheckCircle className="text-success" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Completed</h6>
                  <h4 className="mb-0">{filteredTransactions.filter(t => t.status === 'Completed').length}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <Clock className="text-warning" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Processing</h6>
                  <h4 className="mb-0">{filteredTransactions.filter(t => t.status === 'Processing').length}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <Cash className="text-info" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Total Volume</h6>
                  <h4 className="mb-0">{formatCurrency(filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0))}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0">
            <FileText className="me-2" />
            Transaction History
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No transactions found</h5>
              <p className="text-muted">No transactions match your current filters.</p>
            </div>
          ) : (
            <Table responsive className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>From User</th>
                  <th>To User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="fw-semibold">{transaction.id}</div>
                    </td>
                    <td>
                      <div className="text-muted small">
                        {formatDate(transaction.date)}
                      </div>
                    </td>
                    <td>
                      {getTypeBadge(transaction.type)}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <PersonCircle className="me-2 text-muted" size={16} />
                        {transaction.fromUser === 0 ? 'Bank' : transaction.fromUser}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <PersonCircle className="me-2 text-muted" size={16} />
                        {transaction.toUser === 0 ? 'Bank' : transaction.toUser}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleShowDetails(transaction)}
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Transaction Detail Modal */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <Row>
              <Col md={6}>
                <Card className="border-light mb-3">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Basic Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Transaction ID:</strong>
                      <div className="text-muted">{selectedTransaction.id}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Date:</strong>
                      <div className="text-muted">{formatDate(selectedTransaction.date)}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Type:</strong>
                      <div>{getTypeBadge(selectedTransaction.type)}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong>
                      <div>{getStatusBadge(selectedTransaction.status)}</div>
                    </div>
                    <div className="mb-0">
                      <strong>Amount:</strong>
                      <div className="text-primary fw-semibold fs-5">
                        {formatCurrency(selectedTransaction.amount)}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-light mb-3">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Transaction Details</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>From User:</strong>
                      <div className="text-muted">
                        {selectedTransaction.fromUser === 0 ? 'Bank' : `User ID: ${selectedTransaction.fromUser}`}
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong>To User:</strong>
                      <div className="text-muted">
                        {selectedTransaction.toUser === 0 ? 'Bank' : `User ID: ${selectedTransaction.toUser}`}
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong>Description:</strong>
                      <div className="text-muted">{selectedTransaction.description}</div>
                    </div>
                    {selectedTransaction.balanceAfter && (
                      <div className="mb-0">
                        <strong>Balance After:</strong>
                        <div className="text-muted">{formatCurrency(selectedTransaction.balanceAfter)}</div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default TransactionManagement
