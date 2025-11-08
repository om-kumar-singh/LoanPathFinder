import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoanScoreCard = ({ financialData }) => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_URL}/api/predict`, financialData);
        setScoreData(response.data);
      } catch (err) {
        console.error('Error fetching loan score:', err);
        setError('Unable to calculate score. Please ensure Flask service is running.');
        // Fallback data for demo
        setScoreData({
          prediction: 75,
          explanation: {
            'Stable Income History': 28,
            'High Credit Utilization': -37,
            'Low Debt-to-Income Ratio': 22,
            'Good Credit Score': 35,
            'Employment Stability': 18,
            'Savings Buffer': 9
          },
          riskCategory: 'Low',
          estimatedAPR: 4.5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [financialData]);

  if (loading) {
    return (
      <div className="neumorphic-card">
        <div className="text-center text-primary-text">Calculating your Loan Readiness Score...</div>
      </div>
    );
  }

  if (error && !scoreData) {
    return (
      <div className="neumorphic-card">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!scoreData) return null;

  const { prediction, explanation, riskCategory, estimatedAPR } = scoreData;

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
    positive: '#4CAF50',
    negative: '#F44336'
  };

  const riskColors = {
    Low: '#4CAF50',
    Moderate: '#FF9800',
    High: '#F44336'
  };

  // Gauge calculation
  const gaugeData = [
    { name: 'Score', value: prediction },
    { name: 'Remaining', value: 100 - prediction }
  ];

  return (
    <div className="neumorphic-card">
      <h2 className="text-2xl font-bold text-primary-text mb-4">
        📊 Loan Readiness Score (LRS)
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold" style={{ color: riskColors[riskCategory] || '#305669' }}>
            {prediction?.toFixed(0) || 0}
          </div>
          <div className="text-primary-text opacity-70">Out of 100</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-primary-text">
            {riskCategory || 'Moderate'} Risk
          </div>
          <div className="text-primary-text opacity-70 mt-2">
            Est. APR: {estimatedAPR?.toFixed(2) || 'N/A'}%
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary-text mb-3">
          SHAP Explanation Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={shapData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#C1785A">
              {shapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.impact === 'positive' ? COLORS.positive : COLORS.negative} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary-text">Factor Impacts:</h3>
        {Object.entries(explanation || {}).map(([factor, impact]) => (
          <div key={factor} className="flex justify-between items-center p-2 bg-white bg-opacity-50 rounded">
            <span className="text-primary-text text-sm">{factor}</span>
            <span className={`font-semibold ${impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {impact > 0 ? '+' : ''}{impact.toFixed(0)} points
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanScoreCard;

