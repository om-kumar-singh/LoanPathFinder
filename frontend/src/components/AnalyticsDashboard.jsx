import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AnalyticsDashboard = ({ analyticsData, financialData, userId }) => {
  const navigate = useNavigate();

  if (!analyticsData) {
    return (
      <div className="neumorphic-card text-center">
        <p className="text-primary-text opacity-70">
          No analytics data available. Please submit the form first.
        </p>
      </div>
    );
  }

  const { prediction, explanation, riskCategory, estimatedAPR } = analyticsData;

  // Prepare data for charts
  const shapData = Object.entries(explanation || {})
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      value: Math.abs(value),
      impact: value > 0 ? 'positive' : 'negative'
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const COLORS = {
    positive: '#41A67E',
    negative: '#E53E3E'
  };

  const riskColors = {
    Low: '#41A67E',
    Moderate: '#E5C95F',
    High: '#E53E3E'
  };

  const handleSaveSimulation = async () => {
    try {
      await axios.post(`${API_URL}/api/simulations`, {
        userId: userId || 'current-user',
        financialData,
        score: prediction,
        explanation,
        riskCategory,
        estimatedAPR,
        timestamp: new Date().toISOString()
      });
      alert('Simulation saved successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Error saving simulation:', err);
      alert('Failed to save simulation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Loan Score Card */}
      <div className="neumorphic-card">
        <h2 className="text-2xl font-bold text-deep-blue mb-4">
          📊 Loan Readiness Score (LRS)
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold" style={{ color: riskColors[riskCategory] || '#05339C' }}>
              {prediction?.toFixed(0) || 0}
            </div>
            <div className="text-primary-text opacity-70">Out of 100</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-deep-blue">
              {riskCategory || 'Moderate'} Risk
            </div>
            <div className="text-primary-text opacity-70 mt-2">
              Est. APR: {estimatedAPR?.toFixed(2) || 'N/A'}%
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-deep-blue mb-3">
            SHAP Explanation Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={shapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#41A67E">
                {shapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impact === 'positive' ? COLORS.positive : COLORS.negative} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-deep-blue">Factor Impacts:</h3>
          {Object.entries(explanation || {}).map(([factor, impact]) => (
            <div key={factor} className="flex justify-between items-center p-2 bg-light-gray rounded">
              <span className="text-primary-text text-sm">{factor}</span>
              <span className={`font-semibold ${impact > 0 ? 'text-primary-teal' : 'text-red-500'}`}>
                {impact > 0 ? '+' : ''}{impact.toFixed(0)} points
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Section */}
      <div className="neumorphic-card">
        <h2 className="text-2xl font-bold text-deep-blue mb-4">
          💡 Recommendations
        </h2>
        <div className="space-y-3">
          {riskCategory === 'Low' && (
            <div className="p-4 bg-green-50 border-l-4 border-primary-teal rounded">
              <p className="text-primary-text">
                <strong>Excellent!</strong> You have a strong financial profile. Consider exploring premium loan options with lower interest rates.
              </p>
            </div>
          )}
          {riskCategory === 'Moderate' && (
            <div className="p-4 bg-yellow-50 border-l-4 border-highlight-yellow rounded">
              <p className="text-primary-text">
                <strong>Good standing.</strong> You're eligible for most loan products. Consider improving your credit utilization to access better rates.
              </p>
            </div>
          )}
          {riskCategory === 'High' && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-primary-text">
                <strong>Needs improvement.</strong> Focus on reducing debt-to-income ratio and building savings to improve your loan eligibility.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Simulation Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSaveSimulation}
          className="btn-primary px-8 py-3"
        >
          💾 Save This Simulation
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

