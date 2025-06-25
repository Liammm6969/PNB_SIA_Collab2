import React, { useState, useEffect } from 'react'
import { Container, Card, Button, Table, Badge, Modal, Form, Alert, InputGroup, Spinner } from 'react-bootstrap'
import { 
  Cash, 
  Search, 
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
  Building,
  Printer
} from 'react-bootstrap-icons'
import { TextField } from '@mui/material'
import DepositRequestService from '../../services/depositRequest.Service'
import StaffService from '../../services/staff.Service'
import '../../styles/financeStyles/depositManagement.css'

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
      <div className="deposit-mgmt-header">
        <div className="deposit-mgmt-header-left">
          <div className="deposit-mgmt-header-icon">
            <FileText size={28} className="text-white" />
          </div>
          <div>
            <div className="deposit-mgmt-header-title">Deposit Management</div>
            <div className="deposit-mgmt-header-subtitle">Review, approve, and manage customer deposit requests</div>
          </div>
        </div>
        <div className="deposit-mgmt-header-actions">
          <Button
            className="finance-dashboard-btn refresh"
            onClick={loadDepositRequests}
            disabled={loading}
          >
            <Clock size={16} className={`me-2${loading ? ' spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="success">
            <Download size={16} className="me-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="finance-stat-grid mb-4">
        <div className="finance-stat-card finance-stat-card-info">
          <div className="stat-label">Total Requests</div>
          <div className="stat-value">{counts.total}</div>
        </div>
        <div className="finance-stat-card finance-stat-card-warning">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value">{counts.pending}</div>
        </div>
        <div className="finance-stat-card finance-stat-card-success">
          <div className="stat-label">Approved</div>
          <div className="stat-value">{counts.approved}</div>
        </div>
        <div className="finance-stat-card finance-stat-card-danger">
          <div className="stat-label">Rejected</div>
          <div className="stat-value">{counts.rejected}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="deposit-mgmt-filter-card mb-4">
        <div className="deposit-mgmt-search">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by customer name or request ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search size={16} style={{ marginRight: 8, color: '#6b7280' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#f9fafb',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.2)',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e5e7eb',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d5db',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#22c55e',
              },
            }}
          />
        </div>
        <div className="deposit-mgmt-status">
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
        </div>
        <div className="deposit-mgmt-count">
          Showing {filteredDeposits.length} of {deposits.length} requests
        </div>
      </div>

      {/* Deposits Table */}
      <div className="deposit-mgmt-table-card">
        <div className="px-4 pt-4 pb-0">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            <FileText size={20} className="me-2 text-success" />
            Deposit Requests
          </h5>
        </div>
        <div className="pt-3 px-4">
          {filteredDeposits.length === 0 ? (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <p className="text-muted">No deposit requests found</p>
              <small className="text-muted">
                {deposits.length === 0 ? 'No deposit requests have been created yet' : 'Try adjusting your search filters'}
              </small>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table deposit-mgmt-table align-middle mb-0">
                <thead>
                  <tr>
                    <th className="border-0">REQUEST ID</th>
                    <th className="border-0">CUSTOMER</th>
                    <th className="border-0">AMOUNT</th>
                    <th className="border-0">STATUS</th>
                    <th className="border-0">DATE</th>
                    <th className="border-0">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeposits.map((deposit) => (
                    <tr key={deposit.id}>
                      <td className="border-0 align-middle">
                        <a href="#" className="deposit-id-link fw-semibold">{deposit.id}</a>
                        <div className="text-muted small">User: {deposit.userId}</div>
                      </td>
                      <td className="border-0 align-middle">
                        <div className="fw-semibold">{deposit.customerName}</div>
                        <div className="text-muted small">{deposit.accountNumber} <span className="account-type-badge">{deposit.accountType || 'personal'}</span></div>
                      </td>
                      <td className="border-0 align-middle">
                        <span className="text-success fw-bold">{formatCurrency(deposit.amount)}</span>
                      </td>
                      <td className="border-0 align-middle">
                        {deposit.status === 'Approved' && <span className="status-badge status-badge-approved">Approved</span>}
                        {deposit.status === 'Rejected' && <span className="status-badge status-badge-rejected">Rejected</span>}
                        {deposit.status === 'Pending' && <span className="status-badge status-badge-pending">Pending</span>}
                      </td>
                      <td className="border-0 align-middle">
                        <div className="small text-muted">Submitted:</div>
                        <div className="small">{formatDate(deposit.createdAt)}</div>
                        {deposit.processedAt && (
                          <>
                            <div className="small text-muted mt-1">Processed:</div>
                            <div className="small">{formatDate(deposit.processedAt)}</div>
                          </>
                        )}
                      </td>
                      <td className="border-0 align-middle">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-2 view-btn"
                          title="View Details"
                          onClick={() => handleViewDeposit(deposit)}
                        >
                          <Eye size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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
              <div className="row g-4">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
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
                </div>
              </div>
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
    </Container>
  )
}

export default DepositManagement
