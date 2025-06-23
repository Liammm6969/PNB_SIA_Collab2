import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  MoreVertical, 
  X, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  CreditCard,
  DollarSign,
  Hash,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import '../styles/BusinessAcc.css';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

export default function BusinessAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedAccount, setEditedAccount] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBusinessAccounts = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('pnb-user');
        if (!storedUser) {
          navigate('/');
          return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        // Check if user has admin privileges
        if (parsedUser.role !== 'Admin') {
          navigate('/home');
          return;
        }

        // Mock business accounts data
        setAccounts([
          { 
            id: 'BA-122',
            date: '06/06/2025',
            company: 'Jollibee Foods Corp.',
            accountNumber: '333 4444 333 4444',
            balance: '1022.79',
            address: '10/F Jollibee Plaza Building, Emerald Ave., Ortigas Center, Pasig City',
            contactPerson: 'Juan Dela Cruz',
            contactNumber: '+63 (2) 8634-1111',
            email: 'corporate@jollibee.com.ph',
            accountType: 'Corporate',
            dateOpened: '15/03/2019',
            lastActivity: '02/07/2023',
            status: 'Active'
          },
          { 
            id: 'BA-256',
            date: '12/08/2024',
            company: 'SM Investments Corp.',
            accountNumber: '111 2222 333 4444',
            balance: '2576.50',
            address: '10th Floor, One E-Com Center, Harbor Drive, Mall of Asia Complex, Pasay City',
            contactPerson: 'Maria Santos',
            contactNumber: '+63 (2) 8857-0100',
            email: 'info@sminvestments.com',
            accountType: 'Corporate Premium',
            dateOpened: '23/06/2018',
            lastActivity: '15/07/2023',
            status: 'Active'
          },
          { 
            id: 'BA-375',
            date: '18/11/2024',
            company: 'Ayala Corporation',
            accountNumber: '408 6712 012 1345',
            balance: '3347.25',
            address: '32F Tower One and Exchange Plaza, Ayala Triangle, Ayala Avenue, Makati City',
            contactPerson: 'Robert Tan',
            contactNumber: '+63 (2) 7908-3000',
            email: 'corporate@ayala.com.ph',
            accountType: 'Corporate Premium',
            dateOpened: '07/09/2017',
            lastActivity: '22/06/2023',
            status: 'Active'
          },
          { 
            id: 'BA-418',
            date: '24/02/2025',
            company: 'Globe Telecom, Inc.',
            accountNumber: '129 3457 234 1902',
            balance: '1863.90',
            address: 'The Globe Tower, 32nd Street corner 7th Avenue, Bonifacio Global City, Taguig',
            contactPerson: 'Patricia Reyes',
            contactNumber: '+63 (2) 7730-1000',
            email: 'business@globe.com.ph',
            accountType: 'Corporate',
            dateOpened: '12/05/2019',
            lastActivity: '05/07/2023',
            status: 'Active'
          },
          { 
            id: 'BA-527',
            date: '30/04/2025',
            company: 'San Miguel Corporation',
            accountNumber: '234 5893 203 2392',
            balance: '4215.65',
            address: '40 San Miguel Avenue, Mandaluyong City',
            contactPerson: 'Eduardo Garcia',
            contactNumber: '+63 (2) 8632-3000',
            email: 'corporate@sanmiguel.com.ph',
            accountType: 'Corporate Elite',
            dateOpened: '19/11/2016',
            lastActivity: '28/06/2023',
            status: 'Active'
          },
        ]);

      } catch (error) {
        console.error('Error fetching business accounts:', error);
        setError('Failed to load business accounts data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAccounts();
  }, [navigate]);

  const filteredAccounts = accounts.filter(account => {
    return account.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
           account.accountNumber.includes(searchTerm);
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleViewInfo = (account) => {
    setSelectedAccount(account);
    setEditedAccount({...account});
    setShowModal(true);
    setEditMode(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
    setEditMode(false);
    setEditedAccount(null);
  };
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  const handleInputChange = (e, field) => {
    setEditedAccount({
      ...editedAccount,
      [field]: e.target.value
    });
  };
  
  const saveChanges = () => {
    // Update the account in the accounts array
    const updatedAccounts = accounts.map(account => 
      account.id === editedAccount.id ? editedAccount : account
    );
    
    setAccounts(updatedAccounts);
    setSelectedAccount(editedAccount);
    setEditMode(false);
    // In a real app, you would make an API call here to update the account
  };

  return (
    <div className="business-container">
      <AdminSidebar />
      <div className="business-main-content">
        <div className="business-header">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for..." 
              className="search-input" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="user-menu">
            <span>Hello, Admin!</span>
            <Bell size={18} className="notification-icon" />
            <span className="notification-count">1</span>
          </div>
        </div>

        <main className="business-content">
          <div className="business-accounts-container">
            <div className="accounts-header">
              <h2 className="section-title">Business Accounts</h2>
              <div className="filter-container">
                <span className="filter-label">LAST WEEK</span>
                <div className="filter-icon">▼</div>
              </div>
            </div>
            
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search..." 
                className="accounts-search" 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="accounts-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" className="header-checkbox" />
                    </th>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Company</th>
                    <th>Account Number</th>
                    <th>Balance</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account, index) => (
                    <tr key={index}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{account.id}</td>
                      <td>{account.date}</td>
                      <td>{account.company}</td>
                      <td>{account.accountNumber}</td>
                      <td>₱{account.balance}</td>
                      <td>
                        <button className="view-button" onClick={() => handleViewInfo(account)}>View Info</button>
                      </td>
                      <td>
                        <MoreVertical size={16} className="more-options" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>          </div>
        </main>        {/* Enhanced Account Info Modal */}
        {showModal && selectedAccount && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>              <div className="modal-header">
                <h3>Account Information</h3>
              </div>              <div className="modal-body">
                {/* Only show the requested information: ID, Date, Company, Account Number, Balance */}
                <div className="info-section">
                  <div className="info-row">
                    <span className="info-label">Account ID</span>
                    {editMode ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editedAccount.id}
                        onChange={(e) => handleInputChange(e, 'id')}
                      />
                    ) : (
                      <span className="info-value">{selectedAccount.id}</span>
                    )}
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Date</span>
                    {editMode ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editedAccount.date}
                        onChange={(e) => handleInputChange(e, 'date')}
                      />
                    ) : (
                      <span className="info-value">{selectedAccount.date}</span>
                    )}
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Company</span>
                    {editMode ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editedAccount.company}
                        onChange={(e) => handleInputChange(e, 'company')}
                      />
                    ) : (
                      <span className="info-value">{selectedAccount.company}</span>
                    )}
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Account Number</span>
                    {editMode ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editedAccount.accountNumber}
                        onChange={(e) => handleInputChange(e, 'accountNumber')}
                      />
                    ) : (
                      <span className="info-value account-number-value">{selectedAccount.accountNumber}</span>
                    )}
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Balance</span>
                    {editMode ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editedAccount.balance}
                        onChange={(e) => handleInputChange(e, 'balance')}
                      />
                    ) : (
                      <span className="info-value">
                        <span className="balance-value">₱{selectedAccount.balance}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>                <div className="modal-footer">
                <div className="action-buttons">
                  {editMode ? (
                    <button className="save-button" onClick={saveChanges}>
                      Save
                    </button>
                  ) : (
                    <button className="edit-button" onClick={toggleEditMode}>
                      Edit
                    </button>
                  )}
                  <button className="delete-button">
                    Delete
                  </button>
                </div>
                <button className="close-modal-button" onClick={closeModal}>
                  {editMode ? "Cancel" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
