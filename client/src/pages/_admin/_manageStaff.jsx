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
  PersonGear,
  Building
} from 'react-bootstrap-icons'
import AdminLayout from '../../layouts/adminLayout'
import StaffService from '../../services/staff.Service'

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
  const fetchStaffByDepartment = async (department) => {
    try {
      setLoading(true)
      const response = await StaffService.getStaffByDepartment(department)
      
      if (response.success) {
        setStaff(response.data)
      } else {
        showAlert('Error fetching staff by department: ' + response.error, 'danger')
      }
    } catch (error) {
      console.error('Error fetching staff by department:', error)
      showAlert('Error fetching staff by department: ' + error.message, 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterStaff = () => {
    let filtered = staff

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      if (!newStaff.firstName || !newStaff.lastName) {
        showAlert('Please fill in all required fields', 'warning')
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
        setNewStaff({ firstName: '', lastName: '', department: 'Admin' })
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

  const handleUpdateStaff = async (staffId, updateData) => {
    try {
      const response = await StaffService.updateStaff(staffId, updateData)
      
      if (response.success) {
        await fetchStaff()
        showAlert('Staff member updated successfully!', 'success')
      } else {
        showAlert('Error updating staff: ' + response.error, 'danger')
      }
    } catch (error) {
      console.error('Error updating staff:', error)
      showAlert('Error updating staff: ' + error.message, 'danger')
    }  }

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
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Manage Staff</h1>
          <p className="text-muted mb-0">Manage bank staff members and their departments.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">
            <Download size={16} className="me-2" />
            Export
          </Button>
          <Button 
            variant="primary" 
            className="btn-admin-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} className="me-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false, message: '', variant: '' })}>
          {alert.message}
        </Alert>
      )}

      {/* Department Stats */}
      <Row className="g-4 mb-4">
        {departments.map((dept) => {
          const deptCount = staff.filter(member => member.department === dept).length
          return (            <Col md={4} key={dept}>
              <Card className="admin-card border-0 h-100">
                <Card.Body className="p-4 text-center">
                  <Building size={32} className="text-primary mb-3" />
                  <h3 className="fw-bold mb-1">{deptCount}</h3>
                  <p className="text-muted mb-0">{dept} Department</p>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Search and Filters */}
      <Card className="admin-card border-0 mb-4">
        <Card.Body className="p-4">
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>                <Form.Control
                  type="text"
                  placeholder="Search staff by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-form-control"
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="admin-form-control"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
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

      {/* Staff Table */}
      <Card className="admin-card border-0">
        <Card.Header className="bg-transparent border-bottom-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">
              Staff Members ({filteredStaff.length})
            </h5>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2">Loading staff...</p>
            </div>
          ) : (            <Table responsive className="admin-table mb-0">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? (                  filteredStaff.map((member) => (
                    <tr key={member.staffId}>
                      <td>
                        <span className="fw-semibold text-primary">
                          {member.staffStringId || `STAFF_${member.staffId}`}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <PersonGear size={24} className="text-secondary me-3" />
                          <div>
                            <div className="fw-semibold">
                              {member.firstName} {member.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {getDepartmentBadge(member.department)}
                      </td>
                      <td>
                        <span className="text-muted">
                          {formatDate(member.createdAt)}
                        </span>
                      </td>
                      <td>                        <div className="d-flex gap-1">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-1 text-primary"
                            onClick={() => handleViewStaff(member)}
                            title="View Details"
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-1 text-warning"
                            onClick={() => {
                              // TODO: Implement edit modal
                              showAlert('Edit functionality coming soon!', 'info')
                            }}
                            title="Edit Staff"
                          >
                            <PencilSquare size={14} />
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-1 text-danger"
                            onClick={() => handleDeleteStaff(member.staffId)}
                            title="Delete Staff"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="text-muted">
                        {searchTerm || selectedDepartment !== 'all' 
                          ? 'No staff members found matching your criteria.' 
                          : 'No staff members available.'
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

      {/* Staff Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Staff Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>          {selectedStaff && (
            <Row>
              <Col md={6}>
                <h6 className="fw-bold mb-3">Basic Information</h6>
                <div className="mb-2">
                  <strong>Name:</strong> {selectedStaff.firstName} {selectedStaff.lastName}
                </div>
                <div className="mb-2">
                  <strong>Staff ID:</strong> {selectedStaff.staffStringId || `STAFF_${selectedStaff.staffId}`}
                </div>
                <div className="mb-2">
                  <strong>Department:</strong> {getDepartmentBadge(selectedStaff.department)}
                </div>
              </Col>
              <Col md={6}>
                <h6 className="fw-bold mb-3">Employment Information</h6>
                <div className="mb-2">
                  <strong>Joined:</strong> {formatDate(selectedStaff.createdAt)}
                </div>
                <div className="mb-2">
                  <strong>Last Updated:</strong> {formatDate(selectedStaff.updatedAt)}
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
            Edit Staff
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Staff Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Staff Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({...newStaff, firstName: e.target.value})}
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({...newStaff, lastName: e.target.value})}
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Department *</Form.Label>
              <Form.Select
                value={newStaff.department}
                onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                className="admin-form-control"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddStaff}>
            Add Staff Member
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  )
}

export default ManageStaff