import React from 'react';
import { Layout } from 'antd';
import Sidebar from './sidebar';

const { Header, Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header style={{ background: '#fff', padding: 0, fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
          Admin Panel
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'auto', height: 'calc(100vh - 64px)' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;