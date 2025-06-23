import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';
import '../styles/ManageAccounts.css';
import { getUsers, getTransactionsByUser } from '../services/users.Service';

export default function ManageAccounts() {
  const [activeTab, setActiveTab] = useState('customer');
  const [clients, setClients] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState({});

  useEffect(() => {
    const fetchUsersAndTransactions = async () => {
      try {
        const allUsers = await getUsers();
        setClients(allUsers);
        // Fetch latest transaction for each user
        const transactionsMap = {};
        await Promise.all(
          allUsers.map(async (user) => {
            try {
              const txns = await getTransactionsByUser(user.userId || user._id);
              if (txns && txns.length > 0) {
                // Assuming transactions are sorted by date desc, or sort here
                const latest = txns[0];
                transactionsMap[user.userId || user._id] = `${latest.type || ''} ₱${
                  latest.amount || ''
                } on ${latest.date ? new Date(latest.date).toLocaleDateString() : ''}`;
              } else {
                transactionsMap[user.userId || user._id] = 'No latest transaction';
              }
            } catch {
              transactionsMap[user.userId || user._id] = 'No latest transaction';
            }
          })
        );
        setLatestTransactions(transactionsMap);
      } catch (e) {
        setClients([]);
      }
    };
    fetchUsersAndTransactions();
  }, []);

  const filteredClients = clients.filter(client => {
    if (activeTab === 'customer') return client.accountType === 'personal';
    if (activeTab === 'business') return client.accountType === 'business';
    return true;
  });

  const totalClients = filteredClients.length;
  const totalBalance = filteredClients.reduce((sum, client) => sum + (typeof client.balance === 'number' ? client.balance : 0), 0);

  return (
    <div className="manage-accounts-container">
      <AdminSidebar />
      <div className="manage-accounts-main-content">
        <Header />
        <main className="manage-accounts-content">
          <div className="ma-top-cards-row">
            <div className="ma-top-card">Total clients: {totalClients}</div>
            <div className="ma-top-card">Total balance held: ₱{totalBalance.toLocaleString()}</div>
            <div className="ma-top-card">Approval Rate</div>
          </div>
          <div className="ma-tabs-row">
            <button
              className={`ma-tab-btn${
                activeTab === 'customer' ? ' active' : ''
              }`}
              onClick={() => setActiveTab('customer')}
            >
              Customer
            </button>
            <button
              className={`ma-tab-btn${
                activeTab === 'business' ? ' active' : ''
              }`}
              onClick={() => setActiveTab('business')}
            >
              Business Owner
            </button>
          </div>
          <div className="ma-table-section">
            <h3 className="ma-section-heading">Clients List</h3>
            <div className="ma-table-wrapper">
              <table className="ma-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Account Number</th>
                    <th>Balance</th>
                    <th>Latest Transaction</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, idx) => (
                    <tr key={client.userId || client._id || idx}>
                      <td>{client.userId || ''}</td>
                      <td>{activeTab === 'business' ? (client.companyName || client.fullName || client.name) : (client.fullName || client.name)}</td>
                      <td>{client.accountNumber || client.account}</td>
                      <td>{typeof client.balance === 'number' ? `₱${client.balance.toLocaleString()}` : '₱0'}</td>
                      <td>{latestTransactions[client.userId || client._id] || 'No latest transaction'}</td>
                      <td>
                        <button className="ma-view-info-btn">View Info</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
