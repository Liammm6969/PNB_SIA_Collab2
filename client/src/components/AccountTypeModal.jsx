import React from 'react';
import '../styles/AccountTypeModal.css';


const AccountTypeModal = ({ isOpen, onClose, onSelectAccountType }) => {
  if (!isOpen) return null;

  return (
    <div className="account-type-modal-overlay">
      <div className="account-type-modal">
        <div className="account-type-modal-header">
          <h2>Choose Account Type</h2>
        </div>
        
        <p className="account-type-modal-subtitle">What type of account you want to create?</p>
        
        <div className="account-type-options">
          <div 
            className="account-type-option" 
            onClick={() => onSelectAccountType('business')}
          >
            <div className="account-type-icon business">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="account-type-details">
              <h3>Business Owner</h3>
              <p>Manage business finance and payments</p>
            </div>
          </div>
          
          <div 
            className="account-type-option"
            onClick={() => onSelectAccountType('personal')}
          >
            <div className="account-type-icon personal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="account-type-details">
              <h3>Personal</h3>
              <p>Personal banking and digital payments</p>
            </div>
          </div>
        </div>
        
        <button className="account-type-cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AccountTypeModal;
