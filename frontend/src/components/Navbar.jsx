import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link to={user ? "/" : "/login"} className="text-xl md:text-2xl font-bold">
            🏦 LoanPathfinder
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
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
                  <span className="text-sm hidden lg:inline">{user?.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-primary-teal hover:bg-royal-blue px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-teal hover:bg-royal-blue px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3 pt-4">
              {user ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors py-2 ${
                      currentPath === '/' ? 'text-highlight-yellow font-semibold' : 'hover:text-highlight-yellow'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors py-2 ${
                      currentPath === '/dashboard' ? 'text-highlight-yellow font-semibold' : 'hover:text-highlight-yellow'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/statistics"
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors py-2 ${
                      currentPath === '/statistics' ? 'text-highlight-yellow font-semibold' : 'hover:text-highlight-yellow'
                    }`}
                  >
                    Statistics
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors py-2 ${
                      currentPath === '/profile' ? 'text-highlight-yellow font-semibold' : 'hover:text-highlight-yellow'
                    }`}
                  >
                    Profile
                  </Link>
                  <div className="pt-2 border-t border-gray-700">
                    <div className="text-sm text-gray-300 mb-2">{user?.email}</div>
                    <button
                      onClick={handleSignOut}
                      className="bg-primary-teal hover:bg-royal-blue px-4 py-2 rounded-lg transition-colors w-full text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-primary-teal hover:bg-royal-blue px-4 py-2 rounded-lg transition-colors text-center text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

