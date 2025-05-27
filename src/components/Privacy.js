import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// Components for each section
const Dashboard = () => <h2>Dashboard</h2>;
const MyDesigns = () => <h2>My Designs</h2>;
const Profile = () => <h2>Profile</h2>;
const Logout = () => <h2>Logged out!</h2>;

// This component displays the privacy policy of the application.
// It outlines how user data is collected, used, and protected.
const PrivacyPolicy = () => (
  <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
    <h2>Privacy Policy</h2>
    <p>
      At Elegance Jewellery, we are committed to protecting your privacy and ensuring the security of your personal information.
      This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our website and services.
    </p>
    <h3>1. Information We Collect</h3>
    <p>We collect the following types of information:</p>
    <ul>
      <li>Personal Information: Name, email address, phone number, billing and shipping addresses</li>
      <li>Account Information: Login credentials, preferences, and design history</li>
      <li>Payment Information: Credit card details or other payment method information</li>
      <li>Usage Data: Information about how you interact with our website and services</li>
      <li>Custom Design Data: Information and images related to your custom jewellery designs</li>
    </ul>
    <h3>2. How We Use Your Information</h3>
    <p>We use the collected information for the following purposes:</p>
    <ul>
      <li>To provide and maintain our services</li>
      <li>To process and fulfill your custom jewellery orders</li>
      <li>To communicate with you about your account, orders, and our services</li>
      <li>To improve our website, products, and customer experience</li>
      <li>To send promotional emails and updates (with your consent)</li>
      <li>To detect, prevent, and address technical issues or fraudulent activities</li>
    </ul>
    <h3>3. Data Security</h3>
    <p>
      We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure,
      alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we
      cannot guarantee absolute security.
    </p>
    <h3>4. Data Sharing and Disclosure</h3>
    <p>We may share your information with:</p>
    <ul>
      <li>Service providers who assist us in operating our website and providing our services</li>
      <li>Payment processors for secure transaction handling</li>
      <li>Legal authorities when required by law or to protect our rights</li>
    </ul>
    <p>We do not sell your personal information to third parties.</p>
    <h3>5. Cookies and Tracking Technologies</h3>
    <p>
      We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize
      content. You can control cookie settings through your browser preferences.
    </p>
    <h3>6. Your Rights and Choices</h3>
    <p>You have the right to:</p>
    <ul>
      <li>Access, update, or delete your personal information</li>
      <li>Opt-out of marketing communications</li>
      <li>Object to the processing of your personal data</li>
      <li>Request a copy of your data in a portable format</li>
    </ul>
    <p>
      To exercise these rights, please contact us using the information provided at the end of this policy.
    </p>
    <h3>7. Children's Privacy</h3>
    <p>
      Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children
      under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us
      immediately.
    </p>
    <h3>8. Changes to This Privacy Policy</h3>
    <p>
      We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this
      page and updating the "Last Updated" date.
    </p>
    <h3>9. Contact Us</h3>
    <p>
      If you have any questions about this Privacy Policy, please contact us at:
      <br />
      Elegance Jewellery<br />
      123 Sparkling Lane<br />
      Gemstone City, GC 12345<br />
      Email: privacy@elegancejewellery.com<br />
      Phone: (555) 123-4567
    </p>
  </div>
);

export default PrivacyPolicy;
