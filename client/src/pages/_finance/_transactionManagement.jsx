import React, { useState, useEffect } from 'react'
import { Container, Button, Table, Badge, Modal, Form, Alert, InputGroup, Spinner } from 'react-bootstrap'
import { 
  Cash, 
  Search, 
  Eye, 
  Download, 
  FileText,
  PersonCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  CheckCircle,
  XCircle,
  Send
} from 'react-bootstrap-icons'
import TransactionService from '../../services/transaction.Service'
import '../../styles/financeStyles/transactionManagement.css'

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
    const transactionId = transaction.id ? transaction.id.toString() : ''
    const transactionDescription = transaction.description ? transaction.description.toString() : ''
    const matchesSearch = transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transactionDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      Payment: { bg: 'info', icon: <ArrowDownCircle size={12} className="me-1" />, text: 'Payment' }
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

  // Stat values
  const totalTransactions = filteredTransactions.length;
  const totalVolume = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const completedCount = filteredTransactions.filter(t => t.status === 'Completed').length;
  const failedCount = filteredTransactions.filter(t => t.status === 'Failed').length;

  return (
    <Container fluid className="p-4">
      {/* Professional Header Card */}
      <div className="transaction-header-card">
        <div className="transaction-header-left">
          <div className="transaction-header-icon">
            <Cash size={32} className="text-white" />
          </div>
          <div>
            <div className="transaction-header-title">Transaction Management</div>
            <div className="transaction-header-subtitle">Monitor and manage all financial transactions</div>
          </div>
        </div>
        <div className="transaction-header-actions">
          <Button variant="outline-primary" onClick={exportTransactions}>
            <Download className="me-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="transaction-stat-grid">
        <div className="transaction-stat-card transaction-stat-card-blue">
          <div className="stat-icon"><FileText size={28} className="text-white" /></div>
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{totalTransactions}</div>
        </div>
        <div className="transaction-stat-card transaction-stat-card-green">
          <div className="stat-icon"><CheckCircle size={28} className="text-white" /></div>
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completedCount}</div>
        </div>
        <div className="transaction-stat-card transaction-stat-card-yellow">
          <div className="stat-icon"><Clock size={28} className="text-white" /></div>
          <div className="stat-label">Total Volume</div>
          <div className="stat-value">{formatCurrency(totalVolume)}</div>
        </div>
        <div className="transaction-stat-card transaction-stat-card-red">
          <div className="stat-icon"><XCircle size={28} className="text-white" /></div>
          <div className="stat-label">Failed</div>
          <div className="stat-value">{failedCount}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="transaction-filter-card mb-4">
        <div className="transaction-search">
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
        </div>
        <div className="transaction-type">
          <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Deposit">Deposit</option>
            <option value="Transfer">Transfer</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Payment">Payment</option>
          </Form.Select>
        </div>
        <div className="transaction-status">
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </Form.Select>
        </div>
        <div className="transaction-count">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transaction-table-card">
        <div className="px-4 pt-4 pb-0">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            <FileText size={20} className="me-2 text-success" />
            Transactions
          </h5>
        </div>
        <div className="pt-3 px-4">
          <div className="table-responsive">
            <table className="table transaction-table align-middle mb-0">
              <thead>
                <tr>
                  <th className="border-0">Transaction ID</th>
                  <th className="border-0">Type</th>
                  <th className="border-0">From</th>
                  <th className="border-0">To</th>
                  <th className="border-0">Amount</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Date</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id || `transaction-${index}`}>
                    <td className="border-0 align-middle">
                      <a href="#" className="transaction-id-link">{transaction.id}</a>
                    </td>
                    <td className="border-0 align-middle">
                      <span className={`type-badge ${transaction.type.toLowerCase()}`}>{getTypeBadge(transaction.type)}</span>
                    </td>
                    <td className="border-0 align-middle">
                      <div className="user-info">
                        <PersonCircle size={16} className="text-secondary" />
                        {transaction.fromUser === 0 ? 'Finance' : `User ${transaction.fromUser}`}
                      </div>
                    </td>
                    <td className="border-0 align-middle">
                      <div className="user-info">
                        <PersonCircle size={16} className="text-secondary" />
                        {transaction.toUser === 0 ? 'Finance' : `User ${transaction.toUser}`}
                      </div>
                    </td>
                    <td className="border-0 align-middle">
                      <span className="amount">{formatCurrency(transaction.amount)}</span>
                    </td>
                    <td className="border-0 align-middle">
                      <span className={`status-badge completed`}>{getStatusBadge(transaction.status)}</span>
                    </td>
                    <td className="border-0 align-middle">
                      <span className="text-muted">{formatDate(transaction.date)}</span>
                    </td>
                    <td className="border-0 align-middle">
                      <Button variant="link" size="sm" className="p-2" title="View Details" onClick={() => handleShowDetails(transaction)}>
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
