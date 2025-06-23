import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';
import '../styles/ManageTransactions.css';

function TransactionModal({ open, onClose, transaction, onApprove, onReject }) {
  if (!open || !transaction) return null;
  return (
    <div className="mtx-modal-overlay">
      <div className="mtx-modal">
        <h2 className="mtx-modal-title">Transaction Details</h2>
        <div className="mtx-modal-content">
          <div className="mtx-modal-row"><span>Transaction ID</span><span>{transaction.id}</span></div>
          <div className="mtx-modal-row"><span>Date</span><span>{transaction.date}</span></div>
          <div className="mtx-modal-row"><span>From</span><span>{transaction.from}</span></div>
          <div className="mtx-modal-row"><span>To</span><span>{transaction.to}</span></div>
          <div className="mtx-modal-row"><span>Type</span><span>{transaction.type}</span></div>
          <div className="mtx-modal-row"><span>Amount</span><span>{transaction.amount}</span></div>
          <div className="mtx-modal-row"><span>Status</span><span>{transaction.status}</span></div>
          <div className="mtx-modal-row"><span>Details</span><span>-</span></div>
        </div>
        <div className="mtx-modal-actions">
          <button className="mtx-modal-close" onClick={onClose}>Close</button>
          <button className="mtx-modal-approve" onClick={onApprove}>Approve</button>
          <button className="mtx-modal-reject" onClick={onReject}>Reject</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageTransactions() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTxn, setModalTxn] = useState(null);
  // Mock data for demonstration
  const transactions = [
    { id: '132', date: '06/06/0506', from: 'Jollibee', to: 'Yuzang', type: 'Payment', amount: '₱932.79', status: 'Pending' },
    { id: '132', date: '06/06/0505', from: 'Rolando', to: 'Pepet', type: 'Transfer', amount: '₱932.79', status: 'Pending' },
    { id: '132', date: '06/06/0506', from: 'Charles', to: 'Jaymes', type: 'Transfer', amount: '₱932.79', status: 'Pending' },
    { id: '132', date: '06/06/0506', from: 'Buto', to: 'William', type: 'Transfer', amount: '₱932.79', status: 'Pending' },
  ];

  const filteredTransactions = transactions.filter(
    txn =>
      txn.from.toLowerCase().includes(search.toLowerCase()) ||
      txn.to.toLowerCase().includes(search.toLowerCase()) ||
      txn.type.toLowerCase().includes(search.toLowerCase()) ||
      txn.amount.toLowerCase().includes(search.toLowerCase()) ||
      txn.status.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = selected.length === filteredTransactions.length && filteredTransactions.length > 0;
  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(filteredTransactions.map((t) => t.id));
  };
  const handleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const handleMenuClick = (txn) => {
    setModalTxn(txn);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setModalTxn(null);
  };
  const handleApprove = () => {
    // Implement approve logic here
    setModalOpen(false);
  };
  const handleReject = () => {
    // Implement reject logic here
    setModalOpen(false);
  };

  return (
    <div className="manage-transactions-container">
      <AdminSidebar />
      <div className="manage-transactions-main-content">
        <Header />
        <main className="manage-transactions-content">
          <div className="mtx-top-cards-row">
            <div className="mtx-top-card">Pending Transactions</div>
            <div className="mtx-top-card">Approval Rate</div>
            <div className="mtx-top-card">Total Transaction</div>
          </div>
          <div className="mtx-table-action-row">
            <span className="mtx-selected-count">{selected.length} Selected Transactions</span>
            <button className="mtx-approve-btn">Approve Transaction</button>
            <button className="mtx-reject-btn">Reject Transaction</button>
          </div>
          <div className="mtx-table-section">
            <div className="mtx-table-header-row">
              <div className="mtx-table-date-filter">
                <span className="mtx-table-date-label">Date</span>
                <span className="mtx-table-date-dropdown">LAST WEEK ▼</span>
              </div>
              <div className="mtx-table-search">
                <input
                  className="mtx-table-search-input"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="mtx-table-wrapper">
              <table className="mtx-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={allSelected} onChange={handleSelectAll} /></th>
                    <th>ID</th>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn, idx) => (
                    <tr key={idx}>
                      <td><input type="checkbox" checked={selected.includes(txn.id)} onChange={() => handleSelect(txn.id)} /></td>
                      <td>{txn.id}</td>
                      <td>{txn.date}</td>
                      <td>{txn.from}</td>
                      <td>{txn.to}</td>
                      <td>{txn.type}</td>
                      <td>{txn.amount}</td>
                      <td><span className="mtx-status mtx-status-pending">Pending</span></td>
                      <td>
                        <button className="mtx-view-details-btn" onClick={() => handleMenuClick(txn)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <TransactionModal
            open={modalOpen}
            onClose={handleModalClose}
            transaction={modalTxn}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </main>
      </div>
    </div>
  );
}
