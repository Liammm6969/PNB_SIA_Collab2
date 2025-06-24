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
  let openKey = undefined;
  if (currentPath.startsWith('/admin/manage/users')) {
    selectedKey = '2-1';
    openKey = '2';
  } else if (currentPath.startsWith('/admin/manage/accounts')) {
    selectedKey = '2-2';
    openKey = '2';
  } else if (currentPath.startsWith('/admin/manage/deposits')) {
    selectedKey = '2-3';
    openKey = '2';
  } else if (currentPath.startsWith('/admin/manage/withdraw')) {
    selectedKey = '2-4';
    openKey = '2';
  } else if (currentPath.startsWith('/admin/manage/loans')) {
    selectedKey = '2-5';
    openKey = '2';
  } else if (currentPath.startsWith('/admin/profile')) selectedKey = '3';
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
        defaultOpenKeys={openKey ? [openKey] : []}
        onClick={({ key }) => {
          if (key === '1') navigate('/admin/dashboard');
          else if (key === '2-1') navigate('/admin/manage/users');
          else if (key === '2-2') navigate('/admin/manage/accounts');
          else if (key === '2-3') navigate('/admin/manage/deposits');
          else if (key === '2-4') navigate('/admin/manage/withdraw');
          else if (key === '2-5') navigate('/admin/manage/loans');
          else if (key === '3') navigate('/admin/profile');
          else if (key === '4') navigate('/login');
        }}
        items={[
          {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
          {
            key: '2',
            icon: <TeamOutlined />,
            label: 'Manage',
            children: [
              {
                key: '2-1',
                icon: <TeamOutlined />,
                label: 'Manage Users',
              },
              {
                key: '2-2',
                icon: <UserOutlined />,
                label: 'Manage Accounts',
              },
              {
                key: '2-3',
                icon: <UserOutlined />,
                label: 'Manage Deposits',
              },
              {
                key: '2-4',
                icon: <UserOutlined />,
                label: 'Manage Withdraw',
              },
              {
                key: '2-5',
                icon: <UserOutlined />,
                label: 'Manage Loans',
              },
            ],
          },
          {
            key: '3',
            icon: <UserOutlined />,
            label: 'Profile',
          },
          {
            key: '4',
            icon: <LogoutOutlined />,
            label: 'Logout',
          },
        ]}
      />
    </Sider>
  )
}

export default sidebar