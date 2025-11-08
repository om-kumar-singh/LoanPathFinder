import React, { useState } from 'react';
import LoanScoreCard from './LoanScoreCard';
import WhatIfSimulator from './WhatIfSimulator';
import LoanOffers from './LoanOffers';

const Dashboard = ({ user }) => {
  const [financialData, setFinancialData] = useState({
    income: 50000,
    expenses: 20000,
    creditUtilization: 30,
    debtRatio: 25,
    savings: 10000,
    creditScore: 720,
    employmentYears: 5
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-text mb-2">
          Welcome back, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-primary-text opacity-80">
          Get transparent insights into your loan eligibility
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LoanScoreCard financialData={financialData} />
        <WhatIfSimulator 
          financialData={financialData} 
          setFinancialData={setFinancialData}
        />
      </div>

      <div className="mt-6">
        <LoanOffers financialData={financialData} />
      </div>
    </div>
  );
};

export default Dashboard;

