import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Tabs, Tab, InputGroup } from 'react-bootstrap'
import { 
  Cash, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Upload,
  FileText,
  PersonCircle,
  CreditCard,
  Calendar,
  ExclamationTriangle,
  Info,
  Building,
  GraphUp,
  GraphDown,
  Printer,
  Send,
  ArrowUpCircle,
  ArrowDownCircle
} from 'react-bootstrap-icons'

const DepositManagement = () => {
  const [deposits, setDeposits] = useState([
    {
      id: 'DEP_001',
      userId: 'USR_1001',
      customerName: 'John Smith',
      accountNumber: 'ACC_****1234',
      amount: 25000.00,
      depositMethod: 'Bank Transfer',
      status: 'Pending',
      submittedDate: '2025-01-25 14:30',
      processedDate: null,
      priority: 'High',
      reference: 'REF_BT_001',
      notes: 'Salary deposit from ABC Corporation',
      attachments: ['bank_statement.pdf', 'transfer_receipt.jpg'],
      customerType: 'Personal',
      processingFee: 50.00,
      branch: 'Makati Branch'
    },
    {
      id: 'DEP_002',
      userId: 'USR_1002',
      customerName: 'Maria Garcia',
      accountNumber: 'ACC_****5678',
      amount: 15000.00,
      depositMethod: 'Check Deposit',
      status: 'Processing',
      submittedDate: '2025-01-25 13:45',
      processedDate: null,
      priority: 'Medium',
      reference: 'CHK_002',
      notes: 'Business deposit from Garcia Enterprises',
      attachments: ['check_image.jpg'],
      customerType: 'Business',
      processingFee: 75.00,
      branch: 'BGC Branch'
    },
    {
      id: 'DEP_003',
      userId: 'USR_1003',
      customerName: 'Robert Johnson',
      accountNumber: 'ACC_****9012',
      amount: 50000.00,
      depositMethod: 'Wire Transfer',
      status: 'Approved',
      submittedDate: '2025-01-25 12:15',
      processedDate: '2025-01-25 15:30',
      priority: 'High',
      reference: 'WIRE_003',
      notes: 'Investment fund deposit',
      attachments: ['wire_confirmation.pdf'],
      customerType: 'Personal',
      processingFee: 100.00,
      branch: 'Ortigas Branch'
    },
    {
      id: 'DEP_004',
      userId: 'USR_1004',
      customerName: 'Lisa Chen',
      accountNumber: 'ACC_****3456',
      amount: 8500.00,
      depositMethod: 'ATM Deposit',
      status: 'Pending',
      submittedDate: '2025-01-25 11:20',
      processedDate: null,
      priority: 'Low',
      reference: 'ATM_004',
      notes: 'Monthly savings deposit',
      attachments: ['atm_receipt.jpg'],
      customerType: 'Personal',
      processingFee: 25.00,
      branch: 'Quezon City Branch'
    },
    {
      id: 'DEP_005',
      userId: 'USR_1005',
      customerName: 'Michael Brown',
      accountNumber: 'ACC_****7890',
      amount: 35000.00,
      depositMethod: 'Online Transfer',
      status: 'Rejected',
      submittedDate: '2025-01-25 10:45',
      processedDate: '2025-01-25 16:20',
      priority: 'Medium',
      reference: 'ONL_005',
      notes: 'Insufficient verification documents',
      attachments: ['transfer_details.pdf'],
      customerType: 'Business',
      processingFee: 60.00,
      branch: 'Manila Branch'
    },
    {
      id: 'DEP_006',
      userId: 'USR_1006',
      customerName: 'Sarah Wilson',
      accountNumber: 'ACC_****2468',
      amount: 120000.00,
      depositMethod: 'Cash Deposit',
      status: 'Pending',
      submittedDate: '2025-01-25 09:15',
      processedDate: null,
      priority: 'High',
      reference: 'CASH_006',
      notes: 'Large cash deposit - requires verification',
      attachments: ['id_copy.pdf', 'source_of_funds.pdf'],
      customerType: 'Personal',
      processingFee: 200.00,
      branch: 'Makati Branch'
    }
  ])

  const [selectedDeposit, setSelectedDeposit] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [processing, setProcessing] = useState(false)
  const [processAction, setProcessAction] = useState('')
  const [processNotes, setProcessNotes] = useState('')
  const [alert, setAlert] = useState(null)

  // Filter deposits based on status, priority, and search term
  const filteredDeposits = deposits.filter(deposit => {
    const matchesStatus = filterStatus === 'All' || deposit.status === filterStatus
    const matchesPriority = filterPriority === 'All' || deposit.priority === filterPriority
    const matchesSearch = deposit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { bg: 'warning', icon: <Clock size={12} className="me-1" />, text: 'Pending Review' },
      Processing: { bg: 'primary', icon: <ArrowUpCircle size={12} className="me-1" />, text: 'Processing' },
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
      High: { bg: 'danger', text: 'High Priority', icon: <ExclamationTriangle size={12} className="me-1" /> },
      Medium: { bg: 'warning', text: 'Medium Priority', icon: <Info size={12} className="me-1" /> },
      Low: { bg: 'secondary', text: 'Low Priority', icon: <ArrowDownCircle size={12} className="me-1" /> }
    }

    const config = priorityConfig[priority] || { bg: 'secondary', text: priority, icon: null }
    return (
      <Badge bg={config.bg} className="d-flex align-items-center">
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const handleViewDeposit = (deposit) => {
    setSelectedDeposit(deposit)
    setShowDetailModal(true)
  }

  const handleProcessDeposit = (deposit, action) => {
    setSelectedDeposit(deposit)
    setProcessAction(action)
    setProcessNotes('')
    setShowProcessModal(true)
  }

  const confirmProcessDeposit = async () => {
    setProcessing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update deposit status
      setDeposits(prevDeposits =>
        prevDeposits.map(deposit =>
          deposit.id === selectedDeposit.id
            ? {
                ...deposit,
                status: processAction === 'approve' ? 'Approved' : 'Rejected',
                processedDate: new Date().toISOString(),
                notes: processNotes || deposit.notes
              }
            : deposit
        )
      )

      setShowProcessModal(false)
      showAlert(
        `Deposit ${selectedDeposit.id} has been ${processAction === 'approve' ? 'approved' : 'rejected'} successfully.`,
        'success'
      )
    } catch (error) {
      showAlert('Error processing deposit. Please try again.', 'danger')
    } finally {
      setProcessing(false)
    }
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

  const getDepositCounts = () => {
    return {
      total: deposits.length,
      pending: deposits.filter(d => d.status === 'Pending').length,
      processing: deposits.filter(d => d.status === 'Processing').length,
      approved: deposits.filter(d => d.status === 'Approved').length,
      rejected: deposits.filter(d => d.status === 'Rejected').length
    }
  }

  const counts = getDepositCounts()

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
            <Building size={28} className="me-2 text-success" />
            Deposit Management
          </h1>
          <p className="text-muted mb-0">
            Review, approve, and manage customer deposit requests
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-success">
            <Download size={16} className="me-2" />
            Export Report
          </Button>
          <Button variant="success">
            <Upload size={16} className="me-2" />
            Bulk Process
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <Row className="g-3 mb-4">
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 deposit-stat-card bg-primary text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.total}</h4>
              <small>Total Deposits</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 deposit-stat-card bg-warning text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.pending}</h4>
              <small>Pending Review</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 deposit-stat-card bg-info text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.processing}</h4>
              <small>Processing</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 deposit-stat-card bg-success text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.approved}</h4>
              <small>Approved</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 deposit-stat-card bg-danger text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.rejected}</h4>
              <small>Rejected</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 deposit-stat-card bg-secondary text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{formatCurrency(deposits.reduce((sum, d) => sum + d.amount, 0))}</h4>
              <small>Total Value</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="border-0 deposit-card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col lg={4}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by customer name, account, or deposit ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={2}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col lg={2}>
              <Form.Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="All">All Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </Form.Select>
            </Col>
            <Col lg={4} className="text-end">
              <span className="text-muted">
                Showing {filteredDeposits.length} of {deposits.length} deposits
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Deposits Table */}
      <Card className="border-0 deposit-card">
        <Card.Header className="bg-transparent border-bottom-0 pb-0">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            <FileText size={20} className="me-2 text-success" />
            Deposit Requests
          </h5>
        </Card.Header>
        <Card.Body className="pt-3">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th className="border-0 text-muted fw-semibold">Deposit Info</th>
                <th className="border-0 text-muted fw-semibold">Customer</th>
                <th className="border-0 text-muted fw-semibold">Amount</th>
                <th className="border-0 text-muted fw-semibold">Method</th>
                <th className="border-0 text-muted fw-semibold">Status</th>
                <th className="border-0 text-muted fw-semibold">Priority</th>
                <th className="border-0 text-muted fw-semibold">Date</th>
                <th className="border-0 text-muted fw-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td className="border-0">
                    <div>
                      <div className="fw-semibold text-primary">{deposit.id}</div>
                      <small className="text-muted">{deposit.reference}</small>
                    </div>
                  </td>
                  <td className="border-0">
                    <div>
                      <div className="fw-semibold">{deposit.customerName}</div>
                      <small className="text-muted">{deposit.accountNumber}</small>
                      <Badge bg={deposit.customerType === 'Business' ? 'primary' : 'secondary'} className="ms-1">
                        {deposit.customerType}
                      </Badge>
                    </div>
                  </td>
                  <td className="border-0">
                    <div className="fw-bold text-success fs-6">
                      {formatCurrency(deposit.amount)}
                    </div>
                  </td>
                  <td className="border-0">
                    <span className="text-muted">{deposit.depositMethod}</span>
                  </td>
                  <td className="border-0">
                    {getStatusBadge(deposit.status)}
                  </td>
                  <td className="border-0">
                    {getPriorityBadge(deposit.priority)}
                  </td>
                  <td className="border-0">
                    <div>
                      <small className="text-muted d-block">Submitted:</small>
                      <small>{formatDate(deposit.submittedDate)}</small>
                      {deposit.processedDate && (
                        <>
                          <small className="text-muted d-block">Processed:</small>
                          <small>{formatDate(deposit.processedDate)}</small>
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
                        onClick={() => handleViewDeposit(deposit)}
                      >
                        <Eye size={14} />
                      </Button>
                      {deposit.status === 'Pending' && (
                        <>
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="p-2"
                            title="Approve Deposit"
                            onClick={() => handleProcessDeposit(deposit, 'approve')}
                          >
                            <CheckCircle size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="p-2"
                            title="Reject Deposit"
                            onClick={() => handleProcessDeposit(deposit, 'reject')}
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

      {/* Deposit Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fw-bold">
            <Eye size={24} className="me-2" />
            Deposit Details - {selectedDeposit?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedDeposit && (
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
                        <Card.Body>                          <h6 className="fw-bold text-success mb-3">
                            <PersonCircle size={18} className="me-2" />
                            Customer Information
                          </h6>
                          <div className="mb-2">
                            <strong>Name:</strong> {selectedDeposit.customerName}
                          </div>
                          <div className="mb-2">
                            <strong>Account:</strong> {selectedDeposit.accountNumber}
                          </div>
                          <div className="mb-2">
                            <strong>Type:</strong> 
                            <Badge bg={selectedDeposit.customerType === 'Business' ? 'primary' : 'secondary'} className="ms-2">
                              {selectedDeposit.customerType}
                            </Badge>
                          </div>
                          <div className="mb-2">
                            <strong>Branch:</strong> {selectedDeposit.branch}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-bold text-success mb-3">
                            <CreditCard size={18} className="me-2" />
                            Deposit Information
                          </h6>
                          <div className="mb-2">
                            <strong>Amount:</strong> 
                            <span className="fs-5 fw-bold text-success ms-2">
                              {formatCurrency(selectedDeposit.amount)}
                            </span>
                          </div>
                          <div className="mb-2">
                            <strong>Method:</strong> {selectedDeposit.depositMethod}
                          </div>
                          <div className="mb-2">
                            <strong>Reference:</strong> {selectedDeposit.reference}
                          </div>
                          <div className="mb-2">
                            <strong>Processing Fee:</strong> {formatCurrency(selectedDeposit.processingFee)}
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
                            <strong>Submitted:</strong> {formatDate(selectedDeposit.submittedDate)}
                          </div>
                          <div className="mb-2">
                            <strong>Processed:</strong> {formatDate(selectedDeposit.processedDate)}
                          </div>
                          <div className="mb-2">
                            <strong>Status:</strong> {getStatusBadge(selectedDeposit.status)}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-bold text-success mb-3">
                            <ExclamationTriangle size={18} className="me-2" />
                            Priority & Notes
                          </h6>
                          <div className="mb-2">
                            <strong>Priority:</strong> {getPriorityBadge(selectedDeposit.priority)}
                          </div>
                          <div className="mb-2">
                            <strong>Notes:</strong>
                            <p className="text-muted mt-1">{selectedDeposit.notes}</p>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Tab>
              
              <Tab eventKey="attachments" title={
                <span>
                  <FileText size={16} className="me-2" />
                  Attachments ({selectedDeposit.attachments?.length || 0})
                </span>
              }>
                <div className="p-3">
                  <h6 className="fw-bold mb-3">Submitted Documents</h6>
                  {selectedDeposit.attachments && selectedDeposit.attachments.length > 0 ? (
                    <div className="row g-3">
                      {selectedDeposit.attachments.map((attachment, index) => (
                        <div key={index} className="col-md-6">
                          <Card className="border">
                            <Card.Body className="d-flex align-items-center">
                              <FileText size={24} className="text-primary me-3" />
                              <div className="flex-grow-1">
                                <div className="fw-semibold">{attachment}</div>
                                <small className="text-muted">Document {index + 1}</small>
                              </div>
                              <Button variant="outline-primary" size="sm">
                                <Download size={14} />
                              </Button>
                            </Card.Body>
                          </Card>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <FileText size={48} className="text-muted mb-3" />
                      <p className="text-muted">No attachments available</p>
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
          <Button variant="outline-primary">
            <Printer size={16} className="me-2" />
            Print
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Process Deposit Modal */}
      <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)} centered>
        <Modal.Header closeButton className={`text-white ${processAction === 'approve' ? 'bg-success' : 'bg-danger'}`}>
          <Modal.Title className="fw-bold">
            {processAction === 'approve' ? (
              <>
                <CheckCircle size={24} className="me-2" />
                Approve Deposit
              </>
            ) : (
              <>
                <XCircle size={24} className="me-2" />
                Reject Deposit
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDeposit && (
            <div>
              <div className="bg-light rounded p-3 mb-3">
                <div className="row g-2">
                  <div className="col-6">
                    <strong>Deposit ID:</strong> {selectedDeposit.id}
                  </div>
                  <div className="col-6">
                    <strong>Customer:</strong> {selectedDeposit.customerName}
                  </div>
                  <div className="col-6">
                    <strong>Amount:</strong> {formatCurrency(selectedDeposit.amount)}
                  </div>
                  <div className="col-6">
                    <strong>Method:</strong> {selectedDeposit.depositMethod}
                  </div>
                </div>
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  {processAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={processAction === 'approve' ? 
                    'Add any additional notes for approval...' : 
                    'Please provide a reason for rejection...'
                  }
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  required={processAction === 'reject'}
                />
              </Form.Group>

              <div className={`alert ${processAction === 'approve' ? 'alert-success' : 'alert-danger'}`}>
                <strong>
                  {processAction === 'approve' ? 'Confirm Approval:' : 'Confirm Rejection:'}
                </strong>
                <p className="mb-0 mt-1">
                  {processAction === 'approve' ? 
                    'The deposit will be approved and funds will be credited to the customer account.' :
                    'The deposit will be rejected and the customer will be notified with the provided reason.'
                  }
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowProcessModal(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            variant={processAction === 'approve' ? 'success' : 'danger'}
            onClick={confirmProcessDeposit}
            disabled={processing || (processAction === 'reject' && !processNotes.trim())}
          >
            {processing ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status" />
                Processing...
              </>
            ) : (
              <>
                {processAction === 'approve' ? (
                  <>
                    <CheckCircle size={16} className="me-2" />
                    Approve Deposit
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="me-2" />
                    Reject Deposit
                  </>
                )}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style>{`
        .deposit-stat-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .deposit-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .deposit-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          transition: all 0.3s ease;
        }

        .deposit-card:hover {
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

        .nav-pills .nav-link {
          border-radius: 8px;
          font-weight: 500;
          margin-right: 0.5rem;
        }

        .nav-pills .nav-link.active {
          background-color: #28a745;
        }
      `}</style>
    </Container>
  )
}

export default DepositManagement