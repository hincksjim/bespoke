import React, { useEffect, useState } from 'react';
import { Route, Link, Routes, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { User, Palette, Image, FileText, ShoppingCart, CreditCard, LogOut } from 'lucide-react';
import { getUrl } from 'aws-amplify/storage';
import Profile from './Profile';
import DesignTool from './DesignTool';
import RecentDesignsGallery from './RecentDesignsGallery';
import QuotesTable from './QuotesTable';
import OrdersTable from './OrdersTable';
import PaymentPage from './PaymentPage';
import QuoteDetailsPage from './QuoteDetailsPage';
import { useUserData } from './UserContext';
// import Header from './Header'; //Removed Header import

import './CustomerPortal.css';

const stripePromise = loadStripe('your_publishable_key');

export default function CustomerPortal({ signOut }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, loading } = useUserData();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selfieUrl, setSelfieUrl] = useState('/cluedo-placeholder.png');

  const handleSignOut = () => {
    if (typeof signOut === 'function') {
      signOut();
      navigate('/');
    } else {
      console.error('signOut is not a function');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && userData) {
      const isProfileComplete = userData.firstName && 
        userData.lastName && 
        userData.Address1 && 
        userData.City && 
        userData.Postcode && 
        userData.mobile;

      if (location.pathname === '/Portal' || location.pathname === '/Portal/') {
        if (isProfileComplete) {
          navigate('/Portal/design-tool');
        } else {
          navigate('/Portal/profile');
        }
      }

      fetchSelfieImage(userData.id);
    }
  }, [userData, loading, location.pathname, navigate]);

  const fetchSelfieImage = async (userId) => {
    try {
      console.log('Fetching selfie image for user:', userId);
      const imageKey = `${userId}/Selfie.jpg`;
      const { url } = await getUrl({ key: imageKey });
      console.log('Fetched selfie URL:', url);
      setSelfieUrl(url);
    } catch (error) {
      console.error('Error fetching selfie image:', error);
      setSelfieUrl('/cluedo-placeholder.png');
    }
  };

  const SideMenu = () => (
    <aside className="side-menu">
      <nav>
        <ul className="flex flex-col space-y-2">
          <li><Link to="/Portal/profile" className="flex items-center"><User size={18} className="mr-2" /> Edit Profile</Link></li>
          <li><Link to="/Portal/design-tool" className="flex items-center"><Palette size={18} className="mr-2" /> Create Designs</Link></li>
          <li><Link to="/Portal/recent-designs-gallery" className="flex items-center"><Image size={18} className="mr-2" /> Your Designs Gallery</Link></li>
          <li><Link to="/Portal/quotes-table" className="flex items-center"><FileText size={18} className="mr-2" /> Quotes</Link></li>
          <li><Link to="/Portal/orders-table" className="flex items-center"><ShoppingCart size={18} className="mr-2" /> Orders</Link></li>
          <li><Link to="/Portal/payment" className="flex items-center"><CreditCard size={18} className="mr-2" /> Payment</Link></li>
          <li><button onClick={handleSignOut} className="flex items-center text-left w-full"><LogOut size={18} className="mr-2" /> Sign Out</button></li>
        </ul>
      </nav>
      <div className="user-profile mt-4">
        <div className="user-avatar">
          <img src={selfieUrl} alt="User Avatar" className="w-16 h-16 rounded-full" />
        </div>
        <p className="mt-2">logged in user</p>
        <span className="user-name font-semibold">{userData?.firstName} {userData?.lastName}</span>
      </div>
    </aside>
  );

  return (
    <div className="customer-portal flex flex-col h-screen">
      <div className="flex flex-grow">
        {!isMobile && <SideMenu />}
        <main className="main-content flex-grow p-4">
          <Routes>
            <Route path="/" element={null} />
            <Route path="design-tool" element={<DesignTool signOut={handleSignOut} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="recent-designs-gallery" element={<RecentDesignsGallery />} />
            <Route path="quotes-table" element={<QuotesTable />} />
            <Route path="orders-table" element={<OrdersTable />} />
            <Route path="quotes" element={<QuotesTable />} />
            <Route path="quote-details/:id" element={<QuoteDetailsPage />} />
            <Route
              path="payment"
              element={
                <Elements stripe={stripePromise}>
                  <PaymentPage />
                </Elements>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}