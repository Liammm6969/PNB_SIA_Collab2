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
  Dropdown,
  Alert,
  Container,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Tab,
  Tabs,
  ProgressBar
} from 'react-bootstrap'
import { 
  Search, 
  Filter, 
  Eye, 
  PencilSquare, 
  Trash,
  Plus,
  Download,
  PersonCircle,
  Building,
  StarFill,
  ShieldCheck,
  Clock,
  BarChartLine,
  People,
  CreditCard
} from 'react-bootstrap-icons'
import AdminLayout from '../../layouts/adminLayout'
import UserService from '../../services/user.Service'
import '../../styles/adminUserManagement.css'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [addUserFormData, setAddUserFormData] = useState({
    accountType: 'personal',
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    password: '',
    balance: 0
  })
  const [addUserErrors, setAddUserErrors] = useState({})
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, selectedFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const userList = await UserService.listUsers()
      setUsers(userList)
    } catch (error) {
      console.error('Error fetching users:', error)
      showAlert('Error fetching users: ' + error.message, 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(user => user.accountType === selectedFilter)
    }

    setFilteredUsers(filtered)
  }

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant })
    setTimeout(() => {
      setAlert({ show: false, message: '', variant: '' })
    }, 5000)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const getStatusBadge = (user) => {
    // Mock status logic - you can implement actual status checking
    const isActive = user.isActive !== false
    return (
      <Badge bg={isActive ? 'success' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    )
  }

  const getAccountTypeBadge = (accountType) => {
    return (
      <Badge bg={accountType === 'business' ? 'primary' : 'info'}>
        {accountType === 'business' ? 'Business' : 'Personal'}
      </Badge>
    )
  }

  const getUserDisplayName = (user) => {
    if (user.accountType === 'business') {
      return user.businessName || 'Business Account'
    }
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Personal Account'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  // Add User Functions
  const handleAddUserClick = () => {
    setAddUserFormData({
      accountType: 'personal',
      firstName: '',
      lastName: '',
      businessName: '',
      email: '',
      password: '',
      balance: 0
    })
    setAddUserErrors({})
    setShowAddUserModal(true)
  }

  const handleAddUserFormChange = (e) => {
    const { name, value } = e.target
    setAddUserFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (addUserErrors[name]) {
      setAddUserErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAccountTypeChange = (accountType) => {
    setAddUserFormData(prev => ({
      ...prev,
      accountType,
      // Clear name fields when switching account types
      firstName: '',
      lastName: '',
      businessName: ''
    }))
    // Clear related errors
    setAddUserErrors(prev => ({
      ...prev,
      firstName: '',
      lastName: '',
      businessName: ''
    }))
  }

  const validateAddUserForm = () => {
    const newErrors = {}

    // Account type specific validations
    if (addUserFormData.accountType === 'personal') {
      if (!addUserFormData.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      }
      if (!addUserFormData.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      }
    } else {
      if (!addUserFormData.businessName.trim()) {
        newErrors.businessName = 'Business name is required'
      }
    }

    // Email validation
    if (!addUserFormData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(addUserFormData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!addUserFormData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (addUserFormData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    // Balance validation
    if (addUserFormData.balance < 0) {
      newErrors.balance = 'Balance cannot be negative'
    }

    setAddUserErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddUserSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateAddUserForm()) return

    setAddUserLoading(true)
    
    try {
      // Prepare user data based on account type
      const userData = addUserFormData.accountType === 'personal'
        ? UserService.createPersonalAccountData(
            addUserFormData.firstName,
            addUserFormData.lastName,
            addUserFormData.email,
            addUserFormData.password,
            { balance: parseFloat(addUserFormData.balance) || 0 }
          )
        : UserService.createBusinessAccountData(
            addUserFormData.businessName,
            addUserFormData.email,
            addUserFormData.password,
            { balance: parseFloat(addUserFormData.balance) || 0 }
          )
      
      await UserService.registerUser(userData)
      
      showAlert('User added successfully!', 'success')
      setShowAddUserModal(false)
      
      // Refresh users list
      fetchUsers()
      
    } catch (error) {
      console.error('Add user error:', error)
      showAlert(error.message || 'Failed to add user. Please try again.', 'danger')
    } finally {
      setAddUserLoading(false)
    }
  }
  return (
    <AdminLayout>
      <Container fluid className="px-4">
        {/* Enhanced Header with gradient background */}
        <div className="position-relative mb-5">
          <div 
            className="rounded-4 p-4 mb-4 position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >            <div className="position-absolute top-0 end-0 opacity-25">
              <People size={120} />
            </div>
            <Row className="align-items-center position-relative">
              <Col lg={8}>
                <h1 className="h2 fw-bold mb-2 text-white">User Management Hub</h1>
                <p className="mb-0 text-white-50 fs-5">
                  Comprehensive user account oversight and administration
                </p>
                <div className="d-flex gap-4 mt-3">                  <div className="d-flex align-items-center">
                    <People size={20} className="me-2" />
                    <span className="fw-semibold">{users.length} Total Users</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Building size={20} className="me-2" />
                    <span className="fw-semibold">
                      {users.filter(u => u.accountType === 'business').length} Business
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <PersonCircle size={20} className="me-2" />
                    <span className="fw-semibold">
                      {users.filter(u => u.accountType === 'personal').length} Personal
                    </span>
                  </div>
                </div>
              </Col>
              <Col lg={4} className="text-end">
                <div className="d-flex gap-2 justify-content-end">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Export user data</Tooltip>}
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
                    variant="warning" 
                    className="rounded-pill px-4 fw-semibold shadow-lg btn-glow"
                    onClick={handleAddUserClick}
                    style={{
                      background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                      border: 'none',
                      color: '#333'
                    }}
                  >
                    <Plus size={16} className="me-2" />
                    Add New User
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

        {/* Enhanced Search and Filters Card */}
        <Card className="border-0 shadow-lg mb-4 rounded-4 overflow-hidden">
          <div 
            className="card-header border-0 p-4"
            style={{
              background: 'linear-gradient(90deg, #f8f9fa, #e9ecef)',
            }}
          >
            <h5 className="fw-bold mb-0 d-flex align-items-center">
              <Filter size={20} className="me-2 text-primary" />
              Search & Filter Users
            </h5>
          </div>
          <Card.Body className="p-4">
            <Row className="g-4">
              <Col lg={6}>
                <Form.Label className="fw-semibold text-muted small text-uppercase">
                  Search Users
                </Form.Label>
                <InputGroup className="shadow-sm">
                  <InputGroup.Text className="bg-primary text-white border-0">
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, or business..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 ps-3"
                    style={{ fontSize: '16px' }}
                  />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Label className="fw-semibold text-muted small text-uppercase">
                  Account Type
                </Form.Label>
                <Form.Select 
                  value={selectedFilter} 
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="shadow-sm border-0 rounded-3"
                  style={{ fontSize: '16px' }}
                >
                  <option value="all">🔍 All Account Types</option>
                  <option value="personal">👤 Personal Accounts</option>
                  <option value="business">🏢 Business Accounts</option>
                </Form.Select>
              </Col>
              <Col lg={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-primary" 
                  className="w-100 rounded-3 fw-semibold"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedFilter('all')
                  }}
                >
                  Clear All
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>        {/* Enhanced Users Table */}
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
          <div 
            className="card-header border-0 p-4"
            style={{
              background: 'linear-gradient(90deg, #6c757d, #495057)',
              color: 'white'
            }}
          >
            <Row className="align-items-center">
              <Col>                <h5 className="fw-bold mb-0 d-flex align-items-center">
                  <People size={20} className="me-2" />
                  User Directory ({filteredUsers.length} users)
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
                  <Spinner animation="grow" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                </div>
                <h5 className="text-muted">Loading Users...</h5>
                <p className="text-muted mb-0">Please wait while we fetch the user data</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="mb-0 table-hover">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">User Profile</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Type</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Balance</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Status</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small">Member Since</th>
                      <th className="border-0 py-3 px-4 fw-bold text-uppercase small text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <tr 
                          key={user.userId || user._id}
                          className="border-bottom"
                          style={{
                            transition: 'all 0.2s ease',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e3f2fd'
                            e.currentTarget.style.transform = 'scale(1.01)'
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
                          }}
                          onMouseLeave={(e) => {
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
                                    background: user.accountType === 'business' 
                                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                                      : 'linear-gradient(135deg, #f093fb, #f5576c)'
                                  }}
                                >
                                  {user.accountType === 'business' ? (
                                    <Building size={20} className="text-white" />
                                  ) : (
                                    <PersonCircle size={20} className="text-white" />
                                  )}
                                </div>
                                <div 
                                  className="position-absolute bottom-0 end-0 rounded-circle border-2 border-white"
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    backgroundColor: user.isActive !== false ? '#10b981' : '#6b7280'
                                  }}
                                ></div>
                              </div>
                              <div>
                                <div className="fw-bold text-dark mb-1">
                                  {getUserDisplayName(user)}
                                </div>
                                <div className="text-muted small">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge 
                              className="px-3 py-2 rounded-pill fw-semibold"
                              style={{
                                background: user.accountType === 'business' 
                                  ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                                  : 'linear-gradient(45deg, #f093fb, #f5576c)',
                                border: 'none',
                                color: 'white'
                              }}
                            >
                              {user.accountType === 'business' ? (
                                <><Building size={14} className="me-1" />Business</>
                              ) : (
                                <><PersonCircle size={14} className="me-1" />Personal</>
                              )}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="d-flex align-items-center">
                              <CreditCard size={16} className="text-success me-2" />
                              <span className="fw-bold text-success fs-5">
                                {formatCurrency(user.balance)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge 
                              className="px-3 py-2 rounded-pill fw-semibold d-flex align-items-center justify-content-center"
                              style={{
                                background: user.isActive !== false 
                                  ? 'linear-gradient(45deg, #10b981, #34d399)' 
                                  : 'linear-gradient(45deg, #6b7280, #9ca3af)',
                                border: 'none',
                                color: 'white',
                                width: 'fit-content'
                              }}
                            >
                              {user.isActive !== false ? (
                                <><ShieldCheck size={14} className="me-1" />Active</>
                              ) : (
                                <><Clock size={14} className="me-1" />Inactive</>
                              )}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-muted">
                              <Clock size={14} className="me-1" />
                              {formatDate(user.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="d-flex gap-1 justify-content-center">
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>View Details</Tooltip>}
                              >
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="rounded-circle p-2 border-0 shadow-sm"
                                  onClick={() => handleViewUser(user)}
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
                                overlay={<Tooltip>Edit User</Tooltip>}
                              >
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  className="rounded-circle p-2 border-0 shadow-sm"
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
                                overlay={<Tooltip>Delete User</Tooltip>}
                              >
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="rounded-circle p-2 border-0 shadow-sm"
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
                          </td>
                        </tr>
                      ))                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="text-center">
                            <People size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Users Found</h5>
                            <p className="text-muted mb-0">
                              {searchTerm || selectedFilter !== 'all' 
                                ? 'Try adjusting your search criteria or filters.' 
                                : 'No users have been added to the system yet.'
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
        </Card>        {/* Enhanced User Details Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="lg"
          centered
          className="user-details-modal"
        >
          <Modal.Header 
            closeButton 
            className="border-0 pb-0"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Modal.Title className="fw-bold d-flex align-items-center">
              <Eye size={24} className="me-2" />
              User Profile Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            {selectedUser && (
              <>
                {/* User Header Section */}
                <div 
                  className="p-4 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                    {selectedUser.accountType === 'business' ? (
                      <Building size={32} className="text-white" />
                    ) : (
                      <PersonCircle size={32} className="text-white" />
                    )}
                  </div>
                  <h4 className="fw-bold mb-1">{getUserDisplayName(selectedUser)}</h4>
                  <p className="mb-2 opacity-75">{selectedUser.email}</p>
                  <Badge 
                    className="px-3 py-2 rounded-pill"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    {selectedUser.accountType === 'business' ? 'Business Account' : 'Personal Account'}
                  </Badge>
                </div>

                {/* Tabbed Content */}
                <div className="p-4">
                  <Tabs defaultActiveKey="overview" className="mb-4 nav-pills">
                    <Tab 
                      eventKey="overview" 
                      title={
                        <span className="d-flex align-items-center">
                          <PersonCircle size={16} className="me-2" />
                          Overview
                        </span>
                      }
                    >
                      <Row className="g-4">
                        <Col md={6}>
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                              <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                                <PersonCircle size={18} className="me-2" />
                                Basic Information
                              </h6>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Full Name</small>
                                <div className="fw-semibold">{getUserDisplayName(selectedUser)}</div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Email Address</small>
                                <div className="fw-semibold">{selectedUser.email}</div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">User ID</small>
                                <div className="fw-semibold font-monospace text-muted">
                                  {selectedUser.userId || selectedUser._id}
                                </div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Member Since</small>
                                <div className="fw-semibold">{formatDate(selectedUser.createdAt)}</div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                              <h6 className="fw-bold text-success mb-3 d-flex align-items-center">
                                <CreditCard size={18} className="me-2" />
                                Account Details
                              </h6>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Current Balance</small>
                                <div className="fs-4 fw-bold text-success">
                                  {formatCurrency(selectedUser.balance)}
                                </div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Account Status</small>
                                <div>
                                  <Badge 
                                    className="px-3 py-2 rounded-pill"
                                    bg={selectedUser.isActive !== false ? 'success' : 'secondary'}
                                  >
                                    {selectedUser.isActive !== false ? (
                                      <><ShieldCheck size={14} className="me-1" />Active</>
                                    ) : (
                                      <><Clock size={14} className="me-1" />Inactive</>
                                    )}
                                  </Badge>
                                </div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted text-uppercase fw-semibold">Last Activity</small>
                                <div className="fw-semibold text-muted">
                                  {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'No recent activity'}
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Tab>
                    <Tab 
                      eventKey="activity" 
                      title={                      <span className="d-flex align-items-center">
                          <BarChartLine size={16} className="me-2" />
                          Activity
                        </span>
                      }
                    >
                      <div className="text-center py-5">
                        <BarChartLine size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">Activity Tracking</h5>
                        <p className="text-muted">User activity logs will be displayed here</p>
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
              variant="primary"
              className="rounded-pill px-4 fw-semibold"
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                border: 'none'
              }}
            >
              <PencilSquare size={16} className="me-2" />
              Edit User
            </Button>
          </Modal.Footer>
        </Modal>        {/* Enhanced Add User Modal */}
        <Modal 
          show={showAddUserModal} 
          onHide={() => setShowAddUserModal(false)} 
          size="lg"
          centered
          className="add-user-modal"
        >
          <Modal.Header 
            closeButton 
            className="border-0 pb-2"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
              color: '#333'
            }}
          >
            <Modal.Title className="fw-bold d-flex align-items-center">
              <Plus size={24} className="me-2" />
              Create New User Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Form onSubmit={handleAddUserSubmit}>
              {/* Account Type Selection - Enhanced */}
              <div className="p-4 bg-light border-bottom">
                <h6 className="fw-bold mb-3 text-center">Choose Account Type</h6>
                <Row className="g-3">
                  <Col md={6}>
                    <Card 
                      className={`text-center cursor-pointer h-100 border-0 shadow-sm ${
                        addUserFormData.accountType === 'personal' 
                          ? 'bg-primary text-white' 
                          : 'bg-white hover-shadow'
                      }`}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        transform: addUserFormData.accountType === 'personal' ? 'scale(1.05)' : 'scale(1)'
                      }}
                      onClick={() => handleAccountTypeChange('personal')}
                    >
                      <Card.Body className="py-4">
                        <div className="mb-3">
                          <PersonCircle 
                            size={40} 
                            className={addUserFormData.accountType === 'personal' ? 'text-white' : 'text-primary'} 
                          />
                        </div>
                        <h5 className={`fw-bold mb-2 ${addUserFormData.accountType === 'personal' ? 'text-white' : 'text-dark'}`}>
                          Personal Account
                        </h5>
                        <p className={`small mb-0 ${addUserFormData.accountType === 'personal' ? 'text-white-50' : 'text-muted'}`}>
                          Individual user account for personal banking
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card 
                      className={`text-center cursor-pointer h-100 border-0 shadow-sm ${
                        addUserFormData.accountType === 'business' 
                          ? 'bg-primary text-white' 
                          : 'bg-white hover-shadow'
                      }`}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        transform: addUserFormData.accountType === 'business' ? 'scale(1.05)' : 'scale(1)'
                      }}
                      onClick={() => handleAccountTypeChange('business')}
                    >
                      <Card.Body className="py-4">
                        <div className="mb-3">
                          <Building 
                            size={40} 
                            className={addUserFormData.accountType === 'business' ? 'text-white' : 'text-primary'} 
                          />
                        </div>
                        <h5 className={`fw-bold mb-2 ${addUserFormData.accountType === 'business' ? 'text-white' : 'text-dark'}`}>
                          Business Account
                        </h5>
                        <p className={`small mb-0 ${addUserFormData.accountType === 'business' ? 'text-white-50' : 'text-muted'}`}>
                          Corporate account for business operations
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Form Fields */}
              <div className="p-4">
                <Row className="g-4">
                  {/* Personal Account Fields */}
                  {addUserFormData.accountType === 'personal' && (
                    <>
                      <Col md={6}>
                        <Form.Group controlId="formFirstName">
                          <Form.Label className="fw-semibold text-muted small text-uppercase">
                            First Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            name="firstName"
                            value={addUserFormData.firstName}
                            onChange={handleAddUserFormChange}
                            isInvalid={!!addUserErrors.firstName}
                            className="rounded-3 border-0 shadow-sm"
                            style={{ padding: '12px 16px', fontSize: '16px' }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {addUserErrors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="formLastName">
                          <Form.Label className="fw-semibold text-muted small text-uppercase">
                            Last Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            name="lastName"
                            value={addUserFormData.lastName}
                            onChange={handleAddUserFormChange}
                            isInvalid={!!addUserErrors.lastName}
                            className="rounded-3 border-0 shadow-sm"
                            style={{ padding: '12px 16px', fontSize: '16px' }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {addUserErrors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  {/* Business Account Fields */}
                  {addUserFormData.accountType === 'business' && (
                    <Col md={12}>
                      <Form.Group controlId="formBusinessName">
                        <Form.Label className="fw-semibold text-muted small text-uppercase">
                          Business Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter business/company name"
                          name="businessName"
                          value={addUserFormData.businessName}
                          onChange={handleAddUserFormChange}
                          isInvalid={!!addUserErrors.businessName}
                          className="rounded-3 border-0 shadow-sm"
                          style={{ padding: '12px 16px', fontSize: '16px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {addUserErrors.businessName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  )}

                  {/* Common Fields */}
                  <Col md={6}>
                    <Form.Group controlId="formEmail">
                      <Form.Label className="fw-semibold text-muted small text-uppercase">
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="user@example.com"
                        name="email"
                        value={addUserFormData.email}
                        onChange={handleAddUserFormChange}
                        isInvalid={!!addUserErrors.email}
                        className="rounded-3 border-0 shadow-sm"
                        style={{ padding: '12px 16px', fontSize: '16px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {addUserErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formPassword">
                      <Form.Label className="fw-semibold text-muted small text-uppercase">
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Minimum 8 characters"
                        name="password"
                        value={addUserFormData.password}
                        onChange={handleAddUserFormChange}
                        isInvalid={!!addUserErrors.password}
                        className="rounded-3 border-0 shadow-sm"
                        style={{ padding: '12px 16px', fontSize: '16px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {addUserErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formBalance">
                      <Form.Label className="fw-semibold text-muted small text-uppercase">
                        Initial Balance
                      </Form.Label>
                      <InputGroup className="shadow-sm">
                        <InputGroup.Text className="bg-success text-white border-0 rounded-start-3">
                          $
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          placeholder="0.00"
                          name="balance"
                          value={addUserFormData.balance}
                          onChange={handleAddUserFormChange}
                          isInvalid={!!addUserErrors.balance}
                          min="0"
                          step="0.01"
                          className="border-0 rounded-end-3"
                          style={{ padding: '12px 16px', fontSize: '16px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {addUserErrors.balance}
                        </Form.Control.Feedback>
                      </InputGroup>
                      <Form.Text className="text-muted small">
                        Optional: Set initial account balance (defaults to $0.00)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-4 pb-4">
            <Button 
              variant="light" 
              onClick={() => setShowAddUserModal(false)}
              className="rounded-pill px-4 me-2"
              disabled={addUserLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUserSubmit}
              disabled={addUserLoading}
              className="rounded-pill px-4 fw-semibold shadow-lg"
              style={{
                background: addUserLoading 
                  ? 'linear-gradient(45deg, #6c757d, #495057)' 
                  : 'linear-gradient(45deg, #ffd700, #ffed4e)',
                border: 'none',
                color: '#333',
                minWidth: '140px'
              }}
            >
              {addUserLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} className="me-2" />
                  Create User
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminLayout>
  )
}

export default ManageUsers