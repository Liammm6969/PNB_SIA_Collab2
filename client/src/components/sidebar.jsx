import React, { useState, useEffect } from 'react'
import { Nav, Button, Badge, Collapse } from 'react-bootstrap'
import { 
  House, 
  People, 
  PersonGear, 
  CreditCard, 
  BarChart,
  FileEarmarkText,
  Gear,
  BoxArrowRight,
  ChevronLeft,
  ChevronRight,
  Bank,
  ChevronDown,
  ChevronUp,
  Folder,
  FolderFill
} from 'react-bootstrap-icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserService from '../services/user.Service'

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedItems, setExpandedItems] = useState({})

  const handleLogout = () => {
    UserService.logout()
    navigate('/login')
  }

  const toggleExpanded = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }))
  }

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: House,
      path: '/admin/dashboard',
      badge: null,
      type: 'single'
    },
    {
      title: 'Manage',
      icon: Folder,
      iconExpanded: FolderFill,
      type: 'parent',
      key: 'manage',
      children: [
        {
          title: 'Users',
          icon: People,
          path: '/admin/manage/users',
          badge: 'New'
        },
        {
          title: 'Staff',
          icon: PersonGear,
          path: '/admin/manage/staff',
          badge: null
        }
      ]
    },
    // {
    //   title: 'Transactions',
    //   icon: CreditCard,
    //   path: '/admin/transactions',
    //   badge: null,
    //   type: 'single'
    // },
    // {
    //   title: 'Reports',
    //   icon: BarChart,
    //   path: '/admin/reports',
    //   badge: null,
    //   type: 'single'
    // },
    // {
    //   title: 'Audit Logs',
    //   icon: FileEarmarkText,
    //   path: '/admin/audit-logs',
    //   badge: null,
    //   type: 'single'
    // },
    // {
    //   title: 'Settings',
    //   icon: Gear,
    //   path: '/admin/settings',
    //   badge: null,
    //   type: 'single'
    // }
  ]

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const isParentActive = (children) => {
    return children.some(child => isActiveRoute(child.path))
  }
  // Auto-expand parent items when their children are active
  useEffect(() => {
    navigationItems.forEach(item => {
      if (item.type === 'parent' && isParentActive(item.children)) {
        setExpandedItems(prev => ({
          ...prev,
          [item.key]: true
        }))
      }
    })
  }, [location.pathname])

  const renderNavigationItem = (item, index) => {
    if (item.type === 'parent') {
      const isExpanded = expandedItems[item.key]
      const isActive = isParentActive(item.children)
      const IconComponent = isExpanded && item.iconExpanded ? item.iconExpanded : item.icon
      
      return (
        <div key={index}>
          {/* Parent Item */}
          <Nav.Item className="px-3 mb-1">
            <div
              className={`nav-link-custom parent-nav ${isActive ? 'active' : ''}`}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => !isCollapsed && toggleExpanded(item.key)}
            >
              <IconComponent size={20} className="me-3" />
              {!isCollapsed && (
                <>
                  <span className="flex-grow-1">{item.title}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </>
              )}
            </div>
          </Nav.Item>

          {/* Child Items */}
          {!isCollapsed && (
            <Collapse in={isExpanded}>
              <div className="child-nav-container">
                {item.children.map((child, childIndex) => {
                  const ChildIconComponent = child.icon
                  const isChildActive = isActiveRoute(child.path)
                  
                  return (
                    <Nav.Item key={childIndex} className="px-3 mb-1">
                      <Nav.Link
                        as={Link}
                        to={child.path}
                        className={`nav-link-custom child-nav ${isChildActive ? 'active' : ''}`}
                        style={{
                          color: 'white',
                          textDecoration: 'none',
                          padding: '10px 16px 10px 52px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          background: isChildActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          position: 'relative',
                          marginLeft: '8px',
                          borderLeft: '2px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <ChildIconComponent size={18} className="me-3" />
                        <span className="flex-grow-1">{child.title}</span>
                        {child.badge && (
                          <Badge 
                            bg="warning" 
                            text="dark"
                            className="ms-2"
                            style={{ fontSize: '10px' }}
                          >
                            {child.badge}
                          </Badge>
                        )}
                      </Nav.Link>
                    </Nav.Item>
                  )
                })}
              </div>
            </Collapse>
          )}

          {/* Collapsed state - show children as dots */}
          {isCollapsed && isActive && (
            <div className="px-3 mb-1">
              <div className="d-flex justify-content-center">
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    background: '#ffc107',
                    borderRadius: '50%',
                    margin: '2px 0'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )
    } else {
      // Single navigation item
      const IconComponent = item.icon
      const isActive = isActiveRoute(item.path)
      
      return (
        <Nav.Item key={index} className="px-3 mb-1">
          <Nav.Link
            as={Link}
            to={item.path}
            className={`nav-link-custom ${isActive ? 'active' : ''}`}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <IconComponent size={20} className="me-3" />
            {!isCollapsed && (
              <>
                <span className="flex-grow-1">{item.title}</span>
                {item.badge && (
                  <Badge 
                    bg="warning" 
                    text="dark"
                    className="ms-2"
                    style={{ fontSize: '10px' }}
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
            {isCollapsed && item.badge && (
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  background: '#ffc107',
                  borderRadius: '50%'
                }}
              />
            )}
          </Nav.Link>
        </Nav.Item>
      )
    }
  }

  return (
    <div 
      className={`sidebar glass-card ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      style={{
        width: isCollapsed ? '80px' : '280px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        transition: 'width 0.3s ease',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 0,
        border: 'none',
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div className="sidebar-header p-3 text-white border-bottom border-light border-opacity-25">
        <div className="d-flex align-items-center justify-content-between">
          {!isCollapsed && (
            <div className="d-flex align-items-center">
              <Bank size={28} className="me-2" />
              <div>
                <h5 className="mb-0 fw-bold">PNB Admin</h5>
                <small className="opacity-75">Banking System</small>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="d-flex justify-content-center w-100">
              <Bank size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <div className="sidebar-toggle">
        <Button
          variant="link"
          className="text-white p-2 border-0 w-100"
          onClick={onToggleCollapse}
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 0
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>      {/* Navigation */}
      <Nav className="flex-column py-3 sidebar-nav">
        {navigationItems.map((item, index) => renderNavigationItem(item, index))}
      </Nav>

      {/* Logout Button */}
      <div className="mt-auto p-3">
        <Button
          variant="outline-light"
          className="w-100 d-flex align-items-center justify-content-center"
          onClick={handleLogout}
          style={{
            padding: '12px',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <BoxArrowRight size={20} className={isCollapsed ? '' : 'me-2'} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>      {/* Custom Styles */}
      <style>{`
        .nav-link-custom:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
        }
        
        .nav-link-custom.active {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          font-weight: 600;
        }
        
        .parent-nav:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
        }
        
        .parent-nav.active {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          font-weight: 600;
        }
        
        .child-nav:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        
        .child-nav.active {
          background: rgba(255, 255, 255, 0.25) !important;
          color: white !important;
          font-weight: 600;
        }
        
        .child-nav-container {
          margin-bottom: 8px;
        }
        
        .sidebar-nav .nav-item .nav-link {
          border: none !important;
        }
        
        .sidebar {
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        .collapse {
          transition: height 0.2s ease !important;
        }
      `}</style>
    </div>
  )
}

export default Sidebar