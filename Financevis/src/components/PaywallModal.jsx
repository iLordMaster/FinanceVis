import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaTimes } from 'react-icons/fa';
import './PaywallModal.css';

const PaywallModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <div className="paywall-overlay" onClick={onClose}>
      <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
        <button className="paywall-close" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="paywall-icon">
          <FaLock />
        </div>
        
        <h2 className="paywall-title">Premium Feature</h2>
        
        <p className="paywall-description">
          Next Month's Prediction is a premium feature available to paid subscribers only.
          Upgrade your plan to unlock AI-powered financial predictions and insights.
        </p>
        
        <div className="paywall-features">
          <div className="paywall-feature">✓ AI-Powered Predictions</div>
          <div className="paywall-feature">✓ Advanced Analytics</div>
          <div className="paywall-feature">✓ Unlimited Reports</div>
          <div className="paywall-feature">✓ Priority Support</div>
        </div>
        
        <button className="paywall-upgrade-btn" onClick={handleUpgrade}>
          View Pricing Plans
        </button>
      </div>
    </div>
  );
};

export default PaywallModal;
