import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, ProgressBar } from 'react-bootstrap'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <FileText size={28} className="me-2 text-success" />
            Reports Management
          </h1>
          <p className="text-muted mb-0">
            Generate, manage, and download financial reports and analytics
          </p>
        </div>
        <div className="d-flex gap-2">
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

      {/* Report Statistics */}
      <Row className="g-3 mb-4">
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 report-stat-card bg-primary text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{reportStats.totalReports}</h4>
              <small>Total Reports</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 report-stat-card bg-success text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{reportStats.generatedToday}</h4>
              <small>Generated Today</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 report-stat-card bg-warning text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{reportStats.pendingReports}</h4>
              <small>Pending</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 report-stat-card bg-info text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{reportStats.scheduledReports}</h4>
              <small>Scheduled</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 report-stat-card bg-secondary text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{reportStats.avgGenerationTime}</h4>
              <small>Avg Generation</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <Card className="border-0 report-stat-card bg-dark text-white">
            <Card.Body className="text-center p-3">
              <h4 className="mb-1">{reportStats.totalDownloads}</h4>
              <small>Total Downloads</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Report Templates */}
      <Row className="g-4 mb-4">
        <Col>
          <Card className="border-0 report-card">
            <Card.Header className="bg-transparent border-bottom-0 pb-0">
              <h5 className="fw-bold mb-0 d-flex align-items-center">
                <BarChart size={20} className="me-2 text-success" />
                Available Report Templates
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {reportTemplates.map((report) => (
                  <Col lg={4} md={6} key={report.id}>
                    <Card className="border report-template-card h-100">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-start mb-3">
                          <div className="me-3">
                            {report.icon}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1">{report.name}</h6>
                            <p className="text-muted small mb-2">{report.description}</p>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              {getCategoryBadge(report.category)}
                              <Badge bg="outline-secondary">{report.frequency}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">Available Formats:</small>
                          <div className="d-flex gap-1">
                            {report.format.map((fmt, index) => (
                              <Badge key={index} bg="light" text="dark" className="d-flex align-items-center">
                                {getFormatIcon(fmt)}
                                {fmt}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">Report Fields:</small>
                          <div className="small text-muted">
                            {report.fields.slice(0, 2).join(', ')}
                            {report.fields.length > 2 && ` + ${report.fields.length - 2} more`}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Last: {formatDate(report.lastGenerated)}
                          </small>
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleGenerateReport(report)}
                          >
                            <Download size={14} className="me-1" />
                            Generate
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Reports */}
      <Card className="border-0 report-card">
        <Card.Header className="bg-transparent border-bottom-0 pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 d-flex align-items-center">
              <Clock size={20} className="me-2 text-success" />
              Recently Generated Reports
            </h5>
            <Button variant="outline-success" size="sm">
              View All Reports
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th className="border-0 text-muted fw-semibold">Report Name</th>
                <th className="border-0 text-muted fw-semibold">Generated By</th>
                <th className="border-0 text-muted fw-semibold">Date</th>
                <th className="border-0 text-muted fw-semibold">Format</th>
                <th className="border-0 text-muted fw-semibold">Size</th>
                <th className="border-0 text-muted fw-semibold">Downloads</th>
                <th className="border-0 text-muted fw-semibold">Status</th>
                <th className="border-0 text-muted fw-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td className="border-0">
                    <div>
                      <div className="fw-semibold">{report.name}</div>
                      <small className="text-muted">{report.id}</small>
                    </div>
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
                    <Badge bg="success">
                      <CheckCircle size={12} className="me-1" />
                      {report.status}
                    </Badge>
                  </td>
                  <td className="border-0">
                    <div className="d-flex gap-1">
                      <Button variant="outline-info" size="sm" className="p-2" title="Preview">
                        <Eye size={14} />
                      </Button>
                      <Button variant="outline-success" size="sm" className="p-2" title="Download">
                        <Download size={14} />
                      </Button>
                      <Button variant="outline-primary" size="sm" className="p-2" title="Send">
                        <Send size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

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

      {/* Custom Styles */}
      <style>{`
        .report-stat-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .report-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .report-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          transition: all 0.3s ease;
        }

        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2);
        }

        .report-template-card {
          transition: all 0.3s ease;
          border-radius: 12px;
        }

        .report-template-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-color: #28a745;
        }

        .table tbody tr:hover {
          background-color: rgba(40, 167, 69, 0.05) !important;
        }

        .btn-outline-success:hover {
          background-color: #28a745;
          border-color: #28a745;
        }

        .btn-outline-info:hover {
          background-color: #17a2b8;
          border-color: #17a2b8;
        }

        .btn-outline-primary:hover {
          background-color: #007bff;
          border-color: #007bff;
        }
      `}</style>
    </Container>
  )
}

export default ReportsManagement