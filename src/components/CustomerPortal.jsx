import React, { useEffect, useState } from 'react';
import { Route, Link, Routes, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { User, Palette, Image, FileText, ShoppingCart, CreditCard, LogOut } from 'lucide-react';
import { getUrl } from 'aws-amplify/storage';
import Profile from './Profile';
import DesignTool from './DesignTool';
import RecentDesignsGallery from './RecentDesignsGallery';
import PublicDesignsGallery from './PublicDesignsGallery';
import QuotesTable from './QuotesTable';
import OrdersTable from './OrdersTable';
import PaymentPage from './PaymentPage';
import QuoteDetailsPage from './QuoteDetailsPage';
import OrdersDetailPage from './OrdersDetailPage';
import { useUserData } from './UserContext';

import './CustomerPortal.css';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51NimIrCGTRmYtOxofBHJVgHgTN9skZFONdlpzYClH15iqN4fVbbanVwCrVbi2nNmpIw0U3Uctwg3JBE4CwC8NUkK00Gqr6XGUF');
console.log('Stripe initialized with key:', stripePromise);

// CustomerPortal component now accepts 'user' and 'signOut' props
export default function CustomerPortal({ signOut, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  // useUserData is still used here for other data/loading states,
  // but DesignTool will primarily rely on the 'user' prop for initial fetch trigger
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

  // This effect checks profile completion and redirects if necessary
  // It should use the 'user' prop for the check
  useEffect(() => {
    // Wait until user data is available from context or prop
    if (!loading && (userData || user)) {
      const currentUserData = userData || user; // Use userData from context or the prop

      const isProfileComplete = currentUserData?.firstName &&
        currentUserData?.lastName &&
        currentUserData?.Address1 &&
        currentUserData?.City &&
        currentUserData?.Postcode &&
        currentUserData?.mobile;

      // Only redirect if on the base /Portal path or design-tool and profile is incomplete
      if (location.pathname === '/Portal' || location.pathname === '/Portal/') {
          console.log('Checking profile completion on base Portal path.');
           if (!isProfileComplete) {
             console.log('Profile incomplete, redirecting to profile.');
             navigate('/Portal/profile');
           } else {
             console.log('Profile complete, staying on base Portal path or redirecting to default.');
             // Optionally redirect to a default page like dashboard or design-tool
             navigate('/Portal/design-tool');
           }
      } else if (location.pathname === '/Portal/design-tool') {
          console.log('Checking profile completion on design-tool path.');
           if (!isProfileComplete) {
             console.log('Profile incomplete, redirecting to profile from design-tool.');
             navigate('/Portal/design-tool');
           }
      }


      // Fetch selfie image using the user ID from either source
      if (currentUserData?.id) {
         fetchSelfieImage(currentUserData.id);
      } else if (currentUserData?.username) { // Fallback if ID isn't immediately available but username is
         // You might need a way to get the ID from username if not in userData
         // For now, rely on userData eventually populating ID
         console.warn("User ID not available for selfie fetch, but username is. Will retry when userData populates.");
      }

    }
  }, [userData, loading, user, location.pathname, navigate]); // Added 'user' to dependencies

  const fetchSelfieImage = async (userId) => {
    if (!userId) {
      console.log('No user ID available to fetch selfie image.');
      setSelfieUrl('/cluedo-placeholder.png'); // Ensure placeholder is set if no ID
      return;
    }
    try {
      console.log('Fetching selfie image for user:', userId);
      const imageKey = `${userId}/Selfie.jpg`;
      // Note: getUrl might require authentication headers depending on your S3 setup
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
          <li><Link to="/Portal/Public-designs-gallery" className="flex items-center"><Image size={18} className="mr-2" /> Public Designs Gallery</Link></li>
          <li><Link to="/Portal/quotes-table" className="flex items-center"><FileText size={18} className="mr-2" /> Quotes</Link></li>
          <li><Link to="/Portal/orders-table" className="flex items-center"><ShoppingCart size={18} className="mr-2" /> Orders</Link></li>
          <li><Link to="/Portal/payment" className="flex items-center"><CreditCard size={18} className="mr-2" /> Payment</Link></li>
          <li><button onClick={handleSignOut} className="flex items-center text-left w-full"><LogOut size={18} className="mr-2" /> Sign Out</button></li>
        </ul>
      </nav>
      <div className="user-profile mt-4">
        <div className="user-avatar">
          {/* Use userData or user prop for display if available */}
          <img src={selfieUrl} alt="User Avatar" className="w-16 h-16 rounded-full" />
        </div>
        <p className="mt-2">logged in user</p>
        {/* Display user name from userData or user prop */}
        <span className="user-name font-semibold">{userData?.firstName || user?.attributes?.given_name} {userData?.lastName || user?.attributes?.family_name}</span>
      </div>
    </aside>
  );

  // Add loading state handling for CustomerPortal itself if needed
  if (loading && !userData && !user) {
      return <div className="loading">Loading customer portal...</div>;
  }


  return (
    <div className="customer-portal flex flex-col h-screen">
      <div className="flex flex-grow">
        {!isMobile && <SideMenu />}
        <main className="main-content flex-grow p-4">
          <Routes>
            {/* Pass the 'user' prop to DesignTool */}
            <Route path="/" element={null} /> {/* Consider a default landing for /Portal */}
            <Route path="design-tool" element={<DesignTool signOut={handleSignOut} user={user} />} /> {/* Pass user here */}
            {/* Pass the 'user' prop to Profile as well for consistency */}
            <Route path="profile" element={<Profile signOut={handleSignOut} user={user} />} /> {/* Pass user here */}
            <Route path="recent-designs-gallery" element={<RecentDesignsGallery />} />
            <Route path="Public-designs-gallery" element={<PublicDesignsGallery />} />
            <Route path="quotes-table" element={<QuotesTable />} />
            <Route path="orders-table" element={<OrdersTable />} />
            <Route path="quotes" element={<QuotesTable />} />
            <Route path="quote-details/:id" element={<QuoteDetailsPage />} />
            <Route path="order-details/:id" element={<OrdersDetailPage />} />
            <Route
              path="payment"
              element={
                <Elements stripe={stripePromise}>
                  {/* Pass user and signOut to PaymentPage if needed */}
                  <PaymentPage signOut={handleSignOut} user={user} />
                </Elements>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
