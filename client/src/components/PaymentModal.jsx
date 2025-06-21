import React, { useState, useEffect } from 'react';
import '../styles/PaymentModal.css';
import { X } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, payment, userData }) {
  const [amountToPay, setAmountToPay] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [balanceAfter, setBalanceAfter] = useState(userData?.balance || 0);

  useEffect(() => {
    if (payment) {
      setAmountToPay(payment.amount);
      setPaymentDetails(`Payment for ${payment.name}`);
    }
  }, [payment]);

  useEffect(() => {
    const initialBalance = userData?.balance || 0;
    const amount = parseFloat(amountToPay) || 0;
    setBalanceAfter(initialBalance - amount);
  }, [amountToPay, userData]);

  if (!isOpen || !payment) {
    return null;
  }

  const handleAmountChange = (e) => {
    setAmountToPay(e.target.value);
  };
  
  const handleDetailsChange = (e) => {
    setPaymentDetails(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment Submitted', {
      ...payment,
      amountPaid: amountToPay,
      details: paymentDetails,
    });
    onClose(); // Close modal after submission
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
          <h2>Payment Information</h2>
          <p>{payment.name}</p>
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
              <label htmlFor="amount-to-pay">Amount to Pay</label>
              <input type="number" id="amount-to-pay" value={amountToPay} onChange={handleAmountChange} placeholder="0.00" />
            </div>
             <div className="form-group">
              <label htmlFor="balance-after">Balance after payment</label>
              <input type="text" id="balance-after" value={formatCurrency(balanceAfter)} disabled />
            </div>
          </div>

          <div className="form-section">
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
          </div>
          
          <button type="submit" className="pay-now-btn">Pay Now</button>
        </form>
      </div>
    </div>
  );
} 