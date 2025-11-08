import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { auth } from '../firebaseConfig';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const WhatIfSimulator = ({ financialData, setFinancialData }) => {
  const [localFinancialData, setLocalFinancialData] = useState(financialData || {
    income: 50000,
    expenses: 20000,
    creditUtilization: 30,
    debtRatio: 25,
    savings: 10000,
    creditScore: 720,
    employmentYears: 5
  });
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [currentScore, setCurrentScore] = useState(null);

  // Use local state if setFinancialData is not provided
  const dataToUse = financialData || localFinancialData;
  const updateData = setFinancialData || setLocalFinancialData;

  useEffect(() => {
    const simulate = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/predict`, dataToUse);
        setCurrentScore(response.data.prediction);
        
        // Add to history
        setSimulationHistory(prev => [
          ...prev.slice(-9), // Keep last 10 points
          {
            income: dataToUse.income,
            score: response.data.prediction,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } catch (err) {
        console.error('Simulation error:', err);
        // Fallback
        setCurrentScore(75);
      }
    };

    if (dataToUse) {
      simulate();
    }
  }, [dataToUse]);

  const handleSliderChange = (field, value) => {
    updateData(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  const saveSimulation = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      alert('Please log in to save simulations');
      return;
    }
    
    if (!currentScore) {
      alert('No score to save. Please wait for the calculation to complete.');
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/api/simulations`, {
        userId: user.uid,
        financialData: dataToUse || {},
        score: currentScore,
        explanation: {},
        riskCategory: currentScore >= 75 ? 'Low' : currentScore >= 50 ? 'Moderate' : 'High',
        estimatedAPR: 0,
        timestamp: new Date().toISOString()
      });
      
      if (response.data && response.data.message) {
        alert('Simulation saved successfully!');
      } else {
        alert('Simulation saved successfully!');
      }
    } catch (err) {
      console.error('Error saving simulation:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to save simulation';
      alert(`Failed to save simulation: ${errorMsg}`);
    }
  };

  return (
    <div className="neumorphic-card">
      <h2 className="text-2xl font-bold text-primary-text mb-4">
        🔮 What-If Simulator
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-primary-text mb-2">
            Annual Income: ${dataToUse.income.toLocaleString()}
          </label>
          <input
            type="range"
            min="20000"
            max="200000"
            step="1000"
            value={dataToUse.income}
            onChange={(e) => handleSliderChange('income', e.target.value)}
            className="slider"
          />
        </div>

        <div>
          <label className="block text-primary-text mb-2">
            Monthly Expenses: ${dataToUse.expenses.toLocaleString()}
          </label>
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={dataToUse.expenses}
            onChange={(e) => handleSliderChange('expenses', e.target.value)}
            className="slider"
          />
        </div>

        <div>
          <label className="block text-primary-text mb-2">
            Credit Utilization: {dataToUse.creditUtilization}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={dataToUse.creditUtilization}
            onChange={(e) => handleSliderChange('creditUtilization', e.target.value)}
            className="slider"
          />
        </div>

        <div>
          <label className="block text-primary-text mb-2">
            Debt-to-Income Ratio: {dataToUse.debtRatio}%
          </label>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={dataToUse.debtRatio}
            onChange={(e) => handleSliderChange('debtRatio', e.target.value)}
            className="slider"
          />
        </div>

        <div>
          <label className="block text-primary-text mb-2">
            Savings: ${dataToUse.savings.toLocaleString()}
          </label>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={dataToUse.savings}
            onChange={(e) => handleSliderChange('savings', e.target.value)}
            className="slider"
          />
        </div>
      </div>

      {currentScore && (
        <div className="mb-4 p-4 bg-white bg-opacity-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-text">
              Current Score: {currentScore.toFixed(0)}
            </div>
          </div>
        </div>
      )}

      {simulationHistory.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary-text mb-2">
            Score Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={simulationHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#C1785A" 
                strokeWidth={2}
                name="LRS Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <button onClick={saveSimulation} className="btn-primary w-full">
        💾 Save This Simulation
      </button>
    </div>
  );
};

export default WhatIfSimulator;

