import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Star } from 'lucide-react';
import './subscription-content.css';

const SubscriptionContent = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/artisan-payment');
  };

  return (
    <div className="subscription-content">
      <div className="subscription-header">
        <h1>Artisan Subscription</h1>
        <p>Access premium features and grow your business</p>
      </div>

      <div className="subscription-plan">
        <div className="plan-header">
          <CreditCard className="plan-icon" />
          <h2>Professional Artisan Plan</h2>
          <div className="price">
            <span className="amount">£29.99</span>
            <span className="period">/month</span>
          </div>
        </div>

        <div className="plan-features">
          <ul>
            <li>
              <Star className="feature-icon" />
              <span>Unlimited quote responses</span>
            </li>
            <li>
              <Star className="feature-icon" />
              <span>Priority listing in artisan directory</span>
            </li>
            <li>
              <Star className="feature-icon" />
              <span>Advanced analytics and reporting</span>
            </li>
            <li>
              <Star className="feature-icon" />
              <span>Custom branding options</span>
            </li>
            <li>
              <Star className="feature-icon" />
              <span>24/7 priority support</span>
            </li>
          </ul>
        </div>

        <button className="subscribe-button" onClick={handleSubscribe}>
          Subscribe Now
        </button>

        <div className="subscription-note">
          <p>Cancel anytime. No long-term commitment required.</p>
          <p>30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionContent;
