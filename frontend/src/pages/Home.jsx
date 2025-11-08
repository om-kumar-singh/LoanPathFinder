import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-deep-blue to-primary-teal text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            🏦 LoanPathfinder
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Transparent Loan Assessment Platform with Explainable AI
          </p>
          <Link
            to="/form"
            className="btn-primary inline-block text-lg px-8 py-3"
          >
            Start Simulation
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-deep-blue text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="neumorphic-card text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-deep-blue mb-2">
              Enter Your Details
            </h3>
            <p className="text-primary-text opacity-70">
              Fill out your financial information including income, expenses, and credit details.
            </p>
          </div>
          <div className="neumorphic-card text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-deep-blue mb-2">
              AI Analysis
            </h3>
            <p className="text-primary-text opacity-70">
              Our explainable AI analyzes your data and provides transparent insights.
            </p>
          </div>
          <div className="neumorphic-card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-deep-blue mb-2">
              Get Results
            </h3>
            <p className="text-primary-text opacity-70">
              View your loan readiness score, recommendations, and best loan offers.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Highlights (Placeholder) */}
      <div className="bg-light-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-deep-blue text-center mb-8">
            Your Analytics
          </h2>
          <div className="max-w-2xl mx-auto neumorphic-card text-center">
            <p className="text-primary-text opacity-70 mb-4">
              No analytics available yet. Start your first simulation to see your loan readiness score!
            </p>
            <Link
              to="/form"
              className="btn-primary inline-block"
            >
              Create Your First Simulation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

