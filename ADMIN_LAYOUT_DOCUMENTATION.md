## Admin Layout Documentation

### Overview
The admin layout provides a complete administrative interface for the PNB Banking System with the following components:

### 🏗️ Components Created

#### 1. **Sidebar Component** (`src/components/sidebar.jsx`)
- **Features:**
  - Collapsible sidebar with toggle functionality
  - Navigation items with icons and badges
  - Active route highlighting
  - Responsive design for mobile devices
  - Smooth animations and transitions
  - Logout functionality

- **Navigation Items:**
  - Dashboard
  - Manage Users (with "New" badge)
  - Manage Staff
  - Transactions
  - Reports
  - Audit Logs
  - Settings

#### 2. **Admin Layout** (`src/layouts/adminLayout.jsx`)
- **Features:**
  - Top navigation bar with search functionality
  - User profile dropdown with notifications
  - Responsive sidebar integration
  - Authentication checks
  - User profile fetching and display
  - Professional styling with glass morphism effects

#### 3. **Admin Pages**

##### **Admin Dashboard** (`src/pages/_admin/_adminDashboard.jsx`)
- Statistics cards for key metrics
- Recent users and transactions tables
- Quick action buttons
- Professional data visualization

##### **Manage Users** (`src/pages/_admin/_manageUsers.jsx`)
- Complete user management interface
- Search and filtering capabilities
- User details modal
- Export functionality
- Status management

##### **Manage Staff** (`src/pages/_admin/_manageStaff.jsx`)
- Staff member management
- Department-wise organization
- Add new staff functionality
- Role-based filtering

### 🎨 Design Features

#### **Modern UI/UX**
- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Responsive design
- Professional color scheme

#### **Interactive Elements**
- Hover effects on cards and buttons
- Active state indicators
- Loading states
- Alert notifications
- Modal dialogs

### 🔧 Technical Features

#### **Responsive Design**
- Mobile-first approach
- Collapsible sidebar for smaller screens
- Adaptive layouts
- Touch-friendly interface

#### **State Management**
- React hooks for local state
- User authentication integration
- Real-time data fetching
- Error handling

### 🚀 How to Use

#### **Navigation**
1. Access admin routes via `/admin/dashboard`
2. Use the sidebar to navigate between sections
3. Toggle sidebar collapse/expand as needed

#### **User Management**
1. View all users in the Manage Users section
2. Search and filter users by various criteria
3. View detailed user information
4. Export user data

#### **Staff Management**
1. View staff by departments
2. Add new staff members
3. Manage staff status and information

### 🎯 Integration

#### **Authentication**
- Automatic login checks
- User profile fetching
- Secure logout functionality
- Session management

#### **API Integration**
- Ready for backend API integration
- Error handling for API calls
- Loading states during data fetching

### 📱 Mobile Responsiveness

The admin layout is fully responsive:
- **Desktop**: Full sidebar with all features
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Hidden sidebar with toggle button

### 🔒 Security Features

- Route protection
- Authentication verification
- Secure user data handling
- Automatic logout on token expiry

### 🎨 Customization

The layout supports easy customization:
- Color themes can be modified in `styles.css`
- Navigation items can be added/removed in sidebar component
- Layout structure is modular and extensible

### 📋 File Structure

```
src/
├── components/
│   └── sidebar.jsx
├── layouts/
│   └── adminLayout.jsx
├── pages/
│   └── _admin/
│       ├── _adminDashboard.jsx
│       ├── _manageUsers.jsx
│       └── _manageStaff.jsx
└── assets/
    └── styles.css
```

### 🔗 Dependencies

The admin layout uses:
- React Bootstrap for UI components
- React Bootstrap Icons for icons
- React Router for navigation
- Custom CSS for styling

This admin layout provides a solid foundation for banking system administration with modern design, responsive layout, and comprehensive functionality.
