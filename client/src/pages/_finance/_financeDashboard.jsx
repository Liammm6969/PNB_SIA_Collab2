import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  Cash,
  GraphUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Building,
  FileText,
  ArrowRepeat,
  PersonCircle,
  PiggyBank,
  ExclamationTriangle,
  ShieldLock,
  BarChart,
} from "react-bootstrap-icons";
import DepositRequestService from "../../services/depositRequest.Service";
import TransactionService from "../../services/transaction.Service";
import BankReserveService from "../../services/bankReserve.Service";
import "../../styles/financeStyles/financeDashboard.css";

// Create service instances
const bankReserveService = new BankReserveService();

const FinanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Bank Reserve Data
  const [bankReserve, setBankReserve] = useState(null);

  // Real data from API
  const [stats, setStats] = useState({
    pending: { count: 0, totalAmount: 0 },
    approved: { count: 0, totalAmount: 0 },
    rejected: { count: 0, totalAmount: 0 },
    processing: { count: 0, totalAmount: 0 },
  });

  const [recentDeposits, setRecentDeposits] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({
    todayRequests: 0,
    monthlyApproved: 0,
    successRatio: 0,
  });
  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load deposit request statistics
      const statsData = await DepositRequestService.getDepositRequestStats();
      setStats(statsData); // Load bank reserve data
      try {
        const bankReserveData = await bankReserveService.getBankReserve();
        setBankReserve(bankReserveData.data);
      } catch (bankError) {
        console.warn("Could not load bank reserve:", bankError.message);
        setBankReserve(null);
      }

      // Load recent deposit requests (pending ones first)
      const pendingRequests = await DepositRequestService.getAllDepositRequests(
        "Pending",
        10
      );
      setRecentDeposits(pendingRequests);
      // Load recent transactions from all users
      try {
        const allPayments = await TransactionService.getAllPayments();
        // Get the latest 10 payments
        const sortedPayments = allPayments
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
          )
          .slice(0, 10);
        setRecentTransactions(sortedPayments);
      } catch (transactionError) {
        console.warn("Could not load payments:", transactionError.message);
        setRecentTransactions([]);
      }

      // Calculate analytics
      const today = new Date().toDateString();
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      const todayRequests = recentDeposits.filter(
        (deposit) => new Date(deposit.createdAt).toDateString() === today
      ).length;

      const monthlyApproved = statsData.approved.totalAmount || 0;
      const totalProcessed =
        (statsData.approved.count || 0) + (statsData.rejected.count || 0);
      const successRatio =
        totalProcessed > 0
          ? Math.round(((statsData.approved.count || 0) / totalProcessed) * 100)
          : 0;

      setAnalytics({
        todayRequests,
        monthlyApproved,
        successRatio,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboardData();
    } catch (error) {
      setError("Failed to refresh dashboard data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = () => {
    // Placeholder for export functionality
    alert("Exporting report...");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        bg: "warning",
        icon: <Clock size={12} className="me-1" />,
        text: "Pending",
      },
      Approved: {
        bg: "success",
        icon: <CheckCircle size={12} className="me-1" />,
        text: "Approved",
      },
      Rejected: {
        bg: "danger",
        icon: <XCircle size={12} className="me-1" />,
        text: "Rejected",
      },
    };

    const config = statusConfig[status] || {
      bg: "secondary",
      icon: null,
      text: status,
    };
    return (
      <Badge
        bg={config.bg}
        className="d-flex align-items-center"
        style={{ fontSize: "0.75rem", width: "fit-content" }}
      >
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const getTransactionTypeBadge = (type) => {
    const typeConfig = {
      deposit: { bg: "success", text: "Deposit" },
      transfer: { bg: "primary", text: "Transfer" },
      withdrawal: { bg: "warning", text: "Withdrawal" },
    };
    return typeConfig[type] || { bg: "secondary", text: "Transaction" };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stat cards config
  const statCards = [
    {
      title: "Total Approved",
      amount: formatCurrency(stats.approved.totalAmount),
      subtitle: `${stats.approved.count} requests approved`,
      icon: CheckCircle,
      colorClass: "finance-stat-card-success",
      iconBg: "bg-success bg-opacity-25",
    },
    {
      title: "Pending Approval",
      amount: formatCurrency(stats.pending.totalAmount),
      subtitle: `${stats.pending.count} requests pending`,
      icon: Clock,
      colorClass: "finance-stat-card-warning",
      iconBg: "bg-warning bg-opacity-25",
    },
    {
      title: "Rejected",
      amount: formatCurrency(stats.rejected.totalAmount),
      subtitle: `${stats.rejected.count} requests rejected`,
      icon: XCircle,
      colorClass: "finance-stat-card-danger",
      iconBg: "bg-danger bg-opacity-25",
    },
    {
      title: "Bank Reserve",
      amount: bankReserve ? BankReserveService.formatCurrency(bankReserve.total_balance) : "Loading...",
      subtitle: bankReserve ? `${BankReserveService.getReserveStatusText(bankReserve.total_balance)} Level` : "Fetching data...",
      icon: ShieldLock,
      colorClass: bankReserve ? `finance-stat-card-${BankReserveService.getReserveStatusColor(bankReserve.total_balance)}` : "finance-stat-card-info",
      iconBg: "bg-info bg-opacity-25",
    },
  ];

  // Analytics config
  const analyticsData = [
    { label: "Today's Requests", value: analytics.todayRequests, icon: BarChart },
    { label: "Monthly Approved", value: formatCurrency(analytics.monthlyApproved), icon: GraphUp },
    { label: "Success Ratio", value: `${analytics.successRatio}%`, icon: BarChart },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="ms-3">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="finance-dashboard-bg p-3 p-md-4">
      <div className="container-xl">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-3 d-flex align-items-center justify-content-center shadow finance-header-icon">
              <BarChart size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="fw-bold text-dark mb-1 fs-2">Finance Dashboard</h1>
              <p className="text-muted mb-0">Monitor and manage all deposit operations and financial metrics</p>
            </div>
          </div>
          <div className="d-flex gap-3">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="d-flex align-items-center gap-2 px-4 py-2 bg-white border border-0 rounded-lg shadow-sm finance-dashboard-btn refresh"
            >
              <ArrowRepeat className={`me-2 ${refreshing ? 'spin' : ''}`} size={18} />
              <span>Refresh</span>
            </Button>
            <Button
              onClick={handleExport}
              className="d-flex align-items-center gap-2 px-4 py-2 finance-dashboard-btn export"
            >
              <Download className="me-2" size={18} />
              <span>Export Report</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          {statCards.map((stat, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-3">
              <div className={`rounded-3 p-4 shadow finance-stat-card ${stat.colorClass} h-100 d-flex flex-column justify-content-between`}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className={`rounded-3 d-flex align-items-center justify-content-center ${stat.iconBg} finance-stat-icon`}>
                    <stat.icon size={28} className="text-white" />
                  </div>
                  <div className="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                    <div className="rounded-circle bg-white bg-opacity-50" style={{ width: 12, height: 12 }}></div>
                  </div>
                </div>
                <h3 className="text-white text-opacity-90 fs-6 mb-2">{stat.title}</h3>
                <p className="text-white fs-3 fw-bold mb-2">{stat.amount}</p>
                <p className="text-white-50 mb-0">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Overview */}
        <div className="bg-white rounded-3 shadow p-4 mb-4 border finance-analytics-section">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-2 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
              <GraphUp size={20} className="text-primary" />
            </div>
            <h2 className="fs-5 fw-bold text-dark mb-0">Analytics Overview</h2>
          </div>
          <div className="row g-4 mb-4">
            {analyticsData.map((item, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="text-center p-3 bg-light rounded-3 h-100">
                  <div className="d-flex justify-content-center mb-2">
                    <div className="rounded-2 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <item.icon size={20} className="text-primary" />
                    </div>
                  </div>
                  <div className="text-muted small mb-1">{item.label}</div>
                  <div className="fs-4 fw-bold text-dark">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center py-5 text-muted">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 64, height: 64 }}>
              <BarChart size={32} className="text-secondary" />
            </div>
            <p className="small fst-italic">Analytics chart coming soon...</p>
          </div>
        </div>

        {/* Pending Deposit Requests */}
        <div className="bg-white rounded-3 shadow p-4 mb-4 border finance-card">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-2 bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <FileText size={20} className="text-success" />
              </div>
              <div>
                <h2 className="fs-5 fw-bold text-dark mb-0">Pending Deposit Requests</h2>
                <p className="text-muted small mb-0">Recent deposit requests awaiting approval</p>
              </div>
            </div>
            <Button
              variant="link"
              className="text-primary fw-medium text-decoration-underline"
              onClick={() => (window.location.href = "/finance/deposits")}
            >
              View All
            </Button>
          </div>
          {recentDeposits.length === 0 ? (
            <div className="text-center py-5">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
                <FileText size={40} className="text-secondary" />
              </div>
              <p className="text-muted">No pending requests at the moment</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0 finance-table">
              <thead>
                <tr>
                  <th className="border-0 text-muted fw-semibold">Request ID</th>
                  <th className="border-0 text-muted fw-semibold">Customer</th>
                  <th className="border-0 text-muted fw-semibold">Amount</th>
                  <th className="border-0 text-muted fw-semibold">Status</th>
                  <th className="border-0 text-muted fw-semibold">Date</th>
                  <th className="border-0 text-muted fw-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentDeposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td className="border-0">
                      <code className="text-primary">{deposit.id}</code>
                    </td>
                    <td className="border-0">
                      <div>
                        <div className="fw-semibold">{deposit.customerName}</div>
                        <small className="text-muted">{deposit.accountNumber}</small>
                      </div>
                    </td>
                    <td className="border-0">
                      <div className="fw-bold text-success fs-6">{formatCurrency(deposit.amount)}</div>
                    </td>
                    <td className="border-0">
                      <Badge bg="warning" className="d-flex align-items-center" style={{ fontSize: "0.85rem", width: "fit-content" }}>
                        <Clock size={12} className="me-1" /> Pending
                      </Badge>
                    </td>
                    <td className="border-0">
                      <small className="text-muted">{new Date(deposit.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</small>
                    </td>
                    <td className="border-0">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="p-2"
                        title="View Details"
                        onClick={() => (window.location.href = `/finance/deposits`)}
                      >
                        <Eye size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3 shadow p-4 mb-4 border finance-card recent-transactions-card">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-2 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <Cash size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="fs-5 fw-bold text-dark mb-0">Recent Transactions</h2>
                <p className="text-muted small mb-0">Latest financial transactions across all accounts</p>
              </div>
            </div>
            <Button
              variant="link"
              className="text-primary fw-medium text-decoration-underline recent-transactions-viewall"
              onClick={() => (window.location.href = "/finance/transactions")}
            >
              View All
            </Button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-5">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
                <Cash size={40} className="text-secondary" />
              </div>
              <p className="text-muted">No recent transactions</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table recent-transactions-table align-middle mb-0">
                <thead>
                  <tr>
                    <th className="border-0 text-dark fw-semibold">Transaction ID</th>
                    <th className="border-0 text-dark fw-semibold">Type</th>
                    <th className="border-0 text-dark fw-semibold">From</th>
                    <th className="border-0 text-dark fw-semibold">To</th>
                    <th className="border-0 text-dark fw-semibold">Amount</th>
                    <th className="border-0 text-dark fw-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction, index) => (
                    <tr key={transaction.paymentStringId || transaction.paymentId || transaction.id || `transaction-${index}` }>
                      <td className="border-0">
                        <a href="#" className="fw-semibold text-primary text-decoration-none recent-transactions-id">{transaction.paymentStringId || transaction.paymentId || transaction.id}</a>
                      </td>
                      <td className="border-0">
                        {transaction.fromUser === 0 ? (
                          <span className="badge recent-badge-deposit">Deposit</span>
                        ) : (
                          <span className="badge recent-badge-transfer">Transfer</span>
                        )}
                      </td>
                      <td className="border-0">
                        <div className="d-flex align-items-center gap-2">
                          {transaction.fromUser === 0 ? (
                            <span className="recent-transactions-finance-icon">$</span>
                          ) : (
                            <PersonCircle size={18} className="text-secondary" />
                          )}
                          <span className="recent-transactions-user">{transaction.fromUser === 0 ? 'Finance' : (transaction.fromUserDetails?.name || `User ${transaction.fromUser}`)}</span>
                        </div>
                      </td>
                      <td className="border-0">
                        <div className="d-flex align-items-center gap-2">
                          <PersonCircle size={18} className="text-secondary" />
                          <span className="recent-transactions-user">{transaction.toUserDetails?.name || `User ${transaction.toUser}`}</span>
                        </div>
                      </td>
                      <td className="border-0">
                        <span className="fw-bold text-dark recent-transactions-amount">{formatCurrency(transaction.amount)}</span>
                      </td>
                      <td className="border-0">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={16} className="text-secondary" />
                          <span className="recent-transactions-date">{new Date(transaction.createdAt || transaction.date).toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
