import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const currentPath = window.location.pathname;

  return (
    <nav className="bg-deep-blue text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            🏦 LoanPathfinder
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${
                currentPath === '/' ? 'text-highlight-yellow font-semibold' : 'hover:text-highlight-yellow'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`transition-colors ${
                currentPath === '/dashboard' ? 'text-highlight-yellow font-semibold' : 'hover:text-highlight-yellow'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/statistics" 
              className={`transition-colors ${
                currentPath === '/statistics' ? 'text-highlight-yellow font-semibold' : 'hover:text-highlight-yellow'
              }`}
            >
              Statistics
            </Link>
            <Link 
              to="/profile" 
              className={`transition-colors ${
                currentPath === '/profile' ? 'text-highlight-yellow font-semibold' : 'hover:text-highlight-yellow'
              }`}
            >
              Profile
            </Link>
            <div className="flex items-center space-x-3">
              <span className="text-sm">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-primary-teal hover:bg-royal-blue px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

