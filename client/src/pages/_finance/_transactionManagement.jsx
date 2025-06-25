import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, InputGroup, Tabs, Tab } from 'react-bootstrap'
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
  ExclamationTriangle,
  Info,
  GraphUp,
  Printer,
  Send,
  Flag,
  Shield
} from 'react-bootstrap-icons'

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN_001',
      depositId: 'DEP_001',
      customerId: 'USR_1001',
      customerName: 'John Smith',
      accountNumber: 'ACC_****1234',
      transactionType: 'Deposit',
      amount: 25000.00,
      fee: 50.00,
      netAmount: 24950.00,
      method: 'Bank Transfer',
      status: 'Completed',
      priority: 'High',
      branch: 'Makati Branch',
      processedBy: 'Finance Staff 001',
      submittedDate: '2025-01-25 14:30',
      processedDate: '2025-01-25 15:45',
      reference: 'REF_BT_001',
      description: 'Salary deposit from ABC Corporation',
      riskLevel: 'Low',
      flags: []
    },
    {
      id: 'TXN_002',
      depositId: 'DEP_006',
      customerId: 'USR_1006',
      customerName: 'Sarah Wilson',
      accountNumber: 'ACC_****2468',
      transactionType: 'Deposit',
      amount: 120000.00,
      fee: 200.00,
      netAmount: 119800.00,
      method: 'Cash Deposit',
      status: 'Under Review',
      priority: 'High',
      branch: 'Makati Branch',
      processedBy: 'Finance Manager',
      submittedDate: '2025-01-25 09:15',
      processedDate: null,
      reference: 'CASH_006',
      description: 'Large cash deposit - requires verification',
      riskLevel: 'High',
      flags: ['Large Amount', 'Cash Transaction', 'Enhanced Due Diligence']
    },
    {
      id: 'TXN_003',
      depositId: 'DEP_002',
      customerId: 'USR_1002',
      customerName: 'Maria Garcia',
      accountNumber: 'ACC_****5678',
      transactionType: 'Deposit',
      amount: 15000.00,
      fee: 75.00,
      netAmount: 14925.00,
      method: 'Check Deposit',
      status: 'Processing',
      priority: 'Medium',
      branch: 'BGC Branch',
      processedBy: 'Finance Staff 002',
      submittedDate: '2025-01-25 13:45',
      processedDate: null,
      reference: 'CHK_002',
      description: 'Business deposit from Garcia Enterprises',
      riskLevel: 'Medium',
      flags: ['Business Account']
    },
    {
      id: 'TXN_004',
      depositId: 'DEP_003',
      customerId: 'USR_1003',
      customerName: 'Robert Johnson',
      accountNumber: 'ACC_****9012',
      transactionType: 'Deposit',
      amount: 50000.00,
      fee: 100.00,
      netAmount: 49900.00,
      method: 'Wire Transfer',
      status: 'Completed',
      priority: 'High',
      branch: 'Ortigas Branch',
      processedBy: 'Finance Staff 003',
      submittedDate: '2025-01-25 12:15',
      processedDate: '2025-01-25 15:30',
      reference: 'WIRE_003',
      description: 'Investment fund deposit',
      riskLevel: 'Low',
      flags: []
    },
    {
      id: 'TXN_005',
      depositId: 'DEP_005',
      customerId: 'USR_1005',
      customerName: 'Michael Brown',
      accountNumber: 'ACC_****7890',
      transactionType: 'Deposit',
      amount: 35000.00,
      fee: 60.00,
      netAmount: 34940.00,
      method: 'Online Transfer',
      status: 'Failed',
      priority: 'Medium',
      branch: 'Manila Branch',
      processedBy: 'Finance Staff 001',
      submittedDate: '2025-01-25 10:45',
      processedDate: '2025-01-25 16:20',
      reference: 'ONL_005',
      description: 'Insufficient verification documents',
      riskLevel: 'Medium',
      flags: ['Verification Failed', 'Documentation Issue']
    },
    {
      id: 'TXN_006',
      depositId: 'DEP_004',
      customerId: 'USR_1004',
      customerName: 'Lisa Chen',
      accountNumber: 'ACC_****3456',
      transactionType: 'Deposit',
      amount: 8500.00,
      fee: 25.00,
      netAmount: 8475.00,
      method: 'ATM Deposit',
      status: 'Pending',
      priority: 'Low',
      branch: 'Quezon City Branch',
      processedBy: null,
      submittedDate: '2025-01-25 11:20',
      processedDate: null,
      reference: 'ATM_004',
      description: 'Monthly savings deposit',
      riskLevel: 'Low',
      flags: []
    }
  ])

  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterRisk, setFilterRisk] = useState('All')
  const [filterBranch, setFilterBranch] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [alert, setAlert] = useState(null)

  const [transactionStats] = useState({
    totalTransactions: 1456,
    completedToday: 89,
    pendingReview: 23,
    flaggedTransactions: 12,
    totalVolume: 8750000.00,
    averageAmount: 28500.00,
    processingTime: '2.4 hours',
    successRate: 94.2
  })

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = filterStatus === 'All' || transaction.status === filterStatus
    const matchesRisk = filterRisk === 'All' || transaction.riskLevel === filterRisk
    const matchesBranch = filterBranch === 'All' || transaction.branch === filterBranch
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesRisk && matchesBranch && matchesSearch
  })

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Completed: { bg: 'success', icon: <CheckCircle size={12} className="me-1" />, text: 'Completed' },
      Processing: { bg: 'primary', icon: <ArrowUpCircle size={12} className="me-1" />, text: 'Processing' },
      Pending: { bg: 'warning', icon: <Clock size={12} className="me-1" />, text: 'Pending' },
      'Under Review': { bg: 'info', icon: <Eye size={12} className="me-1" />, text: 'Under Review' },
      Failed: { bg: 'danger', icon: <XCircle size={12} className="me-1" />, text: 'Failed' }
    }

    const config = statusConfig[status] || { bg: 'secondary', icon: null, text: status }
    return (
      <Badge bg={config.bg} className="d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const getRiskBadge = (riskLevel) => {
    const riskConfig = {
      Low: { bg: 'success', icon: <Shield size={12} className="me-1" />, text: 'Low Risk' },
      Medium: { bg: 'warning', icon: <Info size={12} className="me-1" />, text: 'Medium Risk' },
      High: { bg: 'danger', icon: <ExclamationTriangle size={12} className="me-1" />, text: 'High Risk' }
    }

    const config = riskConfig[riskLevel] || { bg: 'secondary', icon: null, text: riskLevel }
    return (
      <Badge bg={config.bg} className="d-flex align-items-center">
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailModal(true)
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

  const getTransactionCounts = () => {
    return {
      total: transactions.length,
      completed: transactions.filter(t => t.status === 'Completed').length,
      processing: transactions.filter(t => t.status === 'Processing').length,
      pending: transactions.filter(t => t.status === 'Pending').length,
      underReview: transactions.filter(t => t.status === 'Under Review').length,
      failed: transactions.filter(t => t.status === 'Failed').length
    }
  }

  const counts = getTransactionCounts()

  return (
    <Container fluid className="px-4">
      {/* Alert */}
      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="mb-4">
          {alert.message}
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
            Monitor and manage all financial transactions and deposits
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-success">
            <Download size={16} className="me-2" />
            Export Transactions
          </Button>
          <Button variant="success">
            <Upload size={16} className="me-2" />
            Bulk Operations
          </Button>
        </div>
      </div>

      {/* Transaction Statistics */}
      <Row className="g-3 mb-4">
        <Col xl={3} md={6}>
          <Card className="border-0 transaction-stat-card bg-primary text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{transactionStats.totalTransactions}</h4>
              <small>Total Transactions</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="border-0 transaction-stat-card bg-success text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{transactionStats.completedToday}</h4>
              <small>Completed Today</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="border-0 transaction-stat-card bg-warning text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{transactionStats.pendingReview}</h4>
              <small>Pending Review</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="border-0 transaction-stat-card bg-danger text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{transactionStats.flaggedTransactions}</h4>
              <small>Flagged</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="border-0 transaction-card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col lg={3}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={2}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Failed">Failed</option>
              </Form.Select>
            </Col>
            <Col lg={2}>
              <Form.Select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </Form.Select>
            </Col>
            <Col lg={2}>
              <Form.Select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                <option value="All">All Branches</option>
                <option value="Makati Branch">Makati Branch</option>
                <option value="BGC Branch">BGC Branch</option>
                <option value="Ortigas Branch">Ortigas Branch</option>
                <option value="Quezon City Branch">Quezon City Branch</option>
                <option value="Manila Branch">Manila Branch</option>
              </Form.Select>
            </Col>
            <Col lg={3} className="text-end">
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
            Transaction Records
          </h5>
        </Card.Header>
        <Card.Body className="pt-3">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th className="border-0 text-muted fw-semibold">Transaction ID</th>
                <th className="border-0 text-muted fw-semibold">Customer</th>
                <th className="border-0 text-muted fw-semibold">Amount</th>
                <th className="border-0 text-muted fw-semibold">Method</th>
                <th className="border-0 text-muted fw-semibold">Status</th>
                <th className="border-0 text-muted fw-semibold">Risk Level</th>
                <th className="border-0 text-muted fw-semibold">Branch</th>
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
                      <small className="text-muted">{transaction.reference}</small>
                      {transaction.flags.length > 0 && (
                        <div className="mt-1">
                          <Flag size={12} className="text-warning me-1" />
                          <small className="text-warning">{transaction.flags.length} flag(s)</small>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="border-0">
                    <div>
                      <div className="fw-semibold">{transaction.customerName}</div>
                      <small className="text-muted">{transaction.accountNumber}</small>
                    </div>
                  </td>
                  <td className="border-0">
                    <div>
                      <div className="fw-bold text-success">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <small className="text-muted">
                        Fee: {formatCurrency(transaction.fee)}
                      </small>
                    </div>
                  </td>
                  <td className="border-0">
                    <span className="text-muted">{transaction.method}</span>
                  </td>
                  <td className="border-0">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="border-0">
                    {getRiskBadge(transaction.riskLevel)}
                  </td>
                  <td className="border-0">
                    <small className="text-muted">{transaction.branch}</small>
                  </td>
                  <td className="border-0">
                    <div>
                      <small className="text-muted d-block">Submitted:</small>
                      <small>{formatDate(transaction.submittedDate)}</small>
                      {transaction.processedDate && (
                        <>
                          <small className="text-muted d-block">Processed:</small>
                          <small>{formatDate(transaction.processedDate)}</small>
                        </>
                      )}
                    </div>
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
                      {transaction.flags.length > 0 && (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="p-2"
                          title="Review Flags"
                        >
                          <Flag size={14} />
                        </Button>
                      )}
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="p-2"
                        title="Print"
                      >
                        <Printer size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-5">
              <CreditCard size={48} className="text-muted mb-3" />
              <h6 className="text-muted">No transactions found</h6>
              <p className="text-muted">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Transaction Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fw-bold">
            <CreditCard size={24} className="me-2" />
            Transaction Details - {selectedTransaction?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedTransaction && (
            <Tabs defaultActiveKey="details" className="nav-pills p-3">
              <Tab eventKey="details" title={
                <span>
                  <Info size={16} className="me-2" />
                  Details
                </span>
              }>
                <div className="p-3">
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
                            <strong>Deposit ID:</strong> {selectedTransaction.depositId}
                          </div>
                          <div className="mb-2">
                            <strong>Reference:</strong> {selectedTransaction.reference}
                          </div>
                          <div className="mb-2">
                            <strong>Type:</strong> {selectedTransaction.transactionType}
                          </div>
                          <div className="mb-2">
                            <strong>Method:</strong> {selectedTransaction.method}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-bold text-success mb-3">
                            <Cash size={18} className="me-2" />
                            Amount Details
                          </h6>
                          <div className="mb-2">
                            <strong>Amount:</strong> 
                            <span className="fs-5 fw-bold text-success ms-2">
                              {formatCurrency(selectedTransaction.amount)}
                            </span>
                          </div>
                          <div className="mb-2">
                            <strong>Processing Fee:</strong> {formatCurrency(selectedTransaction.fee)}
                          </div>
                          <div className="mb-2">
                            <strong>Net Amount:</strong> 
                            <span className="fw-bold text-primary ms-2">
                              {formatCurrency(selectedTransaction.netAmount)}
                            </span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-bold text-success mb-3">
                            <Building size={18} className="me-2" />
                            Processing Details
                          </h6>
                          <div className="mb-2">
                            <strong>Status:</strong> {getStatusBadge(selectedTransaction.status)}
                          </div>
                          <div className="mb-2">
                            <strong>Risk Level:</strong> {getRiskBadge(selectedTransaction.riskLevel)}
                          </div>
                          <div className="mb-2">
                            <strong>Branch:</strong> {selectedTransaction.branch}
                          </div>
                          <div className="mb-2">
                            <strong>Processed By:</strong> {selectedTransaction.processedBy || 'N/A'}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-bold text-success mb-3">
                            <Calendar size={18} className="me-2" />
                            Timeline
                          </h6>
                          <div className="mb-2">
                            <strong>Submitted:</strong> {formatDate(selectedTransaction.submittedDate)}
                          </div>
                          <div className="mb-2">
                            <strong>Processed:</strong> {formatDate(selectedTransaction.processedDate)}
                          </div>
                          <div className="mb-2">
                            <strong>Description:</strong>
                            <p className="text-muted mt-1">{selectedTransaction.description}</p>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Tab>
              
              <Tab eventKey="flags" title={
                <span>
                  <Flag size={16} className="me-2" />
                  Flags ({selectedTransaction.flags?.length || 0})
                </span>
              }>
                <div className="p-3">
                  <h6 className="fw-bold mb-3">Transaction Flags</h6>
                  {selectedTransaction.flags && selectedTransaction.flags.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTransaction.flags.map((flag, index) => (
                        <div key={index} className="p-3 border rounded bg-warning bg-opacity-10">
                          <div className="d-flex align-items-center">
                            <ExclamationTriangle size={20} className="text-warning me-2" />
                            <div>
                              <div className="fw-semibold">{flag}</div>
                              <small className="text-muted">Flagged for review</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Shield size={48} className="text-success mb-3" />
                      <p className="text-muted">No flags on this transaction</p>
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button variant="outline-success">
            <Download size={16} className="me-2" />
            Download Receipt
          </Button>
          <Button variant="outline-primary">
            <Printer size={16} className="me-2" />
            Print
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

        .btn-outline-success:hover {
          background-color: #28a745;
          border-color: #28a745;
        }

        .btn-outline-danger:hover {
          background-color: #dc3545;
          border-color: #dc3545;
        }

        .btn-outline-info:hover {
          background-color: #17a2b8;
          border-color: #17a2b8;
        }

        .btn-outline-warning:hover {
          background-color: #ffc107;
          border-color: #ffc107;
        }

        .nav-pills .nav-link {
          border-radius: 8px;
          font-weight: 500;
          margin-right: 0.5rem;
        }

        .nav-pills .nav-link.active {
          background-color: #28a745;
        }

        .space-y-3 > * + * {
          margin-top: 1rem;
        }
      `}</style>
    </Container>
  )
}

export default TransactionManagement