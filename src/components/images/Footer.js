import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 Elegance Jewellery. 
        <Link to="/terms">Terms and Conditions</Link> | 
        <Link to="/privacy">Privacy Policy</Link>
      </p>
    </footer>
  );
};

export default Footer;

