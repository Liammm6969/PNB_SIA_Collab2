import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container, Dropdown, Offcanvas } from 'react-bootstrap'
import { 
  PersonCircle, 
  BoxArrowRight, 
  CreditCard, 
  PiggyBank, 
  BarChart, 
  FileText, 
  Gear,
  House,
  List,
  Building,
  Cash,
  GraphUp,
  Eye,
  Send
} from 'react-bootstrap-icons'
import StaffService from '../services/staff.Service'

const FinanceLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStaffData()
  }, [])

  const loadStaffData = async () => {
    try {
      setLoading(true)
      
      // Check if staff is authenticated
      if (!StaffService.isAuthenticated()) {
        navigate('/login')
        return
      }

      const staffData = StaffService.getStaffData()
      
      if (!staffData.staffId) {
        navigate('/login')
        return
      }

      // Verify staff department is Finance
      if (staffData.staffDepartment !== 'Finance') {
        navigate('/login')
        return
      }

      setStaff(staffData)
      
    } catch (error) {
      console.error('Failed to load staff data:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get staff display name
  const getStaffDisplayName = () => {
    if (!staff) return 'Finance Staff'
    
    return staff.staffFirstName && staff.staffLastName 
      ? `${staff.staffFirstName} ${staff.staffLastName}` 
      : 'Finance Staff'
  }
  // Helper function to format staff ID for display
  const getDisplayStaffId = () => {
    if (!staff || !staff.staffStringId) return 'STAFF_****'
    
    const staffId = staff.staffStringId
    // Show only last 4 characters for security
    return `****${staffId.slice(-4)}`
  }
    const navigationItems = [
    {
      title: "Dashboard",
      path: "/finance/dashboard",
      icon: <House className="me-2" />,
      description: "Overview & Analytics"
    },
    {
      title: "Deposit Management",
      path: "/finance/deposits",
      icon: <Cash className="me-2" />,
      description: "Process User Deposits"
    },
    {
      title: "Bank Balance",
      path: "/finance/bank-balance",
      icon: <PiggyBank className="me-2" />,
      description: "Manage Bank Reserve"
    },
    {
      title: "Reports",
      path: "/finance/reports",
      icon: <BarChart className="me-2" />,
      description: "Financial Reports"
    },
    {
      title: "Transactions",
      path: "/finance/transactions",
      icon: <FileText className="me-2" />,
      description: "Transaction History"
    }
  ]

  const handleLogout = () => {
    // Clear staff session/token using StaffService
    StaffService.logout()
    navigate('/login')
  }

  const handleNavigation = (path) => {
    navigate(path)
    setShowOffcanvas(false)
  }

  // Show loading state if staff data is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading finance portal...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="finance-layout">
      {/* Header Navigation */}
      <Navbar expand="lg" className="finance-navbar glass-card shadow-sm" fixed="top">
        <Container fluid>
          {/* Mobile Menu Toggle */}
          <Navbar.Toggle 
            aria-controls="offcanvasNavbar" 
            onClick={() => setShowOffcanvas(true)}
            className="d-lg-none border-0"
          >
            <List size={24} />
          </Navbar.Toggle>

          {/* Brand/Logo */}
          <Navbar.Brand href="#" className="fw-bold text-primary d-flex align-items-center">
            <img 
              src="/Logo.png" 
              alt="PNB" 
              height="32" 
              className="me-2"
            />
            <span className="d-none d-sm-inline">PNB Finance Portal</span>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Nav className="d-none d-lg-flex mx-auto">
            {navigationItems.map((item, index) => (
              <Nav.Link
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item-finance mx-2 ${location.pathname === item.path ? 'active' : ''}`}
                title={item.description}
              >
                {item.icon}
                {item.title}
              </Nav.Link>
            ))}
          </Nav>          {/* Right Side Items */}
          <div className="d-flex align-items-center">
            {/* Staff Profile Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="link" className="staff-dropdown d-flex align-items-center text-decoration-none border-0">
                <div 
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: '32px', height: '32px', fontSize: '12px' }}
                >
                  <Building size={16} />
                </div>
                <div className="d-none d-md-block text-start">
                  <div className="fw-semibold">{getStaffDisplayName()}</div>
                  <small className="text-muted">{getDisplayStaffId()}</small>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="staff-dropdown-menu">
                <Dropdown.Header>
                  <div>{getStaffDisplayName()}</div>
                  <small className="text-muted">Finance Department</small>
                  <Badge bg="success" className="mt-1">
                    <Building size={12} className="me-1" />
                    Finance Staff
                  </Badge>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => navigate('/finance/profile')}>
                  <PersonCircle className="me-2" />
                  Profile Settings
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/finance/settings')}>
                  <Gear className="me-2" />
                  Department Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <BoxArrowRight className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Navigation */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="start">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>
            <img src="/Logo.png" alt="PNB" height="24" className="me-2" />
            Finance Portal
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column">
            {navigationItems.map((item, index) => (
              <Nav.Link
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`mobile-nav-item p-3 ${location.pathname === item.path ? 'active' : ''}`}
              >
                <div className="d-flex align-items-center">
                  {item.icon}
                  <div>
                    <div>{item.title}</div>
                    <small className="text-muted">{item.description}</small>
                  </div>
                </div>
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Area */}
      <main className="main-content">
        <Container fluid className="p-4">
          <Outlet />
        </Container>
      </main>

      {/* Custom Styles */}
      <style>{`
        .finance-layout {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .finance-navbar {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(40, 167, 69, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 0;
          z-index: 1030;
        }

        .finance-navbar .navbar-brand {
          color: #28a745 !important;
          font-weight: 700;
          font-size: 1.25rem;
          transition: all 0.3s ease;
        }

        .finance-navbar .navbar-brand:hover {
          color: #20c997 !important;
          transform: translateY(-1px);
        }

        .nav-item-finance {
          color: #495057 !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-decoration: none !important;
          display: flex;
          align-items: center;
          margin: 0 0.25rem;
        }

        .nav-item-finance:hover {
          color: #28a745 !important;
          background: rgba(40, 167, 69, 0.1);
          transform: translateY(-2px);
        }

        .nav-item-finance.active {
          color: #28a745 !important;
          background: rgba(40, 167, 69, 0.15);
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
        }

        .staff-dropdown {
          color: #495057 !important;
          background: transparent !important;
          border: none !important;
          padding: 0.5rem !important;
          border-radius: 12px !important;
          transition: all 0.3s ease;
        }

        .staff-dropdown:hover,
        .staff-dropdown:focus {
          background: rgba(40, 167, 69, 0.1) !important;
          color: #28a745 !important;
          box-shadow: none !important;
        }

        .staff-dropdown::after {
          display: none;
        }        .staff-dropdown-menu {
          min-width: 250px;
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          overflow: hidden;
        }

        .main-content {
          margin-top: 80px;
          min-height: calc(100vh - 80px);
          padding: 0;
        }

        .mobile-nav-item {
          color: #495057 !important;
          font-weight: 500;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          text-decoration: none !important;
          display: flex;
          align-items: center;
        }

        .mobile-nav-item:hover {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745 !important;
        }

        .mobile-nav-item.active {
          background: rgba(40, 167, 69, 0.15);
          color: #28a745 !important;
          font-weight: 600;
          border-left: 4px solid #28a745;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .finance-navbar .navbar-brand span {
            font-size: 1rem;
          }
          
          .main-content {
            margin-top: 70px;
            min-height: calc(100vh - 70px);
          }
        }

        @media (max-width: 575.98px) {
          .finance-navbar {
            padding: 0.5rem 0;
          }
          
          .finance-navbar .navbar-brand {
            font-size: 1.1rem;
          }
          
          .main-content {
            margin-top: 65px;
            min-height: calc(100vh - 65px);
          }
          
          .main-content .container-fluid {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default FinanceLayout