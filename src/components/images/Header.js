import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Info, User, Gem, LogOut } from 'lucide-react';
import './Header.css';

export default function Header({ signOut }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    if (typeof signOut === 'function') {
      signOut();
    } else {
      console.error('signOut is not a function');
    }
  };

  return (
    <header className="header w-full bg-white shadow-md">
      <div className="navbar container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="logo text-xl font-bold">Elegance Jewellery</div>
        <nav className={`nav-menu ${isMenuOpen ? 'active' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row md:space-x-4">
            <li><Link to="/" onClick={toggleMenu} className="flex items-center"><Home size={18} className="mr-2" /> Home</Link></li>
            <li><Link to="/about" onClick={toggleMenu} className="flex items-center"><Info size={18} className="mr-2" /> About</Link></li>
            <li><Link to="/Portal" onClick={toggleMenu} className="flex items-center"><User size={18} className="mr-2" /> Customer Portal</Link></li>
            <li><Link to="/DesignTool" onClick={toggleMenu} className="flex items-center"><Gem size={18} className="mr-2" /> Jewellers Page</Link></li>
          </ul>
        </nav>
        <div className="header-actions flex items-center">
          <button className="sign-out-button mr-4" onClick={handleSignOut}>
            <LogOut size={24} /> <span className="sign-out-text hidden md:inline">Sign Out</span>
          </button>
          <button className="menu-toggle md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}