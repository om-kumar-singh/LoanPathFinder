import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoanOffers = ({ financialData }) => {
  const [offers, setOffers] = useState([]);
  const [preference, setPreference] = useState('lowestEMI'); // lowestEMI, fastestApproval, lowestInterest
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/loans`, {
          params: { preference }
        });
        setOffers(response.data);
      } catch (err) {
        console.error('Error fetching offers:', err);
        // Fallback data
        setOffers([
          {
            id: 1,
            bankName: 'Prime Bank',
            interestRate: 4.5,
            tenure: 60,
            eligibilityRange: '50000-200000',
            approvalTime: '2-3 days',
            emi: 1865
          },
          {
            id: 2,
            bankName: 'Quick Finance',
            interestRate: 5.2,
            tenure: 48,
            eligibilityRange: '30000-150000',
            approvalTime: '1-2 days',
            emi: 1932
          },
          {
            id: 3,
            bankName: 'Secure Lending',
            interestRate: 3.8,
            tenure: 72,
            eligibilityRange: '60000-250000',
            approvalTime: '5-7 days',
            emi: 1756
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [preference, financialData]);

  const sortedOffers = [...offers].sort((a, b) => {
    switch (preference) {
      case 'lowestEMI':
        return a.emi - b.emi;
      case 'lowestInterest':
        return a.interestRate - b.interestRate;
      case 'fastestApproval':
        return parseInt(a.approvalTime) - parseInt(b.approvalTime);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="neumorphic-card">
        <div className="text-center text-primary-text">Loading loan offers...</div>
      </div>
    );
  }

  return (
    <div className="neumorphic-card">
      <h2 className="text-2xl font-bold text-primary-text mb-4">
        🏪 Commission-Neutral Loan Marketplace
      </h2>

      <div className="mb-6">
        <label className="block text-primary-text mb-2 font-semibold">
          Sort by Preference:
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => setPreference('lowestEMI')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              preference === 'lowestEMI'
                ? 'bg-button-highlight text-white'
                : 'bg-white text-primary-text'
            }`}
          >
            💰 Lowest EMI
          </button>
          <button
            onClick={() => setPreference('fastestApproval')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              preference === 'fastestApproval'
                ? 'bg-button-highlight text-white'
                : 'bg-white text-primary-text'
            }`}
          >
            ⏱️ Fastest Approval
          </button>
          <button
            onClick={() => setPreference('lowestInterest')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              preference === 'lowestInterest'
                ? 'bg-button-highlight text-white'
                : 'bg-white text-primary-text'
            }`}
          >
            📉 Lowest Interest
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedOffers.map((offer, index) => (
          <div
            key={offer.id || index}
            className="bg-white bg-opacity-70 p-4 rounded-lg border-2 border-card-accent hover:border-button-highlight transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-primary-text">{offer.bankName}</h3>
                <p className="text-primary-text opacity-70 text-sm">
                  Eligibility: ${offer.eligibilityRange}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-button-highlight">
                  {offer.interestRate}%
                </div>
                <div className="text-primary-text text-sm">Interest Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-primary-text opacity-70 text-sm">EMI</div>
                <div className="text-lg font-semibold text-primary-text">
                  ${offer.emi?.toLocaleString() || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-primary-text opacity-70 text-sm">Tenure</div>
                <div className="text-lg font-semibold text-primary-text">
                  {offer.tenure} months
                </div>
              </div>
              <div>
                <div className="text-primary-text opacity-70 text-sm">Approval</div>
                <div className="text-lg font-semibold text-primary-text">
                  {offer.approvalTime}
                </div>
              </div>
            </div>

            <button className="btn-primary w-full mt-4">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanOffers;

