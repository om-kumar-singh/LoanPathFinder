import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-deep-blue text-white mt-auto">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="border-t-2" style={{ borderImage: 'linear-gradient(90deg, #05339C, #41A67E) 1' }}>
          <div className="pt-4 md:pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LoanPathfinder</h3>
              <p className="text-gray-300 text-sm">
                Transparent loan assessment platform powered by explainable AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-highlight-yellow transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/form" className="text-gray-300 hover:text-highlight-yellow transition-colors">
                    Start Simulation
                  </Link>
                </li>
                <li>
                  <Link to="/statistics" className="text-gray-300 hover:text-highlight-yellow transition-colors">
                    Statistics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => navigate('/about')}
                    className="text-gray-300 hover:text-highlight-yellow transition-colors text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/privacy')}
                    className="text-gray-300 hover:text-highlight-yellow transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-gray-300 hover:text-highlight-yellow transition-colors text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} LoanPathfinder. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

