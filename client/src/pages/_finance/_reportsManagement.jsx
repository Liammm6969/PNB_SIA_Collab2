import React, { useState, useEffect } from 'react'
import { Container, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap'
import { 
  FileText, 
  Download, 
  Calendar, 
  Eye, 
  Printer,
  Send,
  Building,
  Cash,
  GraphUp,
  GraphDown,
  Clock,
  CheckCircle,
  ExclamationTriangle,
  BarChart,
  FileEarmarkPdf,
  FileEarmarkExcel,
  Search,
  Upload
} from 'react-bootstrap-icons'
import '../../styles/financeStyles/reportsManagement.css'

const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [dateRange, setDateRange] = useState('30days')
  const [reportType, setReportType] = useState('')
  const [generatingReport, setGeneratingReport] = useState(false)
  const [alert, setAlert] = useState(null)

  const [reportTemplates] = useState([
    {
      id: 'RPT_001',
      name: 'Daily Deposit Summary',
      description: 'Comprehensive daily deposit activity report',
      category: 'Daily',
      format: ['PDF', 'Excel'],
      lastGenerated: '2025-01-25 09:00',
      frequency: 'Daily',
      icon: <FileText size={24} className="text-primary" />,
      fields: ['Deposit Count', 'Total Amount', 'Status Breakdown', 'Branch Performance']
    },
    {
      id: 'RPT_002',
      name: 'Monthly Financial Report',
      description: 'Monthly financial performance and metrics',
      category: 'Monthly',
      format: ['PDF', 'Excel'],
      lastGenerated: '2025-01-01 08:00',
      frequency: 'Monthly',
      icon: <BarChart size={24} className="text-success" />,
      fields: ['Total Revenue', 'Processing Fees', 'Approval Rates', 'Growth Analysis']
    },
    {
      id: 'RPT_003',
      name: 'Branch Performance Report',
      description: 'Individual branch deposit processing performance',
      category: 'Analytics',
      format: ['PDF', 'Excel'],
      lastGenerated: '2025-01-24 16:30',
      frequency: 'Weekly',
      icon: <Building size={24} className="text-info" />,
      fields: ['Branch Efficiency', 'Volume Metrics', 'Customer Satisfaction', 'SLA Compliance']
    },
    {
      id: 'RPT_004',
      name: 'Customer Transaction Report',
      description: 'Detailed customer deposit transaction history',
      category: 'Customer',
      format: ['PDF', 'Excel', 'CSV'],
      lastGenerated: '2025-01-25 10:15',
      frequency: 'On-demand',
      icon: <Cash size={24} className="text-warning" />,
      fields: ['Customer Details', 'Transaction History', 'Deposit Methods', 'Amount Analysis']
    },
    {
      id: 'RPT_005',
      name: 'Regulatory Compliance Report',
      description: 'Compliance and audit trail report for regulatory requirements',
      category: 'Compliance',
      format: ['PDF'],
      lastGenerated: '2025-01-20 14:00',
      frequency: 'Monthly',
      icon: <ExclamationTriangle size={24} className="text-danger" />,
      fields: ['AML Compliance', 'Transaction Monitoring', 'Suspicious Activity', 'Documentation']
    },
    {
      id: 'RPT_006',
      name: 'Processing Time Analysis',
      description: 'Analysis of deposit processing times and efficiency metrics',
      category: 'Analytics',
      format: ['PDF', 'Excel'],
      lastGenerated: '2025-01-23 11:45',
      frequency: 'Weekly',
      icon: <Clock size={24} className="text-secondary" />,
      fields: ['Average Processing Time', 'SLA Performance', 'Bottleneck Analysis', 'Staff Performance']
    }
  ])

  const [recentReports] = useState([
    {
      id: 'GEN_001',
      name: 'Daily Deposit Summary - Jan 25, 2025',
      generatedBy: 'Finance Staff',
      generatedDate: '2025-01-25 14:30',
      format: 'PDF',
      size: '2.4 MB',
      status: 'Completed',
      downloadCount: 5
    },
    {
      id: 'GEN_002',
      name: 'Branch Performance Report - Week 3',
      generatedBy: 'Finance Manager',
      generatedDate: '2025-01-24 16:30',
      format: 'Excel',
      size: '1.8 MB',
      status: 'Completed',
      downloadCount: 12
    },
    {
      id: 'GEN_003',
      name: 'Customer Transaction Report - Premium Customers',
      generatedBy: 'Finance Analyst',
      generatedDate: '2025-01-24 10:15',
      format: 'CSV',
      size: '856 KB',
      status: 'Completed',
      downloadCount: 3
    },
    {
      id: 'GEN_004',
      name: 'Processing Time Analysis - January 2025',
      generatedBy: 'Finance Staff',
      generatedDate: '2025-01-23 11:45',
      format: 'PDF',
      size: '3.1 MB',
      status: 'Completed',
      downloadCount: 8
    }
  ])

  const [reportStats] = useState({
    totalReports: 156,
    generatedToday: 8,
    pendingReports: 2,
    scheduledReports: 12,
    avgGenerationTime: '45 seconds',
    totalDownloads: 1247
  })

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleGenerateReport = (report) => {
    setSelectedReport(report)
    setReportType(report.id)
    setShowGenerateModal(true)
  }

  const confirmGenerateReport = async () => {
    setGeneratingReport(true)
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setShowGenerateModal(false)
      showAlert(
        `Report "${selectedReport.name}" has been generated successfully and is ready for download.`,
        'success'
      )
    } catch (error) {
      showAlert('Error generating report. Please try again.', 'danger')
    } finally {
      setGeneratingReport(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFormatIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <FileEarmarkPdf size={16} className="text-danger me-1" />
      case 'excel':
        return <FileEarmarkExcel size={16} className="text-success me-1" />
      case 'csv':
        return <FileText size={16} className="text-info me-1" />
      default:
        return <FileText size={16} className="text-muted me-1" />
    }
  }

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      Daily: { bg: 'primary', text: 'Daily' },
      Monthly: { bg: 'success', text: 'Monthly' },
      Analytics: { bg: 'info', text: 'Analytics' },
      Customer: { bg: 'warning', text: 'Customer' },
      Compliance: { bg: 'danger', text: 'Compliance' }
    }

    const config = categoryConfig[category] || { bg: 'secondary', text: category }
    return <Badge bg={config.bg}>{config.text}</Badge>
  }

  return (
    <Container fluid className="px-4">
      {/* Alert */}
      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="mb-4">
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <div className="reports-header">
        <div className="reports-header-left">
          <div className="reports-header-icon">
            <FileText size={28} className="text-white" />
          </div>
          <div>
            <div className="reports-header-title">Reports Management</div>
            <div className="reports-header-subtitle">Generate, manage, and download financial reports and analytics</div>
          </div>
        </div>
        <div className="reports-header-actions">
          <Button variant="outline-success">
            <Upload size={16} className="me-2" />
            Upload Template
          </Button>
          <Button variant="success">
            <Printer size={16} className="me-2" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="finance-stat-grid mb-4">
        <div className="finance-stat-card finance-stat-card-info">
          <div className="stat-label">Total Reports</div>
          <div className="stat-value">{reportStats.totalReports}</div>
        </div>
        <div className="finance-stat-card finance-stat-card-success">
          <div className="stat-label">Generated Today</div>
          <div className="stat-value">{reportStats.generatedToday}</div>
        </div>
        <div className="finance-stat-card finance-stat-card-warning">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{reportStats.pendingReports}</div>
        </div>
        <div className="finance-stat-card finance-stat-card-info">
          <div className="stat-label">Scheduled</div>
          <div className="stat-value">{reportStats.scheduledReports}</div>
        </div>
        <div className="finance-stat-card finance-stat-card-secondary">
          <div className="stat-label">Avg Generation</div>
          <div className="stat-value">{reportStats.avgGenerationTime}</div>
        </div>
        <div className="finance-stat-card finance-stat-card-dark">
          <div className="stat-label">Total Downloads</div>
          <div className="stat-value">{reportStats.totalDownloads}</div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="mb-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center">
          <BarChart size={20} className="me-2 text-success" />
          Available Report Templates
        </h5>
        <div className="reports-templates-grid-2x3">
          {reportTemplates.map((report) => {
            // Determine color class for icon and badge
            let colorClass = 'blue';
            if (report.category === 'Daily') colorClass = 'blue';
            else if (report.category === 'Monthly') colorClass = 'green';
            else if (report.category === 'Analytics') colorClass = 'info';
            else if (report.category === 'Customer') colorClass = 'yellow';
            else if (report.category === 'Compliance') colorClass = 'red';
            else colorClass = 'gray';
            return (
              <div key={report.id} className="report-template-card">
                <div className="p-4 d-flex flex-column h-100">
                  <div className="template-header">
                    <div className={`template-icon-bg ${colorClass}`}>{report.icon}</div>
                    <div className="template-header-content">
                      <div className="template-title">{report.name}</div>
                      <div className="template-desc">{report.description}</div>
                      <div className="template-badges">
                        <span className={`template-badge-category ${colorClass}`}>{report.category}</span>
                        <span className="template-badge-freq">{report.frequency}</span>
                      </div>
                    </div>
                  </div>
                  <hr className="template-divider" />
                  <div className="template-formats">
                    {report.format.map((fmt, index) => (
                      <span key={index} className="template-format-badge">
                        {getFormatIcon(fmt)}
                        {fmt}
                      </span>
                    ))}
                  </div>
                  <div className="template-fields">
                    {report.fields.slice(0, 2).join(', ')}
                    {report.fields.length > 2 && ` + ${report.fields.length - 2} more`}
                  </div>
                  <div className="template-footer mt-auto">
                    <span className="template-last">Last: {formatDate(report.lastGenerated)}</span>
                    <Button 
                      className="template-generate-btn"
                      onClick={() => handleGenerateReport(report)}
                    >
                      <Download size={14} className="me-1" />
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="reports-table-card">
        <div className="px-4 pt-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            <Clock size={20} className="me-2 text-success" />
            Recently Generated Reports
          </h5>
          <Button variant="outline-success" size="sm">
            View All Reports
          </Button>
        </div>
        <div className="pt-3 px-4">
          <div className="table-responsive">
            <table className="table reports-table align-middle mb-0">
              <thead>
                <tr>
                  <th className="border-0">Report Name</th>
                  <th className="border-0">Generated By</th>
                  <th className="border-0">Date</th>
                  <th className="border-0">Format</th>
                  <th className="border-0">Size</th>
                  <th className="border-0">Downloads</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id}>
                    <td className="border-0">
                      <a href="#" className="report-name-link">{report.name}</a>
                      <span className="report-id">{report.id}</span>
                    </td>
                    <td className="border-0">
                      <span className="text-muted">{report.generatedBy}</span>
                    </td>
                    <td className="border-0">
                      <small className="text-muted">{formatDate(report.generatedDate)}</small>
                    </td>
                    <td className="border-0">
                      <div className="d-flex align-items-center">
                        {getFormatIcon(report.format)}
                        {report.format}
                      </div>
                    </td>
                    <td className="border-0">
                      <span className="text-muted">{report.size}</span>
                    </td>
                    <td className="border-0">
                      <Badge bg="info">{report.downloadCount}</Badge>
                    </td>
                    <td className="border-0">
                      <span className={`status-badge completed`}>{report.status}</span>
                    </td>
                    <td className="border-0">
                      <Button variant="link" size="sm" className="p-2" title="Preview">
                        <Eye size={16} />
                      </Button>
                      <Button variant="link" size="sm" className="p-2" title="Download">
                        <Download size={16} />
                      </Button>
                      <Button variant="link" size="sm" className="p-2" title="Send">
                        <Send size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fw-bold">
            <FileText size={24} className="me-2" />
            Generate Report - {selectedReport?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              <div className="bg-light rounded p-3 mb-4">
                <h6 className="fw-bold mb-2">{selectedReport.name}</h6>
                <p className="text-muted mb-2">{selectedReport.description}</p>
                <div className="d-flex gap-2">
                  {getCategoryBadge(selectedReport.category)}
                  <Badge bg="outline-secondary">{selectedReport.frequency}</Badge>
                </div>
              </div>

              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Date Range</Form.Label>
                      <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                        <option value="today">Today</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                        <option value="custom">Custom Range</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Output Format</Form.Label>
                      <Form.Select>
                        {selectedReport.format.map((fmt, index) => (
                          <option key={index} value={fmt.toLowerCase()}>{fmt}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Include Fields</Form.Label>
                      {selectedReport.fields.map((field, index) => (
                        <Form.Check
                          key={index}
                          type="checkbox"
                          label={field}
                          defaultChecked={true}
                          className="mb-1"
                        />
                      ))}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Additional Options</Form.Label>
                      <Form.Check type="checkbox" label="Include summary charts" className="mb-1" />
                      <Form.Check type="checkbox" label="Include trend analysis" className="mb-1" />
                      <Form.Check type="checkbox" label="Email report after generation" className="mb-1" />
                      <Form.Check type="checkbox" label="Schedule recurring generation" className="mb-1" />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowGenerateModal(false)} disabled={generatingReport}>
            Cancel
          </Button>
          <Button 
            variant="success"
            onClick={confirmGenerateReport}
            disabled={generatingReport}
          >
            {generatingReport ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} className="me-2" />
                Generate Report
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ReportsManagement