import React, { useState, useEffect } from 'react'
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap'
import { PersonCircle, Search, MenuButtonWideFill } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar'
import StaffService from '../services/staff.Service'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [staffData, setStaffData] = useState(null)

  useEffect(() => {
    // Check if staff is authenticated
    if (!StaffService.isAuthenticated()) {
      navigate('/login')
      return
    }

    // Get staff data from localStorage
    const storedStaffData = StaffService.getStaffData()
    setStaffData(storedStaffData)
  }, [navigate])
  const handleLogout = () => {
    StaffService.logout()
    navigate('/login')
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const getDisplayName = () => {
    if (staffData && staffData.staffFirstName && staffData.staffLastName) {
      return `${staffData.staffFirstName} ${staffData.staffLastName}`
    }
    return staffData?.staffEmail || 'Admin'
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area */}
      <div 
        className="main-content"
        style={{
          marginLeft: sidebarCollapsed ? '80px' : '280px',
          width: `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
          transition: 'margin-left 0.3s ease, width 0.3s ease',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        {/* Top Navigation Bar */}
        <Navbar 
          className="admin-topbar px-4 py-3 border-bottom bg-white"
          style={{ 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
            zIndex: 999
          }}
        >
          <div className="d-flex align-items-center w-100">
            {/* Mobile Sidebar Toggle */}
            <Button
              variant="link"
              className="d-lg-none me-3 p-0 text-dark"
              onClick={toggleSidebar}
            >
              <MenuButtonWideFill size={20} />
            </Button>

            {/* Search Bar */}
            <div className="position-relative me-auto" style={{ maxWidth: '400px', width: '100%' }}>
              <Search 
                className="position-absolute text-muted" 
                size={16}
                style={{ 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)' 
                }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                style={{
                  paddingLeft: '40px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  height: '40px'
                }}
              />
            </div>            {/* Right Side Actions */}
            <Nav className="d-flex align-items-center">
              {/* User Menu */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-2 text-dark border-0 d-flex align-items-center"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                    style={{ width: '32px', height: '32px', fontSize: '12px' }}
                  >
                    {getInitials()}
                  </div>
                  <span className="d-none d-md-inline fw-semibold">{getDisplayName()}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>                  <Dropdown.Header>
                    <div className="fw-semibold">{getDisplayName()}</div>
                    <small className="text-muted">{staffData?.staffEmail}</small>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/admin/profile">
                    <PersonCircle size={16} className="me-2" />
                    Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Item href="/admin/settings">
                    <i className="bi bi-gear me-2"></i>
                    Account Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </Navbar>

        {/* Page Content */}
        <main className="admin-main-content">
          <Container fluid className="p-4">
            {children}
          </Container>
        </main>
      </div>      {/* Custom Styles */}
      <style>{`
        .admin-topbar .dropdown-toggle::after {
          display: none;
        }
        
        .admin-main-content {
          min-height: calc(100vh - 73px);
        }
        
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
        
        .navbar-nav .dropdown-menu {
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  )
}

export default AdminLayout