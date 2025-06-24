import React from 'react'
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const sidebar = () => {
  const navigate = useNavigate();
  // Get current path to highlight selected menu item
  const currentPath = window.location.pathname;
  let selectedKey = '1';
  if (currentPath.startsWith('/admin/manage-users')) selectedKey = '2';
  else if (currentPath.startsWith('/admin/profile')) selectedKey = '3';
  else if (currentPath.startsWith('/admin/dashboard')) selectedKey = '1';

  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ height: 32, margin: 16, background: 'rgba(0,0,0,0.1)', borderRadius: 6, textAlign: 'center', lineHeight: '32px', fontWeight: 'bold' }}>
        Admin
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => {
          if (key === '1') navigate('/admin/dashboard');
          else if (key === '2') navigate('/admin/manage-users');
          else if (key === '3') navigate('/admin/profile');
          else if (key === '4') navigate('/login');
        }}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<TeamOutlined />}>
          Manage Users
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <Menu.Item key="4" icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default sidebar