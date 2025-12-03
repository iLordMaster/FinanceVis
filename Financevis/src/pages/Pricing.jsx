import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './Pricing.css';
import './dashboard.css';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { name: 'Basic Dashboard', included: true },
        { name: 'Manual Transaction Entry', included: true },
        { name: 'Up to 3 Accounts', included: true },
        { name: 'Basic Reports', included: true },
        { name: 'AI Predictions', included: false },
        { name: 'Advanced Analytics', included: false },
        { name: 'Unlimited Accounts', included: false },
        { name: 'Priority Support', included: false },
      ],
      buttonText: 'Current Plan',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'For serious financial tracking',
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'AI-Powered Predictions', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Unlimited Accounts', included: true },
        { name: 'Custom Categories', included: true },
        { name: 'Export to CSV/PDF', included: true },
        { name: 'Email Support', included: true },
        { name: 'Priority Support', included: false },
      ],
      buttonText: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: 'per month',
      description: 'Maximum features and support',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Custom Integrations', included: true },
        { name: 'API Access', included: true },
        { name: 'White Label Options', included: true },
        { name: 'Dedicated Account Manager', included: true },
        { name: 'Advanced Security', included: true },
        { name: 'Custom Reports', included: true },
      ],
      buttonText: 'Upgrade to Premium',
      highlighted: false,
    },
  ];

  return (
    <div className="pricing-content">
      <div className="pricing-header">
        <h1 className="pricing-title">Choose Your Plan</h1>
        <p className="pricing-subtitle">
          Unlock powerful features to take control of your finances
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
          >
            {plan.highlighted && <div className="popular-badge">Most Popular</div>}
            
            <div className="plan-header">
              <h2 className="plan-name">{plan.name}</h2>
              <div className="plan-price">
                {plan.price}
                <span className="plan-period">/{plan.period}</span>
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>

            <ul className="features-list">
              {plan.features.map((feature, idx) => (
                <li key={idx} className={`feature-item ${!feature.included ? 'disabled' : ''}`}>
                  {feature.included ? (
                    <FaCheck className="feature-icon check" />
                  ) : (
                    <FaTimes className="feature-icon cross" />
                  )}
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>

            <button
              className={`plan-button ${plan.highlighted ? 'primary' : 'secondary'}`}
              onClick={() => {
                if (plan.name !== 'Free') {
                  alert(`Upgrading to ${plan.name} plan - Payment integration coming soon!`);
                }
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="pricing-footer">
        <p>All plans include a 14-day money-back guarantee</p>
        <p>Need a custom plan? <a href="mailto:support@financevis.com">Contact us</a></p>
      </div>
    </div>
  );
};

export default Pricing;