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
  Alert
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
  Building
} from 'react-bootstrap-icons'
import AdminLayout from '../../layouts/adminLayout'
import UserService from '../../services/user.Service'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
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

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Manage Users</h1>
          <p className="text-muted mb-0">View and manage all user accounts in the system.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">
            <Download size={16} className="me-2" />
            Export
          </Button>
          <Button variant="primary" className="btn-admin-primary">
            <Plus size={16} className="me-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false, message: '', variant: '' })}>
          {alert.message}
        </Alert>
      )}

      {/* Search and Filters */}
      <Card className="admin-card border-0 mb-4">
        <Card.Body className="p-4">
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-form-control"
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="admin-form-control"
              >
                <option value="all">All Account Types</option>
                <option value="personal">Personal Accounts</option>
                <option value="business">Business Accounts</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="outline-secondary" className="w-100">
                <Filter size={16} className="me-2" />
                Advanced Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="admin-card border-0">
        <Card.Header className="bg-transparent border-bottom-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">
              Users ({filteredUsers.length})
            </h5>
            <div className="d-flex gap-2">
              <Form.Select size="sm" style={{ width: 'auto' }}>
                <option>10 per page</option>
                <option>25 per page</option>
                <option>50 per page</option>
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2">Loading users...</p>
            </div>
          ) : (
            <Table responsive className="admin-table mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Account Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.userId || user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            {user.accountType === 'business' ? (
                              <Building size={24} className="text-primary" />
                            ) : (
                              <PersonCircle size={24} className="text-success" />
                            )}
                          </div>
                          <div>
                            <div className="fw-semibold">{getUserDisplayName(user)}</div>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {getAccountTypeBadge(user.accountType)}
                      </td>
                      <td>
                        <span className="fw-semibold">
                          {formatCurrency(user.balance)}
                        </span>
                      </td>
                      <td>
                        {getStatusBadge(user)}
                      </td>
                      <td>
                        <span className="text-muted">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-1 text-primary"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye size={14} />
                          </Button>                          <Button
                            variant="link"
                            size="sm"
                            className="p-1 text-warning"
                          >
                            <PencilSquare size={14} />
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-1 text-danger"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="text-muted">
                        {searchTerm || selectedFilter !== 'all' 
                          ? 'No users found matching your criteria.' 
                          : 'No users available.'
                        }
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* User Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <h6 className="fw-bold mb-3">Basic Information</h6>
                <div className="mb-2">
                  <strong>Name:</strong> {getUserDisplayName(selectedUser)}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div className="mb-2">
                  <strong>Account Type:</strong> {getAccountTypeBadge(selectedUser.accountType)}
                </div>
                <div className="mb-2">
                  <strong>User ID:</strong> {selectedUser.userId || selectedUser._id}
                </div>
                <div className="mb-2">
                  <strong>Joined:</strong> {formatDate(selectedUser.createdAt)}
                </div>
              </Col>
              <Col md={6}>
                <h6 className="fw-bold mb-3">Account Information</h6>
                <div className="mb-2">
                  <strong>Balance:</strong> {formatCurrency(selectedUser.balance)}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong> {getStatusBadge(selectedUser)}
                </div>
                <div className="mb-2">
                  <strong>Last Login:</strong> 
                  <span className="text-muted ms-1">
                    {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}
                  </span>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Edit User
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  )
}

export default ManageUsers