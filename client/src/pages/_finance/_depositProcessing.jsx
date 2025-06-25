import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, InputGroup, Spinner } from 'react-bootstrap'
import { 
  Cash, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Send,
  CreditCard,
  PersonCircle,
  ExclamationTriangle,
  ArrowRightCircle,
  Building,
  Calendar,
  FileText
} from 'react-bootstrap-icons'

const DepositProcessing = () => {
  const [deposits, setDeposits] = useState([
    {
      id: 'DEP_001',
      userId: 'USR_1001',
      userIdSeq: 1001,
      customerName: 'John Smith',
      accountNumber: 'ACC_****1234',
      fullAccountNumber: 'ACC_123456789012',
      amount: 25000.00,
      depositMethod: 'Bank Transfer',
      status: 'Approved',
      submittedDate: '2025-01-25 14:30',
      approvedDate: '2025-01-25 15:45',
      priority: 'High',
      reference: 'REF_BT_001',
      notes: 'Salary deposit from ABC Corporation - Approved for processing',
      customerType: 'Personal',
      processingFee: 50.00
    },
    {
      id: 'DEP_003',
      userId: 'USR_1003',
      userIdSeq: 1003,
      customerName: 'Robert Johnson',
      accountNumber: 'ACC_****9012',
      fullAccountNumber: 'ACC_901234567890',
      amount: 50000.00,
      depositMethod: 'Wire Transfer',
      status: 'Approved',
      submittedDate: '2025-01-25 12:15',
      approvedDate: '2025-01-25 15:30',
      priority: 'High',
      reference: 'WIRE_003',
      notes: 'Investment fund deposit - Verified and approved',
      customerType: 'Personal',
      processingFee: 100.00
    },
    {
      id: 'DEP_007',
      userId: 'USR_1007',
      userIdSeq: 1007,
      customerName: 'Amanda Williams',
      accountNumber: 'ACC_****3579',
      fullAccountNumber: 'ACC_357913579135',
      amount: 75000.00,
      depositMethod: 'Check Deposit',
      status: 'Approved',
      submittedDate: '2025-01-25 10:20',
      approvedDate: '2025-01-25 14:15',
      priority: 'High',
      reference: 'CHK_007',
      notes: 'Business revenue deposit - All documents verified',
      customerType: 'Business',
      processingFee: 150.00
    },
    {
      id: 'DEP_008',
      userId: 'USR_1008',
      userIdSeq: 1008,
      customerName: 'Carlos Rodriguez',
      accountNumber: 'ACC_****8642',
      fullAccountNumber: 'ACC_864286428642',
      amount: 12000.00,
      depositMethod: 'Online Transfer',
      status: 'Approved',
      submittedDate: '2025-01-25 11:45',
      approvedDate: '2025-01-25 16:20',
      priority: 'Medium',
      reference: 'ONL_008',
      notes: 'Freelance income deposit - Ready for processing',
      customerType: 'Personal',
      processingFee: 60.00
    },
    {
      id: 'DEP_009',
      userId: 'USR_1009',
      userIdSeq: 1009,
      customerName: 'Jennifer Lee',
      accountNumber: 'ACC_****7531',
      fullAccountNumber: 'ACC_753175317531',
      amount: 30000.00,
      depositMethod: 'Cash Deposit',
      status: 'Approved',
      submittedDate: '2025-01-25 09:30',
      approvedDate: '2025-01-25 13:45',
      priority: 'Medium',
      reference: 'CASH_009',
      notes: 'Monthly savings deposit - Approved after verification',
      customerType: 'Personal',
      processingFee: 75.00
    }
  ])

  const [selectedDeposit, setSelectedDeposit] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [processing, setProcessing] = useState(false)
  const [alert, setAlert] = useState(null)

  // Filter only approved deposits that haven't been processed yet
  const filteredDeposits = deposits.filter(deposit => {
    const isApproved = deposit.status === 'Approved'
    const matchesSearch = deposit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.reference.toLowerCase().includes(searchTerm.toLowerCase())
    
    return isApproved && matchesSearch
  })

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
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

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      High: { bg: 'danger', text: 'High Priority', icon: <ExclamationTriangle size={12} className="me-1" /> },
      Medium: { bg: 'warning', text: 'Medium Priority', icon: <Clock size={12} className="me-1" /> },
      Low: { bg: 'secondary', text: 'Low Priority', icon: <CheckCircle size={12} className="me-1" /> }
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

  const handleProcessDeposit = (deposit) => {
    setSelectedDeposit(deposit)
    setShowProcessModal(true)
  }

  const confirmProcessDeposit = async () => {
    if (!selectedDeposit) return
    
    setProcessing(true)
    
    try {
      // Call the actual deposit API to credit money to user account
      const response = await fetch('/api/Philippine-National-Bank/payments/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedDeposit.userIdSeq,
          amount: selectedDeposit.amount,
          details: `Deposit processing for ${selectedDeposit.reference} - ${selectedDeposit.depositMethod}`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process deposit')
      }

      const result = await response.json()

      // Update deposit status to 'Processed'
      setDeposits(prevDeposits =>
        prevDeposits.filter(deposit => deposit.id !== selectedDeposit.id)
      )

      setShowProcessModal(false)
      showAlert(
        `Deposit ${selectedDeposit.id} of ${formatCurrency(selectedDeposit.amount)} has been successfully processed and credited to ${selectedDeposit.customerName}'s account. New balance: ${formatCurrency(result.newBalance)}`,
        'success'
      )
    } catch (error) {
      console.error('Error processing deposit:', error)
      showAlert(`Error processing deposit: ${error.message}`, 'danger')
    } finally {
      setProcessing(false)
    }
  }

  const getTotalValue = () => {
    return filteredDeposits.reduce((sum, deposit) => sum + deposit.amount, 0)
  }

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
            <ArrowRightCircle size={28} className="me-2 text-success" />
            Deposit Processing
          </h1>
          <p className="text-muted mb-0">
            Process approved deposits and credit funds to customer accounts
          </p>
        </div>
        <div className="d-flex gap-2">
          <Card className="border-0 bg-success text-white px-3 py-2">
            <div className="d-flex align-items-center">
              <Cash size={20} className="me-2" />
              <div>
                <small className="opacity-75">Ready to Process</small>
                <div className="fw-bold">{formatCurrency(getTotalValue())}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <Row className="g-3 mb-4">
        <Col lg={3} md={6}>
          <Card className="border-0 process-stat-card bg-primary text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{filteredDeposits.length}</h4>
              <small>Pending Processing</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 process-stat-card bg-warning text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{filteredDeposits.filter(d => d.priority === 'High').length}</h4>
              <small>High Priority</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 process-stat-card bg-info text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{formatCurrency(getTotalValue())}</h4>
              <small>Total Amount</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 process-stat-card bg-success text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{formatCurrency(filteredDeposits.reduce((sum, d) => sum + d.processingFee, 0))}</h4>
              <small>Processing Fees</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <Card className="border-0 process-card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col lg={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by customer name, account, deposit ID, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={6} className="text-end">
              <span className="text-muted">
                Showing {filteredDeposits.length} approved deposits ready for processing
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Deposits Table */}
      <Card className="border-0 process-card">
        <Card.Header className="bg-transparent border-bottom-0 pb-0">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            <FileText size={20} className="me-2 text-success" />
            Approved Deposits - Ready for Processing
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
                <th className="border-0 text-muted fw-semibold">Priority</th>
                <th className="border-0 text-muted fw-semibold">Approved Date</th>
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
                    <div>
                      <div className="fw-bold text-success fs-6">
                        {formatCurrency(deposit.amount)}
                      </div>
                      <small className="text-muted">
                        Fee: {formatCurrency(deposit.processingFee)}
                      </small>
                    </div>
                  </td>
                  <td className="border-0">
                    <span className="text-muted">{deposit.depositMethod}</span>
                  </td>
                  <td className="border-0">
                    {getPriorityBadge(deposit.priority)}
                  </td>
                  <td className="border-0">
                    <div>
                      <small className="text-muted d-block">Submitted:</small>
                      <small>{formatDate(deposit.submittedDate)}</small>
                      <small className="text-muted d-block">Approved:</small>
                      <small className="text-success">{formatDate(deposit.approvedDate)}</small>
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
                      <Button
                        variant="success"
                        size="sm"
                        className="p-2"
                        title="Process Deposit"
                        onClick={() => handleProcessDeposit(deposit)}
                      >
                        <Send size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredDeposits.length === 0 && (
            <div className="text-center py-5">
              <CheckCircle size={48} className="text-success mb-3" />
              <h6 className="text-muted">No approved deposits pending processing</h6>
              <p className="text-muted">All approved deposits have been processed or no deposits match your search criteria.</p>
            </div>
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
        <Modal.Body>
          {selectedDeposit && (
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
                      <strong>Account:</strong> {selectedDeposit.fullAccountNumber}
                    </div>
                    <div className="mb-2">
                      <strong>User ID:</strong> {selectedDeposit.userId}
                    </div>
                    <div className="mb-2">
                      <strong>Type:</strong> 
                      <Badge bg={selectedDeposit.customerType === 'Business' ? 'primary' : 'secondary'} className="ms-2">
                        {selectedDeposit.customerType}
                      </Badge>
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
                      <strong>Approved:</strong> {formatDate(selectedDeposit.approvedDate)}
                    </div>
                    <div className="mb-2">
                      <strong>Priority:</strong> {getPriorityBadge(selectedDeposit.priority)}
                    </div>
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
                    <p className="text-muted mb-0">{selectedDeposit.notes}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={() => {
            setShowDetailModal(false)
            handleProcessDeposit(selectedDeposit)
          }}>
            <Send size={16} className="me-2" />
            Process Deposit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Process Deposit Confirmation Modal */}
      <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fw-bold">
            <Send size={24} className="me-2" />
            Process Deposit
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
                    <strong>Account:</strong> {selectedDeposit.fullAccountNumber}
                  </div>
                  <div className="col-6">
                    <strong>Amount:</strong> {formatCurrency(selectedDeposit.amount)}
                  </div>
                  <div className="col-6">
                    <strong>Method:</strong> {selectedDeposit.depositMethod}
                  </div>
                  <div className="col-6">
                    <strong>Reference:</strong> {selectedDeposit.reference}
                  </div>
                </div>
              </div>
              
              <div className="alert alert-success">
                <strong>Confirm Processing:</strong>
                <p className="mb-0 mt-1">
                  This will credit <strong>{formatCurrency(selectedDeposit.amount)}</strong> to the customer's account 
                  and create a payment record. This action cannot be undone.
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
            variant="success"
            onClick={confirmProcessDeposit}
            disabled={processing}
          >
            {processing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                <Send size={16} className="me-2" />
                Process Deposit
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style>{`
        .process-stat-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .process-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .process-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          transition: all 0.3s ease;
        }

        .process-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2);
        }

        .table tbody tr:hover {
          background-color: rgba(40, 167, 69, 0.05) !important;
        }

        .btn-success:hover {
          background-color: #218838;
          border-color: #1e7e34;
        }

        .btn-outline-info:hover {
          background-color: #17a2b8;
          border-color: #117a8b;
        }
      `}</style>
    </Container>
  )
}

export default DepositProcessing
