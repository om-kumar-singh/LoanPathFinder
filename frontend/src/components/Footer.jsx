import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-deep-blue text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="border-t-2" style={{ borderImage: 'linear-gradient(90deg, #05339C, #41A67E) 1' }}>
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <a href="#" className="text-gray-300 hover:text-highlight-yellow transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-highlight-yellow transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-highlight-yellow transition-colors">
                    Contact
                  </a>
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

