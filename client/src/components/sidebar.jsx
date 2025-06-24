import React, { useState } from 'react'
import { Nav, Button, Badge } from 'react-bootstrap'
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
  Bank
} from 'react-bootstrap-icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserService from '../services/user.Service'

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    UserService.logout()
    navigate('/login')
  }

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: House,
      path: '/admin/dashboard',
      badge: null
    },
    {
      title: 'Manage Users',
      icon: People,
      path: '/admin/manage-users',
      badge: 'New'
    },
    {
      title: 'Manage Staff',
      icon: PersonGear,
      path: '/admin/manage-staff',
      badge: null
    },
    // {
    //   title: 'Transactions',
    //   icon: CreditCard,
    //   path: '/admin/transactions',
    //   badge: null
    // },    {
    //   title: 'Reports',
    //   icon: BarChart,
    //   path: '/admin/reports',
    //   badge: null
    // },
    // {
    //   title: 'Audit Logs',
    //   icon: FileEarmarkText,
    //   path: '/admin/audit-logs',
    //   badge: null
    // },
    // {
    //   title: 'Settings',
    //   icon: Gear,
    //   path: '/admin/settings',
    //   badge: null
    // }
  ]

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
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
      </div>

      {/* Navigation */}
      <Nav className="flex-column py-3 sidebar-nav">
        {navigationItems.map((item, index) => {
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
        })}
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
      `}</style>
    </div>
  )
}

export default Sidebar