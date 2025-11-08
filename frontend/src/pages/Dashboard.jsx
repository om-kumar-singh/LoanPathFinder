import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import WhatIfSimulator from '../components/WhatIfSimulator';
import LoanOffers from '../components/LoanOffers';

const Dashboard = () => {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  // Get analytics data from route state (after form submission)
  const analyticsData = location.state?.analyticsData;
  const financialData = location.state?.financialData || {
    income: 50000,
    expenses: 20000,
    creditUtilization: 30,
    debtRatio: 25,
    savings: 10000,
    creditScore: 720,
    employmentYears: 5
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-deep-blue mb-2">
          Welcome back, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-primary-text opacity-70 text-sm md:text-base">
          {analyticsData ? 'View your loan analytics below' : 'Get transparent insights into your loan eligibility'}
        </p>
      </div>

      {analyticsData ? (
        <div className="space-y-6">
          <AnalyticsDashboard 
            analyticsData={analyticsData}
            financialData={financialData}
            userId={user?.uid}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <WhatIfSimulator 
              financialData={financialData}
            />
            <LoanOffers financialData={financialData} />
          </div>
        </div>
      ) : (
        <div className="neumorphic-card text-center py-12">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">
            No Analytics Available
          </h2>
          <p className="text-primary-text opacity-70 mb-6">
            Start by filling out the financial information form to generate your loan readiness score.
          </p>
          <Link to="/form" className="btn-primary inline-block">
            Start Simulation
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

