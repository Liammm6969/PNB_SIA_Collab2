import React, { useState, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge, 
  Form, 
  InputGroup,
  Modal,
  Alert,
  Container,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Tab,
  Tabs
} from 'react-bootstrap'
import { 
  Search, 
  Filter, 
  Eye, 
  PencilSquare, 
  Trash,
  Plus,
  Download,
  PersonGear,
  Building,
  People,
  ShieldCheck,
  Clock,
  BarChartLine
} from 'react-bootstrap-icons'
import AdminLayout from '../../layouts/adminLayout'
import StaffService from '../../services/staff.Service'
import '../../styles/adminUserManagement.css'

const ManageStaff = () => {
  const [staff, setStaff] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' })  
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: 'Admin'
  })

  const departments = StaffService.getValidDepartments()

  useEffect(() => {
    fetchStaff()
  }, [])

  useEffect(() => {
    filterStaff()
  }, [staff, searchTerm, selectedDepartment])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await StaffService.getAllStaff()
      
      if (response.success) {
        setStaff(response.data)
      } else {
        showAlert('Error fetching staff: ' + response.error, 'danger')
      }
    } catch (error) {
      console.error('Error fetching staff:', error)
      showAlert('Error fetching staff: ' + error.message, 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterStaff = () => {
    let filtered = staff    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.staffStringId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(member => member.department === selectedDepartment)
    }

    setFilteredStaff(filtered)
  }

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant })
    setTimeout(() => {
      setAlert({ show: false, message: '', variant: '' })
    }, 5000)
  }

  const handleViewStaff = (member) => {
    setSelectedStaff(member)
    setShowModal(true)
  }
  const handleAddStaff = async () => {
    try {
      // Validate form
      if (!newStaff.firstName || !newStaff.lastName || !newStaff.email || !newStaff.password) {
        showAlert('Please fill in all required fields', 'warning')
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(newStaff.email)) {
        showAlert('Please enter a valid email address', 'warning')
        return
      }

      // Validate password length
      if (newStaff.password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'warning')
        return
      }

      // Validate department
      if (!StaffService.isValidDepartment(newStaff.department)) {
        showAlert('Please select a valid department', 'warning')
        return
      }

      const response = await StaffService.createStaff(newStaff)
      
      if (response.success) {
        // Refresh staff list
        await fetchStaff()
        setNewStaff({ firstName: '', lastName: '', email: '', password: '', department: 'Admin' })
        setShowAddModal(false)
        showAlert('Staff member added successfully!', 'success')
      } else {
        showAlert('Error adding staff: ' + response.error, 'danger')
      }
    } catch (error) {
      console.error('Error adding staff:', error)
      showAlert('Error adding staff: ' + error.message, 'danger')
    }
  }

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return
    }

    try {
      const response = await StaffService.deleteStaff(staffId)
      
      if (response.success) {
        await fetchStaff()
        showAlert('Staff member deleted successfully!', 'success')
      } else {
        showAlert('Error deleting staff: ' + response.error, 'danger')
      }
    } catch (error) {
      console.error('Error deleting staff:', error)
      showAlert('Error deleting staff: ' + error.message, 'danger')
    }
  }

  const getDepartmentBadge = (department) => {
    const colors = {
      'Admin': 'primary',
      'Finance': 'success',
      'Loan': 'warning'
    }
    return (
      <Badge bg={colors[department] || 'secondary'}>
        {department}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <Container fluid className="px-4">
        {/* Enhanced Header with gradient background */}
        <div className="position-relative mb-5">
          <div 
            className="rounded-4 p-4 mb-4 position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white'
            }}
          >
            <div className="position-absolute top-0 end-0 opacity-25">
              <People size={120} />
            </div>
            <Row className="align-items-center position-relative">
              <Col lg={8}>
                <h1 className="h2 fw-bold mb-2 text-white">Staff Management Hub</h1>
                <p className="mb-0 text-white-50 fs-5">
                  Comprehensive staff oversight and department administration
                </p>
                <div className="d-flex gap-4 mt-3">
                  <div className="d-flex align-items-center">
                    <People size={20} className="me-2" />
                    <span className="fw-semibold">{staff.length} Total Staff</span>
                  </div>
                  {departments.map((dept) => {
                    const deptCount = staff.filter(member => member.department === dept).length
                    return (
                      <div key={dept} className="d-flex align-items-center">
                        <Building size={20} className="me-2" />
                        <span className="fw-semibold">{deptCount} {dept}</span>
                      </div>
                    )
                  })}
                </div>
              </Col>
              <Col lg={4} className="text-end">
                <div className="d-flex gap-2 justify-content-end">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Export staff data</Tooltip>}
                  >
                    <Button 
                      variant="light" 
                      className="rounded-pill px-4 fw-semibold shadow-sm"
                    >
                      <Download size={16} className="me-2" />
                      Export
                    </Button>
                  </OverlayTrigger>
                  <Button 
                    variant="success" 
                    className="rounded-pill px-4 fw-semibold shadow-lg btn-glow"
                    onClick={() => setShowAddModal(true)}
                    style={{
                      background: 'linear-gradient(45deg, #28a745, #20c997)',
                      border: 'none',
                      color: 'white'
                    }}
                  >
                    <Plus size={16} className="me-2" />
                    Add New Staff
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Enhanced Alert with animation */}
        {alert.show && (
          <Alert 
            variant={alert.variant} 
            dismissible 
            onClose={() => setAlert({ show: false, message: '', variant: '' })}
            className="rounded-4 shadow-sm border-0 mb-4 alert-animated"
            style={{
              animation: 'slideDown 0.3s ease-out'
            }}
          >
            <div className="d-flex align-items-center">
              <ShieldCheck size={20} className="me-2" />
              {alert.message}
            </div>
          </Alert>
        )}

        {/* Enhanced Department Stats */}
        <Row className="g-4 mb-4">
          {departments.map((dept) => {
            const deptCount = staff.filter(member => member.department === dept).length
            const percentage = staff.length > 0 ? ((deptCount / staff.length) * 100).toFixed(1) : 0
            
            return (
              <Col md={4} key={dept}>
                <Card className="border-0 shadow-lg rounded-4 overflow-hidden h-100">
                  <Card.Body className="p-4 text-center position-relative">
                    <div 
                      className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: dept === 'Admin' 
                          ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                          : dept === 'Finance' 
                          ? 'linear-gradient(135deg, #f093fb, #f5576c)'
                          : 'linear-gradient(135deg, #4facfe, #00f2fe)'
                      }}
                    >
                      <Building size={24} className="text-white" />
                    </div>
                    <h3 className="fw-bold mb-1 text-dark">{deptCount}</h3>
                    <p className="text-muted mb-2 fw-semibold">{dept} Department</p>
                    <Badge 
                      className="px-3 py-1 rounded-pill"
                      style={{
                        background: dept === 'Admin' 
                          ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                          : dept === 'Finance' 
                          ? 'linear-gradient(45deg, #f093fb, #f5576c)'
                          : 'linear-gradient(45deg, #4facfe, #00f2fe)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      {percentage}% of staff
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>

        {/* Enhanced Search and Filters Card */}
        <Card className="border-0 shadow-lg mb-4 rounded-4 overflow-hidden">
          <div 
            className="card-header border-0 p-4"
            style={{
              background: 'linear-gradient(90deg, #f8f9fa, #e9ecef)',
            }}
          >
            <h5 className="fw-bold mb-0 d-flex align-items-center">
              <Filter size={20} className="me-2 text-success" />
              Search & Filter Staff
            </h5>
          </div>
          <Card.Body className="p-4">
            <Row className="g-4">
              <Col lg={6}>
                <Form.Label className="fw-semibold text-muted small text-uppercase">
                  Search Staff
                </Form.Label>
                <InputGroup className="shadow-sm">                  <InputGroup.Text className="bg-success text-white border-0">
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, or staff ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 ps-3"
                    style={{ fontSize: '16px' }}
                  />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Label className="fw-semibold text-muted small text-uppercase">
                  Department
                </Form.Label>
                <Form.Select 
                  value={selectedDepartment} 
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="shadow-sm border-0 rounded-3"
                  style={{ fontSize: '16px' }}
                >
                  <option value="all">🏢 All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'Admin' ? '👑' : dept === 'Finance' ? '💰' : '🏦'} {dept}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-success" 
                  className="w-100 rounded-3 fw-semibold"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedDepartment('all')
                  }}
                >
                  Clear All
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Enhanced Staff Table */}
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
          <div 
            className="card-header border-0 p-4"
            style={{
              background: 'linear-gradient(90deg, #28a745, #20c997)',
              color: 'white'
            }}
          >
            <Row className="align-items-center">
              <Col>
                <h5 className="fw-bold mb-0 d-flex align-items-center">
                  <People size={20} className="me-2" />
                  Staff Directory ({filteredStaff.length} members)
                </h5>
              </Col>
              <Col xs="auto">
                <div className="d-flex gap-2 align-items-center">
                  <Form.Select 
                    size="sm" 
                    className="bg-dark border-0 text-white"
                    style={{ width: 'auto' }}
                  >
                    <option>10 per page</option>
                    <option>25 per page</option>
                    <option>50 per page</option>
                  </Form.Select>
                </div>
              </Col>
            </Row>
          </div>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <Spinner animation="grow" variant="success" style={{ width: '3rem', height: '3rem' }} />
                </div>
                <h5 className="text-muted">Loading Staff...</h5>
                <p className="text-muted mb-0">Please wait while we fetch the staff data</p>
              </div>
            ) : (              <div className="table-responsive">
                <Table className="mb-0 table-hover">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Staff Profile</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Email</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Department</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Staff ID</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Member Since</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((member, index) => (
                        <tr 
                          key={member.staffId}
                          className="border-bottom"
                          style={{
                            transition: 'all 0.2s ease',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e8f5e8'
                            e.currentTarget.style.transform = 'scale(1.01)'
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
                          }}                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <td className="px-4 py-4">
                            <div className="d-flex align-items-center">
                              <div className="me-3 position-relative">
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                  style={{
                                    width: '48px',
                                    height: '48px',
                                    background: member.department === 'Admin' 
                                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                                      : member.department === 'Finance' 
                                      ? 'linear-gradient(135deg, #f093fb, #f5576c)'
                                      : 'linear-gradient(135deg, #4facfe, #00f2fe)'
                                  }}
                                >
                                  <PersonGear size={20} className="text-white" />
                                </div>
                              </div>
                              <div>
                                <div className="fw-bold text-dark mb-1">
                                  {member.firstName} {member.lastName}
                                </div>
                                <div className="text-muted small">
                                  Staff Member
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-dark">
                              <div className="fw-semibold">{member.email || 'No email provided'}</div>
                              <div className="text-muted small">Email Address</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge 
                              className="px-3 py-2 rounded-pill fw-semibold"
                              style={{
                                background: member.department === 'Admin' 
                                  ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                                  : member.department === 'Finance' 
                                  ? 'linear-gradient(45deg, #f093fb, #f5576c)'
                                  : 'linear-gradient(45deg, #4facfe, #00f2fe)',
                                border: 'none',
                                color: 'white'
                              }}
                            >
                              {member.department === 'Admin' ? (
                                <><Building size={14} className="me-1" />Admin</>
                              ) : member.department === 'Finance' ? (
                                <><Building size={14} className="me-1" />Finance</>
                              ) : (
                                <><Building size={14} className="me-1" />Loan</>
                              )}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <span className="fw-bold text-success font-monospace">
                              {member.staffStringId || `STAFF_${member.staffId}`}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-muted">
                              <Clock size={14} className="me-1" />
                              {formatDate(member.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="d-flex gap-1 justify-content-center">
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>View Details</Tooltip>}
                              >
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="rounded-circle p-2 border-0 shadow-sm"
                                  onClick={() => handleViewStaff(member)}
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Eye size={14} />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Edit Staff</Tooltip>}
                              >
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  className="rounded-circle p-2 border-0 shadow-sm"
                                  onClick={() => {
                                    showAlert('Edit functionality coming soon!', 'info')
                                  }}
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <PencilSquare size={14} />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Delete Staff</Tooltip>}
                              >
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="rounded-circle p-2 border-0 shadow-sm"
                                  onClick={() => handleDeleteStaff(member.staffId)}
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Trash size={14} />
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </td>                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="text-center">
                            <People size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Staff Found</h5>
                            <p className="text-muted mb-0">
                              {searchTerm || selectedDepartment !== 'all' 
                                ? 'Try adjusting your search criteria or filters.' 
                                : 'No staff members have been added to the system yet.'
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Enhanced Staff Details Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="lg"
          centered
          className="staff-details-modal"
        >
          <Modal.Header 
            closeButton 
            className="border-0 pb-0"
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white'
            }}
          >
            <Modal.Title className="fw-bold d-flex align-items-center">
              <Eye size={24} className="me-2" />
              Staff Profile Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            {selectedStaff && (
              <>
                {/* Staff Header Section */}
                <div 
                  className="p-4 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: 'white'
                  }}
                >
                  <div 
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow-lg"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <PersonGear size={32} className="text-white" />
                  </div>
                  <h4 className="fw-bold mb-1">{selectedStaff.firstName} {selectedStaff.lastName}</h4>
                  <p className="mb-2 opacity-75">{selectedStaff.staffStringId || `STAFF_${selectedStaff.staffId}`}</p>
                  <Badge 
                    className="px-3 py-2 rounded-pill"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    {selectedStaff.department} Department
                  </Badge>
                </div>

                {/* Tabbed Content */}
                <div className="p-4">
                  <Tabs defaultActiveKey="overview" className="mb-4 nav-pills">
                    <Tab 
                      eventKey="overview" 
                      title={
                        <span className="d-flex align-items-center">
                          <PersonGear size={16} className="me-2" />
                          Overview
                        </span>
                      }
                    >
                      <Row className="g-4">
                        <Col md={6}>
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                              <h6 className="fw-bold text-success mb-3 d-flex align-items-center">
                                <PersonGear size={18} className="me-2" />
                                Basic Information
                              </h6>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Full Name</small>
                                <div className="fw-semibold">{selectedStaff.firstName} {selectedStaff.lastName}</div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Staff ID</small>
                                <div className="fw-semibold font-monospace text-success">
                                  {selectedStaff.staffStringId || `STAFF_${selectedStaff.staffId}`}
                                </div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Department</small>
                                <div className="fw-semibold">{selectedStaff.department}</div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Email</small>
                                <div className="fw-semibold">{selectedStaff.email || 'No email provided'}</div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                              <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                                <Building size={18} className="me-2" />
                                Employment Details
                              </h6>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Joined</small>
                                <div className="fw-semibold">{formatDate(selectedStaff.createdAt)}</div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Last Updated</small>
                                <div className="fw-semibold">{formatDate(selectedStaff.updatedAt)}</div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Status</small>
                                <div>
                                  <Badge bg="success" className="px-3 py-2 rounded-pill">
                                    <ShieldCheck size={14} className="me-1" />
                                    Active
                                  </Badge>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Tab>
                    <Tab 
                      eventKey="activity" 
                      title={
                        <span className="d-flex align-items-center">
                          <BarChartLine size={16} className="me-2" />
                          Activity
                        </span>
                      }
                    >
                      <div className="text-center py-5">
                        <BarChartLine size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">Activity Tracking</h5>
                        <p className="text-muted">Staff activity logs will be displayed here</p>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button 
              variant="light" 
              onClick={() => setShowModal(false)}
              className="rounded-pill px-4"
            >
              Close
            </Button>
            <Button 
              variant="success"
              className="rounded-pill px-4 fw-semibold"
              style={{
                background: 'linear-gradient(45deg, #28a745, #20c997)',
                border: 'none'
              }}
            >
              <PencilSquare size={16} className="me-2" />
              Edit Staff
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Enhanced Add Staff Modal */}
        <Modal 
          show={showAddModal} 
          onHide={() => setShowAddModal(false)}
          size="lg"
          centered
          className="add-staff-modal"
        >
          <Modal.Header 
            closeButton 
            className="border-0 pb-2"
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white'
            }}
          >
            <Modal.Title className="fw-bold d-flex align-items-center">
              <Plus size={24} className="me-2" />
              Add New Staff Member
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Form>
              {/* Department Selection */}
              <div className="p-4 bg-light border-bottom">
                <h6 className="fw-bold mb-3 text-center">Select Department</h6>
                <Row className="g-3">
                  {departments.map((dept) => (
                    <Col md={4} key={dept}>
                      <Card 
                        className={`text-center cursor-pointer h-100 border-0 shadow-sm ${
                          newStaff.department === dept 
                            ? 'bg-success text-white' 
                            : 'bg-white hover-shadow'
                        }`}
                        style={{ 
                          cursor: 'pointer', 
                          transition: 'all 0.3s ease',
                          transform: newStaff.department === dept ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onClick={() => setNewStaff({...newStaff, department: dept})}
                      >
                        <Card.Body className="py-3">
                          <div className="mb-2">
                            <Building 
                              size={24} 
                              className={newStaff.department === dept ? 'text-white' : 'text-success'} 
                            />
                          </div>
                          <h6 className={`fw-bold mb-0 ${newStaff.department === dept ? 'text-white' : 'text-dark'}`}>
                            {dept}
                          </h6>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>              {/* Form Fields */}
              <div className="p-4">
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-muted small text-uppercase">
                        First Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={newStaff.firstName}
                        onChange={(e) => setNewStaff({...newStaff, firstName: e.target.value})}
                        className="rounded-3 border-0 shadow-sm"
                        style={{ padding: '12px 16px', fontSize: '16px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-muted small text-uppercase">
                        Last Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        value={newStaff.lastName}
                        onChange={(e) => setNewStaff({...newStaff, lastName: e.target.value})}
                        className="rounded-3 border-0 shadow-sm"
                        style={{ padding: '12px 16px', fontSize: '16px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-muted small text-uppercase">
                        Email Address *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                        className="rounded-3 border-0 shadow-sm"
                        style={{ padding: '12px 16px', fontSize: '16px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-muted small text-uppercase">
                        Password *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password (min. 6 characters)"
                        value={newStaff.password}
                        onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                        className="rounded-3 border-0 shadow-sm"
                        style={{ padding: '12px 16px', fontSize: '16px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-4 pb-4">
            <Button 
              variant="light" 
              onClick={() => setShowAddModal(false)}
              className="rounded-pill px-4 me-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddStaff}
              className="rounded-pill px-4 fw-semibold shadow-lg"
              style={{
                background: 'linear-gradient(45deg, #28a745, #20c997)',
                border: 'none',
                color: 'white',
                minWidth: '140px'
              }}
            >
              <Plus size={16} className="me-2" />
              Add Staff
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminLayout>
  )
}

export default ManageStaff
