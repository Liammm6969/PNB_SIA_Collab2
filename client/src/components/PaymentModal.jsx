import React, { useState, useEffect } from 'react';
import '../styles/PaymentModal.css';
import { X } from 'lucide-react';
import { transferMoney } from '../services/users.Service';

export default function PaymentModal({ isOpen, onClose, payment, userData, mode = 'payment' }) {
  const [amountToPay, setAmountToPay] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [balanceAfter, setBalanceAfter] = useState(userData?.balance || 0);
  const [recipientId, setRecipientId] = useState('');
  const [transferStatus, setTransferStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (payment && mode === 'payment') {
      setAmountToPay(payment.amount);
      setPaymentDetails(`Payment for ${payment.name}`);
    } else if (mode === 'transfer') {
      setAmountToPay('');
      setPaymentDetails('');
      setRecipientId('');
    }
  }, [payment, mode]);

  useEffect(() => {
    const initialBalance = userData?.balance || 0;
    const amount = parseFloat(amountToPay) || 0;
    setBalanceAfter(initialBalance - amount);
  }, [amountToPay, userData]);

  if (!isOpen || (mode === 'payment' && !payment)) {
    return null;
  }

  const handleAmountChange = (e) => {
    setAmountToPay(e.target.value);
  };
  
  const handleDetailsChange = (e) => {
    setPaymentDetails(e.target.value);
  };

  const handleRecipientIdChange = (e) => {
    setRecipientId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'payment') {
      // Existing payment logic (placeholder)
      console.log('Payment Submitted', {
        ...payment,
        amountPaid: amountToPay,
        details: paymentDetails,
      });
      onClose(); 
    } else if (mode === 'transfer') {
      setLoading(true);
      setTransferStatus(null);
      // Validate recipientId
      if (!recipientId || isNaN(Number(recipientId))) {
        setTransferStatus({ success: false, message: 'Please enter a valid recipient user ID (number).' });
        setLoading(false);
        return;
      }
      try {
        const transferData = {
          fromUser: String(userData?.userId),
          toUser: String(recipientId),
          amount: parseFloat(amountToPay),
          details: paymentDetails,
          recipientType: 'User',
        };
        const result = await transferMoney(transferData);
        setTransferStatus({ success: true, message: result.message || 'Transfer successful!' });
        setTimeout(() => {
          setTransferStatus(null);
          onClose();
        }, 1500);
      } catch (error) {
        let msg = error.message || 'Transfer failed.';
        if (error.errorCode === 'INSUFFICIENT_BALANCE') {
          msg = 'Insufficient balance for this transfer.';
        } else if (error.errorCode === 'USER_NOT_FOUND') {
          msg = 'Recipient not found.';
        }
        setTransferStatus({ success: false, message: msg });
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="modal-header">
          <h2>{mode === 'payment' ? 'Payment Information' : 'Send Money'}</h2>
          {mode === 'payment' && <p>{payment.name}</p>}
        </div>
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Sender Information</h3>
            <div className="form-group">
              <label htmlFor="from">From (Sender)</label>
              <input type="text" id="from" value={userData?.fullName || ''} disabled />
            </div>
            <div className="form-group">
              <label htmlFor="current-balance">Current Balance</label>
              <input type="text" id="current-balance" value={formatCurrency(userData?.balance || 0)} disabled />
            </div>
            <div className="form-group">
              <label htmlFor="amount-to-pay">Amount to {mode === 'payment' ? 'Pay' : 'Send'}</label>
              <input type="number" id="amount-to-pay" value={amountToPay} onChange={handleAmountChange} placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label htmlFor="balance-after">Balance after {mode === 'payment' ? 'payment' : 'transfer'}</label>
              <input type="text" id="balance-after" value={formatCurrency(balanceAfter)} disabled />
            </div>
          </div>
          {mode === 'payment' ? (
            <>
              <h3>Receiver Information</h3>
              <div className="form-group">
                <label htmlFor="to">To (Receiver)</label>
                <input type="text" id="to" value={payment.name} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="payment-details">Payment Details</label>
                <input type="text" id="payment-details" value={paymentDetails} onChange={handleDetailsChange} />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input type="text" id="date" value={new Date().toLocaleDateString('en-CA')} disabled />
              </div>
            </>
          ) : (
            <>
              <h3>Recipient Information</h3>
              <div className="form-group">
                <label htmlFor="recipient-id">Recipient User ID (number)</label>
                <input type="number" id="recipient-id" value={recipientId} onChange={handleRecipientIdChange} placeholder="Enter recipient user ID" required />
              </div>
              <div className="form-group">
                <label htmlFor="payment-details">Transfer Details</label>
                <input type="text" id="payment-details" value={paymentDetails} onChange={handleDetailsChange} placeholder="e.g. For lunch, rent, etc." />
              </div>
            </>
          )}
          {transferStatus && (
            <div style={{ color: transferStatus.success ? 'green' : 'red', marginTop: 8 }}>
              {transferStatus.message}
            </div>
          )}
          <button type="submit" className="pay-now-btn" disabled={loading}>
            {loading ? 'Processing...' : mode === 'payment' ? 'Pay Now' : 'Send Money'}
          </button>
        </form>
      </div>
    </div>
  );
} 