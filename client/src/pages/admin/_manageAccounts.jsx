import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/adminLayout'
import { Table, Button, Modal, Form, Input, message, Popconfirm, Select, Tooltip, Card, Divider, Avatar, Space, Typography, Input as AntInput, Row, Col } from 'antd'
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, BankOutlined } from '@ant-design/icons'
import userService from '../../service/user.Service'

const accountTypes = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
]

const { Title, Text } = Typography;

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formAccountType, setFormAccountType] = useState('personal')
  const [actionLoading, setActionLoading] = useState(false)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')

  // Fetch accounts (users)
  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const data = await userService.getAllUsers()
      setAccounts(data)
    } catch (err) {
      message.error('Failed to fetch accounts')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  // Open modal for add/edit
  const openModal = (account = null) => {
    setEditingAccount(account)
    setModalVisible(true)
    if (account) {
      form.setFieldsValue(account)
      setFormAccountType(account.accountType || 'personal')
    } else {
      form.resetFields()
      setFormAccountType('personal')
    }
  }

  // Handle add/edit submit
  const handleOk = async () => {
    setActionLoading(true)
    try {
      const values = await form.validateFields()
      if (editingAccount) {
        await userService.updateUser(editingAccount.id, values)
        message.success('Account updated')
      } else {
        await userService.createUser(values)
        message.success('Account created')
      }
      setModalVisible(false)
      fetchAccounts()
    } catch (err) {
      message.error(err.message || 'Operation failed')
    }
    setActionLoading(false)
  }

  // Handle delete
  const handleDelete = async (accountId) => {
    try {
      await userService.deleteUser(accountId)
      message.success('Account deleted')
      fetchAccounts()
    } catch (err) {
      message.error('Delete failed')
    }
  }

  // Filter accounts by search
  const filteredAccounts = accounts.filter(account => {
    const name = account.firstName ? `${account.firstName} ${account.lastName}` : account.businessName || '';
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      (account.email && account.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (account.accountNumber && account.accountNumber.toString().includes(searchText))
    );
  });

  const columns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (_, r) => (
        <Avatar style={{ backgroundColor: '#3949ab' }} icon={<UserOutlined />}>
          {r.firstName ? r.firstName[0] : (r.businessName ? r.businessName[0] : '?')}
        </Avatar>
      ),
      width: 48,
    },
    { title: 'Account Number', dataIndex: 'accountNumber', key: 'accountNumber' },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (_, r) => r.firstName ? `${r.firstName} ${r.lastName}` : r.businessName },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Account Type', dataIndex: 'accountType', key: 'accountType', render: (t) => t.charAt(0).toUpperCase() + t.slice(1) },
    { title: 'Balance', dataIndex: 'balance', key: 'balance', render: (b) => b !== undefined ? `₱ ${Number(b).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '₱ 0.00' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit account">
            <Button icon={<EditOutlined />} type="link" onClick={() => openModal(record)} />
          </Tooltip>
          <Popconfirm title="Are you sure to delete this account?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Tooltip title="Delete account">
              <Button icon={<DeleteOutlined />} type="link" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div style={{ minHeight: '100vh', background: '#f4f6fb', padding: 0 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '32px 32px 18px 32px',
          background: 'linear-gradient(90deg, #e3e8ff 0%, #f5f7fa 100%)',
          borderBottom: '1px solid #e0e7ff',
          minHeight: 90,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BankOutlined style={{ fontSize: 38, color: '#3949ab', marginRight: 18 }} />
            <div>
              <Title level={2} style={{ margin: 0, color: '#1a237e', fontWeight: 700, letterSpacing: 0.5, fontSize: 28 }}>Manage Accounts</Title>
              <Text type="secondary" style={{ fontSize: 15 }}>Admin control panel for account management</Text>
            </div>
          </div>
          <Button type="primary" size="middle" icon={<PlusOutlined />} onClick={() => openModal()} style={{ borderRadius: 8, fontWeight: 600, background: '#3949ab', height: 40, fontSize: 15, padding: '0 18px' }}>
            Add Account
          </Button>
        </div>
        <div style={{ maxWidth: 1100, margin: '24px auto 0 auto', padding: '0 12px' }}>
          <Card
            style={{ borderRadius: 14, boxShadow: '0 4px 18px rgba(57,73,171,0.08)', minHeight: '60vh', background: '#fff', margin: 0, border: 'none' }}
            styles={{ body: { padding: 28, minHeight: '50vh' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <Title level={4} style={{ margin: 0, color: '#3949ab', fontWeight: 700, letterSpacing: 0.2, fontSize: 20 }}>Account List</Title>
              <AntInput
                placeholder="Search accounts by name, email, or account number..."
                prefix={<SearchOutlined />}
                allowClear
                style={{ width: 260, borderRadius: 8, fontSize: 14, height: 36 }}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <Divider style={{ margin: '0 0 16px 0' }} />
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredAccounts}
              loading={loading}
              bordered
              pagination={{ pageSize: 8, showSizeChanger: false }}
              style={{ background: '#fafbfc', borderRadius: 10, fontSize: 14 }}
              size="middle"
              scroll={{ x: 'max-content', y: 340 }}
              rowClassName={(_, idx) => idx % 2 === 0 ? 'ant-table-row-light' : 'ant-table-row-dark'}
            />
            <Modal
              title={<span style={{ fontWeight: 700, fontSize: 22, color: '#3949ab', letterSpacing: 0.2 }}>{editingAccount ? 'Edit Account' : 'Add Account'}</span>}
              open={modalVisible}
              onOk={handleOk}
              onCancel={() => setModalVisible(false)}
              destroyOnHidden
              footer={[
                <Button key="back" onClick={() => setModalVisible(false)} disabled={actionLoading} style={{ borderRadius: 7, fontWeight: 500, height: 38, fontSize: 14 }}>Cancel</Button>,
                <Button key="submit" type="primary" loading={actionLoading} onClick={handleOk} style={{ borderRadius: 7, background: '#3949ab', fontWeight: 600, height: 38, fontSize: 14 }}>
                  {editingAccount ? 'Update' : 'Create'}
                </Button>,
              ]}
              styles={{ body: { padding: 0, borderRadius: 14, background: '#f5f7fa' } }}
            >
              <div style={{ padding: 24, borderRadius: 14, background: '#fff', boxShadow: '0 2px 8px rgba(57,73,171,0.07)' }}>
                <div style={{ textAlign: 'center', marginBottom: 18 }}>
                  <Avatar size={54} style={{ backgroundColor: '#3949ab', marginBottom: 7 }} icon={<UserOutlined />} />
                  <Title level={5} style={{ margin: 0, color: '#3949ab', fontWeight: 700 }}>{editingAccount ? 'Edit Account Details' : 'Create New Account'}</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>Fill in the account information below</Text>
                </div>
                <Form form={form} layout="vertical" style={{ maxWidth: 340, margin: '0 auto' }}>
                  <Row gutter={12}>
                    <Col span={24}>
                      <Form.Item name="accountType" label={<span style={{ fontWeight: 600 }}>Account Type</span>} rules={[{ required: true }]}> 
                        <Select
                          options={accountTypes}
                          onChange={v => setFormAccountType(v)}
                          value={formAccountType}
                          placeholder="Select account type"
                          style={{ borderRadius: 7, fontSize: 14, height: 36 }}
                        />
                      </Form.Item>
                    </Col>
                    {formAccountType === 'business' ? (
                      <Col span={24}>
                        <Form.Item name="businessName" label={<span style={{ fontWeight: 600 }}>Business Name</span>} rules={[{ required: true, message: 'Business name required' }]}> 
                          <Input style={{ borderRadius: 7, fontSize: 14, height: 36 }} placeholder="Enter business name" />
                        </Form.Item>
                      </Col>
                    ) : (
                      <>
                        <Col span={12}>
                          <Form.Item name="firstName" label={<span style={{ fontWeight: 600 }}>First Name</span>} rules={[{ required: true, message: 'First name required' }]}> 
                            <Input style={{ borderRadius: 7, fontSize: 14, height: 36 }} placeholder="First name" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="lastName" label={<span style={{ fontWeight: 600 }}>Last Name</span>} rules={[{ required: true, message: 'Last name required' }]}> 
                            <Input style={{ borderRadius: 7, fontSize: 14, height: 36 }} placeholder="Last name" />
                          </Form.Item>
                        </Col>
                      </>
                    )}
                    <Col span={24}>
                      <Form.Item name="email" label={<span style={{ fontWeight: 600 }}>Email</span>} rules={[{ required: true, type: 'email' }]}> 
                        <Input style={{ borderRadius: 7, fontSize: 14, height: 36 }} placeholder="Email address" />
                      </Form.Item>
                    </Col>
                    {!editingAccount && (
                      <Col span={24}>
                        <Form.Item name="password" label={<span style={{ fontWeight: 600 }}>Password</span>} rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}> 
                          <Input.Password style={{ borderRadius: 7, fontSize: 14, height: 36 }} placeholder="Password" />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                </Form>
              </div>
            </Modal>
          </Card>
        </div>
        <style>{`
          .ant-table-row-light { background: #f5f7fa !important; }
          .ant-table-row-dark { background: #fff !important; }
        `}</style>
      </div>
    </AdminLayout>
  )
}

export default ManageAccounts