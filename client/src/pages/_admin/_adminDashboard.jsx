import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  ProgressBar,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  People,
  CreditCard,
  GraphUp,
  Shield,
  Eye,
  Plus,
  Download,
} from "react-bootstrap-icons";
import AdminLayout from "../../layouts/adminLayout";
import AdminService from "../../services/admin.Service";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    securityAlerts: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [statsData, usersData, transactionsData] = await Promise.all([
          AdminService.getDashboardStats(),
          AdminService.getRecentUsers(5),
          AdminService.getRecentTransactions(5),
        ]);

        setStats(statsData);
        setRecentUsers(usersData);
        setRecentTransactions(transactionsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { bg: "success", text: "Active" },
      Pending: { bg: "warning", text: "Pending" },
      Inactive: { bg: "secondary", text: "Inactive" },
      Completed: { bg: "success", text: "Completed" },
      Processing: { bg: "primary", text: "Processing" },
      Failed: { bg: "danger", text: "Failed" },
    };

    const config = statusConfig[status] || { bg: "secondary", text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserDisplayName = (user) => {
    if (user.accountType === "personal") {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.accountType === "business") {
      return user.businessName;
    }
    return "Unknown User";
  };

  const getTransactionDisplayName = (transaction, userType) => {
    const user =
      userType === "from" ? transaction.fromUser : transaction.toUser;
    if (!user) return "Unknown User";
    return getUserDisplayName(user);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Dashboard</h1>
          <p className="text-muted mb-0">
            Welcome back! Here's what's happening with your bank today.
          </p>
        </div>
        <Button variant="primary" className="btn-admin-primary">
          <Download size={16} className="me-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col xl={3} md={6}>
          <Card className="border-0 stats-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Total Users</h6>
                  <h3 className="fw-bold mb-0">
                    {stats.totalUsers.toLocaleString()}
                  </h3>{" "}
                  <small className="text-white-50">
                    <GraphUp size={12} className="me-1" />
                    +12% from last month
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <People size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 stats-card-success h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Transactions</h6>
                  <h3 className="fw-bold mb-0">
                    {stats.totalTransactions.toLocaleString()}
                  </h3>{" "}
                  <small className="text-white-50">
                    <GraphUp size={12} className="me-1" />
                    +8% from last month
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <CreditCard size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 stats-card-warning h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white-50 mb-1">Revenue</h6>
                  <h3 className="fw-bold mb-0">
                    {formatCurrency(stats.totalRevenue)}
                  </h3>{" "}
                  <small className="text-white-50">
                    <GraphUp size={12} className="me-1" />
                    +15% from last month
                  </small>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-circle">
                  <GraphUp size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="border-0 stats-card-info h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-black-50 mb-1">Security Alerts</h6>
                  <h3 className="fw-bold mb-0">{stats.securityAlerts}</h3>
                  <small className="text-black-50">Requires attention</small>
                </div>
                <div className="p-3 bg-black bg-opacity-10 rounded-circle">
                  <Shield size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row className="g-4">
        {/* Recent Users */}
        <Col lg={6}>
          <Card className="admin-card border-0 h-100">
            <Card.Header className="bg-transparent border-bottom-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Users</h5>
                <Button
                  variant="link"
                  size="sm"
                  className="text-decoration-none"
                >
                  View All
                </Button>
              </div>
            </Card.Header>            <Card.Body className="pt-3">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th className="border-0 text-muted fw-semibold">User</th>
                    <th className="border-0 text-muted fw-semibold">Type</th>
                    <th className="border-0 text-muted fw-semibold">Status</th>
                    <th className="border-0 text-muted fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="border-0">
                        <div>
                          <div className="fw-semibold">
                            {getUserDisplayName(user)}
                          </div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </td>
                      <td className="border-0">
                        <span className="text-muted text-capitalize">
                          {user.accountType}
                        </span>
                      </td>
                      <td className="border-0">{getStatusBadge("Active")}</td>
                      <td className="border-0">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-primary"
                        >
                          <Eye size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Transactions */}
        <Col lg={6}>
          <Card className="admin-card border-0 h-100">
            <Card.Header className="bg-transparent border-bottom-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Transactions</h5>
                <Button
                  variant="link"
                  size="sm"
                  className="text-decoration-none"
                >
                  View All
                </Button>
              </div>
            </Card.Header>            <Card.Body className="pt-3">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th className="border-0 text-muted fw-semibold">
                      Transaction
                    </th>
                    <th className="border-0 text-muted fw-semibold">Amount</th>
                    <th className="border-0 text-muted fw-semibold">Status</th>
                    <th className="border-0 text-muted fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="border-0">
                        <div>
                          <div className="fw-semibold">
                            {transaction.transactionStringId ||
                              `TXN_${transaction.transactionId}`}
                          </div>
                          <small className="text-muted">
                            {getTransactionDisplayName(transaction, "from")} →{" "}
                            {getTransactionDisplayName(transaction, "to")}
                          </small>
                        </div>
                      </td>
                      <td className="border-0">
                        <span className="fw-semibold">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="border-0">
                        {getStatusBadge("Completed")}
                      </td>
                      <td className="border-0">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-primary"
                        >
                          <Eye size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-4 mt-2">
        <Col>
          <Card className="admin-card border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Quick Actions</h5>
              <Row className="g-3">
                <Col md={3}>
                  <Button
                    variant="outline-primary"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                  >
                    <Plus size={24} className="mb-2" />
                    <span>Add User</span>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="outline-success"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                  >
                    <People size={24} className="mb-2" />
                    <span>Manage Staff</span>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="outline-warning"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                  >
                    <CreditCard size={24} className="mb-2" />
                    <span>View Transactions</span>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="outline-info"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                  >
                    <Shield size={24} className="mb-2" />
                    <span>Security Settings</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;
