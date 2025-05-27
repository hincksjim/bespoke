import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// This component renders the landing page for the application.
// It introduces the platform, highlights its features, and provides a call-to-action for users to start designing.

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/Portal');
  };

  return (
    <div className="landing-page">
      <header className="header-container">
        <div className="header-content">
          <h1>Welcome to Elegance Jewellery</h1>
        </div>
      </header>
      <section className="intro">
        <h1>Unleash Your Creativity with Elegance Jewellery</h1>
        <p>
          At Elegance Jewellery, we believe that everyone deserves to wear jewellery that truly reflects their unique style and personality. That’s why we’ve revolutionised the way you create and own stunning, bespoke jewellery. With our innovative AI assistance, designing your dream piece has never been easier or more exciting.
        </p>
        <button className="register-button" onClick={handleRegisterClick}>
          Lets Start
        </button>      
        <h3>How It Works</h3>
        <div className="how-it-works">
          <div className="step step1">
            <div className="step-content">
              <strong>Create Your Unique Design</strong>
              <strong>Our intuitive AI-powered design tool lets you craft jewellery that is as unique as you are. Whether you’re envisioning an elegant necklace, a stunning bracelet, or a pair of dazzling earrings, our platform guides you through the design process, making it accessible and fun for everyone.</strong>
            </div>
          </div>
          <div className="step step2">
            <div className="step-content">
              <strong>Save and Perfect Your Designs</strong>
              <strong>Once you've created your masterpiece, save it to your personal dashboard. Here, you can refine your designs, experiment with different elements, and watch your vision come to life. Your dashboard keeps all your creations in one place, ready for when you want to take the nextstep.</strong>
            </div>
          </div>
          <div className="step step3">
            <div className="step-content">
              <strong>Submit for a Quote</strong>
              <strong>When you’re ready, submit your design for a quote. Our team of experts will evaluate your creation and secure the best price from our network of skilled artisan craftsmen. We ensure that every piece is made with the highest quality materials and craftsmanship.</strong>
            </div>
          </div>
          <div className="step step4">
            <div className="step-content">
              <strong>Accept or Reject the Quote</strong>
              <strong>We’ll send you a detailed quote for your design. You can choose to accept it and watch your unique piece come to life, or reject it with no obligations. The choice is entirely yours.</strong>
            </div>
          </div>
        </div>
        <h3>Why Choose Elegance Jewellery?</h3>
        <ul>
          <li>Bespoke Designs: Each piece is uniquely crafted to match your personal style.</li>
          <li>AI Assistance: Our advanced technology makes designing jewellery simple and enjoyable.</li>
          <li>Artisan Craftsmanship: We collaborate with talented craftsmen to ensure every piece is made to perfection.</li>
          <li>No Obligation: Submit your design for a quote without any commitment. Decide on your terms.</li>
        </ul>
        <h3>Start Your Creative Journey Today</h3>
        <p>Don’t settle for off-the-shelf jewellery. Discover the joy of creating something that is truly yours. Sign up today and start designing with Elegance Jewellery. Your perfect piece is just a few clicks away.</p>
        <button className="register-button" onClick={handleRegisterClick}>
          Lets Start
        </button>
        <p>Join the Revolution. Design. Create. Shine.</p>
      </section>
    </div>
  );
};

export default LandingPage;
