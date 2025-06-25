import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container, Dropdown, Badge, Offcanvas } from 'react-bootstrap'
import { 
  PersonCircle, 
  Bell, 
  BoxArrowRight, 
  CreditCard, 
  PiggyBank, 
  ArrowLeftRight, 
  FileText, 
  Gear,
  House,
  List
} from 'react-bootstrap-icons'
import UserService from '../services/user.Service'

const UserLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Check if user is authenticated
      if (!UserService.isAuthenticated()) {
        navigate('/login')
        return
      }

      const userData = UserService.getUserData()
      
      if (!userData.userId) {
        navigate('/login')
        return
      }

      // Load user profile from API
      const userProfile = await UserService.getUserProfile(userData.userId)
      setUser(userProfile)
      
    } catch (error) {
      console.error('Failed to load user data:', error)
      // If API call fails, redirect to login
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User'
    
    if (user.accountType === 'business') {
      return user.businessName || 'Business User'
    } else {
      return user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : 'Personal User'
    }
  }

  // Helper function to format account number for display
  const getDisplayAccountNumber = () => {
    if (!user || !user.accountNumber) return '****0000'
    
    const accountNum = user.accountNumber
    // Show only last 4 digits for security
    return `****${accountNum.slice(-4)}`
  }
  const navigationItems = [
    {
      title: "Dashboard",
      path: "/user/dashboard",
      icon: <House className="me-2" />
    },
    {
      title: "Transfer",
      path: "/user/transfer",
      icon: <ArrowLeftRight className="me-2" />
    },
    {
      title: "Deposit Request",
      path: "/user/deposit-request",
      icon: <PiggyBank className="me-2" />
    },
    {
      title: "Statements",
      path: "/user/statements",
      icon: <FileText className="me-2" />
    }
  ]
  const handleLogout = () => {
    // Clear user session/token using UserService
    UserService.logout()
    navigate('/login')
  }
  const handleNavigation = (path) => {
    navigate(path)
    setShowOffcanvas(false)
  }

  // Show loading state if user data is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading user data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="user-layout">
      {/* Header Navigation */}
      <Navbar expand="lg" className="user-navbar glass-card shadow-sm" fixed="top">
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
            <span className="d-none d-sm-inline">PNB Digital Banking</span>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Nav className="d-none d-lg-flex mx-auto">
            {navigationItems.map((item, index) => (
              <Nav.Link
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item-custom mx-2 ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                {item.title}
              </Nav.Link>
            ))}
          </Nav>

          {/* Right Side Items */}
          <div className="d-flex align-items-center">
            {/* Notifications */}
            <Dropdown className="me-3">
              <Dropdown.Toggle variant="link" className="notification-toggle p-2 border-0">
                <Bell size={20} />
                <Badge bg="danger" pill className="notification-badge">3</Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="notification-dropdown">
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Item>
                  <div className="notification-item">
                    <strong>Transfer Completed</strong>
                    <small className="d-block text-muted">2 minutes ago</small>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div className="notification-item">
                    <strong>New Statement Available</strong>
                    <small className="d-block text-muted">1 hour ago</small>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div className="notification-item">
                    <strong>Account Update</strong>
                    <small className="d-block text-muted">2 hours ago</small>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-center text-primary">
                  View All Notifications
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile Dropdown */}
            <Dropdown>              <Dropdown.Toggle variant="link" className="user-dropdown d-flex align-items-center text-decoration-none border-0">
                <PersonCircle size={32} className="me-2" />
                <div className="d-none d-md-block text-start">
                  <div className="fw-semibold">{getUserDisplayName()}</div>
                  <small className="text-muted">{getDisplayAccountNumber()}</small>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="user-dropdown-menu">
                <Dropdown.Header>
                  <div>{getUserDisplayName()}</div>
                  <small className="text-muted">{user?.email || 'No email'}</small>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => navigate('/user/profile')}>
                  <PersonCircle className="me-2" />
                  Profile Settings
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
            PNB Banking
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
                {item.icon}
                {item.title}
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
    </div>
  )
}

export default UserLayout