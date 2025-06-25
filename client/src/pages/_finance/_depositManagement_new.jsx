import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Tabs, Tab, InputGroup, Spinner } from 'react-bootstrap'
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
import DepositRequestService from '../../services/depositRequest.Service'
import StaffService from '../../services/staff.Service'

const DepositManagement = () => {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDeposit, setSelectedDeposit] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [processing, setProcessing] = useState(false)
  const [processAction, setProcessAction] = useState('')
  const [processNotes, setProcessNotes] = useState('')
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    loadDepositRequests()
  }, [])

  const loadDepositRequests = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load all deposit requests
      const allRequests = await DepositRequestService.getAllDepositRequests(null, 100)
      setDeposits(allRequests)
      
    } catch (error) {
      console.error('Failed to load deposit requests:', error)
      setError('Failed to load deposit requests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter deposits based on status and search term
  const filteredDeposits = deposits.filter(deposit => {
    const matchesStatus = filterStatus === 'All' || deposit.status === filterStatus
    const matchesSearch = deposit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { bg: 'warning', icon: <Clock size={12} className="me-1" />, text: 'Pending Review' },
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
      // Get current staff data for processing
      const staffData = StaffService.getStaffData()
      const staffId = staffData?.staffId || 'STAFF_001'
      
      if (processAction === 'approve') {
        await DepositRequestService.approveDepositRequest(selectedDeposit.id, staffId)
      } else {
        await DepositRequestService.rejectDepositRequest(selectedDeposit.id, staffId, processNotes)
      }

      // Reload deposit requests to get updated data
      await loadDepositRequests()
      
      setShowProcessModal(false)
      showAlert(
        `Deposit ${selectedDeposit.id} has been ${processAction === 'approve' ? 'approved' : 'rejected'} successfully.`,
        'success'
      )
    } catch (error) {
      console.error('Error processing deposit:', error)
      showAlert(error.message || 'Error processing deposit. Please try again.', 'danger')
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
      approved: deposits.filter(d => d.status === 'Approved').length,
      rejected: deposits.filter(d => d.status === 'Rejected').length
    }
  }

  const counts = getDepositCounts()

  if (loading) {
    return (
      <Container fluid className="px-4 py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading deposit requests...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="px-4">
      {/* Alert */}
      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="mb-4">
          {alert.message}
        </Alert>
      )}

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
            <Building size={28} className="me-2 text-success" />
            Deposit Management
          </h1>
          <p className="text-muted mb-0">
            Review, approve, and manage customer deposit requests
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-success" onClick={loadDepositRequests}>
            <Download size={16} className="me-2" />
            Refresh
          </Button>
          <Button variant="success">
            <Upload size={16} className="me-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <Row className="g-3 mb-4">
        <Col lg={3} md={6} sm={6}>
          <Card className="border-0 deposit-stat-card bg-primary text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.total}</h4>
              <small>Total Requests</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={6}>
          <Card className="border-0 deposit-stat-card bg-warning text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.pending}</h4>
              <small>Pending Review</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={6}>
          <Card className="border-0 deposit-stat-card bg-success text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.approved}</h4>
              <small>Approved</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} sm={6}>
          <Card className="border-0 deposit-stat-card bg-danger text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{counts.rejected}</h4>
              <small>Rejected</small>
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
            <Col lg={3}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col lg={5} className="text-end">
              <span className="text-muted">
                Showing {filteredDeposits.length} of {deposits.length} requests
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
          {filteredDeposits.length === 0 ? (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <p className="text-muted">No deposit requests found</p>
              <small className="text-muted">
                {deposits.length === 0 ? 'No deposit requests have been created yet' : 'Try adjusting your search filters'}
              </small>
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
                {filteredDeposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td className="border-0">
                      <div>
                        <div className="fw-semibold text-primary">{deposit.id}</div>
                        <small className="text-muted">User: {deposit.userId}</small>
                      </div>
                    </td>
                    <td className="border-0">
                      <div>
                        <div className="fw-semibold">{deposit.customerName}</div>
                        <small className="text-muted">{deposit.accountNumber}</small>
                        <Badge bg={deposit.accountType === 'business' ? 'primary' : 'secondary'} className="ms-1">
                          {deposit.accountType || 'Personal'}
                        </Badge>
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
                      <div>
                        <small className="text-muted d-block">Submitted:</small>
                        <small>{formatDate(deposit.createdAt)}</small>
                        {deposit.processedAt && (
                          <>
                            <small className="text-muted d-block">Processed:</small>
                            <small>{formatDate(deposit.processedAt)}</small>
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
          )}
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
            <div className="p-4">
              <Row className="g-4">
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-bold text-success mb-3">
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
                        <Badge bg={selectedDeposit.accountType === 'business' ? 'primary' : 'secondary'} className="ms-2">
                          {selectedDeposit.accountType || 'Personal'}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <strong>User ID:</strong> {selectedDeposit.userId}
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
                        <strong>Request ID:</strong> {selectedDeposit.id}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong> {getStatusBadge(selectedDeposit.status)}
                      </div>
                      {selectedDeposit.rejectionReason && (
                        <div className="mb-2">
                          <strong>Rejection Reason:</strong>
                          <p className="text-danger mt-1">{selectedDeposit.rejectionReason}</p>
                        </div>
                      )}
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
                        <strong>Submitted:</strong> {formatDate(selectedDeposit.createdAt)}
                      </div>
                      <div className="mb-2">
                        <strong>Processed:</strong> {formatDate(selectedDeposit.processedAt)}
                      </div>
                      {selectedDeposit.processedBy && (
                        <div className="mb-2">
                          <strong>Processed By:</strong> {selectedDeposit.processedBy}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-bold text-success mb-3">
                        <FileText size={18} className="me-2" />
                        Notes
                      </h6>
                      <div className="mb-2">
                        <strong>Customer Note:</strong>
                        <p className="text-muted mt-1">{selectedDeposit.note || 'No notes provided'}</p>
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
                    <strong>Status:</strong> {selectedDeposit.status}
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
      `}</style>
    </Container>
  )
}

export default DepositManagement
