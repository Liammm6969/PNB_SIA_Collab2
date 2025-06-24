import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/adminLayout'
import { Table, Button, Modal, Form, Input, message, Popconfirm, Select, Tooltip, Spin } from 'antd'
import userService from '../../service/user.Service'

const accountTypes = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
  { label: 'Admin', value: 'admin' },
]

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formAccountType, setFormAccountType] = useState('personal')
  const [actionLoading, setActionLoading] = useState(false)
  const [form] = Form.useForm()

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (err) {
      message.error('Failed to fetch users')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Open modal for add/edit
  const openModal = (user = null) => {
    setEditingUser(user)
    setModalVisible(true)
    if (user) {
      form.setFieldsValue(user)
      setFormAccountType(user.accountType || 'personal')
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
      if (editingUser) {
        await userService.updateUser(editingUser.id, values)
        message.success('User updated')
      } else {
        await userService.createUser(values)
        message.success('User created')
      }
      setModalVisible(false)
      fetchUsers()
    } catch (err) {
      message.error(err.message || 'Operation failed')
    }
    setActionLoading(false)
  }

  // Handle delete
  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId)
      message.success('User deleted')
      fetchUsers()
    } catch (err) {
      message.error('Delete failed')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (_, r) => r.firstName ? `${r.firstName} ${r.lastName}` : r.businessName },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Account Type', dataIndex: 'accountType', key: 'accountType', render: (t) => t.charAt(0).toUpperCase() + t.slice(1) },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Tooltip title="Edit user">
            <Button type="link" onClick={() => openModal(record)}>Edit</Button>
          </Tooltip>
          <Popconfirm title="Are you sure to delete this user?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Tooltip title="Delete user">
              <Button type="link" danger>Delete</Button>
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: 32,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        minHeight: 600,
      }}>
        <h2 style={{
          marginBottom: 24,
          fontWeight: 700,
          fontSize: 32,
          color: '#1a237e',
          letterSpacing: 1,
        }}>Manage Users</h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <Button type="primary" size="large" onClick={() => openModal()} style={{ borderRadius: 8, fontWeight: 600, background: '#3949ab' }}>
            + Add User
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          bordered
          pagination={{ pageSize: 8 }}
          style={{ background: '#fafbfc', borderRadius: 12 }}
        />
        <Modal
          title={<span style={{ fontWeight: 700, fontSize: 22, color: '#3949ab' }}>{editingUser ? 'Edit User' : 'Add User'}</span>}
          open={modalVisible}
          onOk={handleOk}
          onCancel={() => setModalVisible(false)}
          destroyOnClose
          footer={[
            <Button key="back" onClick={() => setModalVisible(false)} disabled={actionLoading} style={{ borderRadius: 6 }}>Cancel</Button>,
            <Button key="submit" type="primary" loading={actionLoading} onClick={handleOk} style={{ borderRadius: 6, background: '#3949ab' }}>
              {editingUser ? 'Update' : 'Create'}
            </Button>,
          ]}
          bodyStyle={{ padding: 28, borderRadius: 12, background: '#f5f7fa' }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="accountType" label={<span style={{ fontWeight: 600 }}>Account Type</span>} rules={[{ required: true }]}> 
              <Select
                options={accountTypes}
                onChange={v => setFormAccountType(v)}
                value={formAccountType}
                placeholder="Select account type"
                style={{ borderRadius: 6 }}
              />
            </Form.Item>
            {formAccountType === 'business' ? (
              <Form.Item name="businessName" label={<span style={{ fontWeight: 600 }}>Business Name</span>} rules={[{ required: true, message: 'Business name required' }]}> 
                <Input style={{ borderRadius: 6 }} />
              </Form.Item>
            ) : (
              <>
                <Form.Item name="firstName" label={<span style={{ fontWeight: 600 }}>First Name</span>} rules={[{ required: true, message: 'First name required' }]}> 
                  <Input style={{ borderRadius: 6 }} />
                </Form.Item>
                <Form.Item name="lastName" label={<span style={{ fontWeight: 600 }}>Last Name</span>} rules={[{ required: true, message: 'Last name required' }]}> 
                  <Input style={{ borderRadius: 6 }} />
                </Form.Item>
              </>
            )}
            <Form.Item name="email" label={<span style={{ fontWeight: 600 }}>Email</span>} rules={[{ required: true, type: 'email' }]}> 
              <Input style={{ borderRadius: 6 }} />
            </Form.Item>
            {!editingUser && (
              <Form.Item name="password" label={<span style={{ fontWeight: 600 }}>Password</span>} rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}> 
                <Input.Password style={{ borderRadius: 6 }} />
              </Form.Item>
            )}
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default ManageUsers