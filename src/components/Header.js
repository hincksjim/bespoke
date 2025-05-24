import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Info, User, Gem, ChevronDown, LogIn, LogOut } from 'lucide-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useCountry } from './CountryContext';
import './Header.css';

export default function Header({ authenticated, onSignOut, userPoolType: propUserPoolType }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [userPoolType, setUserPoolType] = useState(propUserPoolType || 'primary'); // Use prop if provided
  const { selectedCountry, setSelectedCountry } = useCountry();
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  // Determine which user pool the user is logged in with
  useEffect(() => {
    if (user) {
      // Check for attributes or properties that would help identify the user pool
      const userAttributes = user.attributes || {};
      
      // This is a placeholder - you need to replace with your actual logic
      // to determine which pool the user belongs to
      if (userAttributes['custom:userPoolType'] === 'secondary' || 
          userAttributes['custom:isArtisan'] === 'true') {
        setUserPoolType('secondary');
      } else {
        setUserPoolType('primary');
      }
      
      // Alternative approach: Check for specific groups the user belongs to
      const groups = user.signInUserSession?.accessToken?.payload['cognito:groups'] || [];
      if (groups.includes('artisans') || groups.includes('secondary-pool-users')) {
        setUserPoolType('secondary');
      }
    }
  }, [user]);

  const countries = [
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
    { code: 'CA', name: 'Canada', currency: 'CAD' },
    { code: 'AU', name: 'Australia', currency: 'AUD' },
    { code: 'DE', name: 'Germany', currency: 'EUR' },
    { code: 'FR', name: 'France', currency: 'EUR' },
    { code: 'JP', name: 'Japan', currency: 'JPY' },
    { code: 'CN', name: 'China', currency: 'CNY' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'BR', name: 'Brazil', currency: 'BRL' },
    { code: 'MX', name: 'Mexico', currency: 'MXN' },
    { code: 'IT', name: 'Italy', currency: 'EUR' },
    { code: 'ES', name: 'Spain', currency: 'EUR' },
    { code: 'NL', name: 'Netherlands', currency: 'EUR' },
    { code: 'CH', name: 'Switzerland', currency: 'CHF' },
    { code: 'SE', name: 'Sweden', currency: 'SEK' },
    { code: 'SG', name: 'Singapore', currency: 'SGD' },
    { code: 'KR', name: 'South Korea', currency: 'KRW' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCountryMenu = () => {
    setIsCountryMenuOpen(!isCountryMenuOpen);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      console.log("Sign out initiated from Header");
      if (onSignOut) {
        await onSignOut();
        console.log("Sign out completed using onSignOut prop");
      } else {
        console.error("No sign out function provided");
      }
      // Always navigate home after sign out attempt
      navigate('/');
    } catch (error) {
      console.error("Error during sign out:", error);
      // Still navigate home even if there's an error
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="navbar">
        <div className="logo">Elegance Jewellery</div>
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/" onClick={toggleMenu}><Home /> Home</Link></li>
            <li><Link to="/about" onClick={toggleMenu}><Info /> About</Link></li>
            
            {/* Conditional navigation items based on authentication status and user pool */}
            {authenticated && (
              <>
                {userPoolType === 'primary' ? (
                  <li><Link to="/portal" onClick={toggleMenu}><User /> Customer Portal</Link></li>
                ) : (
                  <li><Link to="/artisan" onClick={toggleMenu}><Gem /> Jewellers Page</Link></li>
                )}
              </>
            )}
            
            {/* Always show the Jewellers Page */}
            <li><Link to="/artisan" onClick={toggleMenu}><Gem /> Jewellers Page</Link></li>
          </ul>
        </nav>
        <div className="header-actions">
          <div className="relative">
            <button 
              className="country-button"
              onClick={toggleCountryMenu}
              aria-haspopup="true"
              aria-expanded={isCountryMenuOpen}
            >
              <img
                src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`}
                width="20"
                height="15"
                alt={`Flag of ${selectedCountry.name}`}
                className="flag-icon"
              />
              <span>{selectedCountry.name}</span>
              <ChevronDown />
            </button>
            {isCountryMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg country-dropdown">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      className="country-item"
                      onClick={() => handleCountrySelect(country)}
                      role="menuitem"
                    >
                      <img
                        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                        width="20"
                        height="15"
                        alt={`Flag of ${country.name}`}
                        className="flag-icon"
                      />
                      <span>{country.name}</span>
                      <span className="country-currency">{country.currency}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="currency-display">
            {selectedCountry.currency}
          </div>
          {authenticated ? (
            <button onClick={handleSignOut} className="sign-out-button">
              <LogOut /> <span>Customer SignOut</span>
            </button>
          ) : (
            <Link to="/login" className="sign-out-button">
              <LogIn /> <span>Customer SignIn</span>
            </Link>
          )}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}