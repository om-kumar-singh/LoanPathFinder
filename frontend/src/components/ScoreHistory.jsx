import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ScoreHistory = ({ userId }) => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all'); // all, week, month, year

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/simulations`, {
          params: { userId }
        });
        
        // Handle new API response format with pagination
        let filtered = response.data.simulations || response.data;
        
        // Apply date filter
        const now = new Date();
        if (dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(sim => new Date(sim.timestamp) >= weekAgo);
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(sim => new Date(sim.timestamp) >= monthAgo);
        } else if (dateFilter === 'year') {
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(sim => new Date(sim.timestamp) >= yearAgo);
        }
        
        setSimulations(filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      } catch (err) {
        console.error('Error fetching simulations:', err);
        setSimulations([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSimulations();
    }
  }, [userId, dateFilter]);

  const chartData = simulations.map((sim, index) => ({
    name: new Date(sim.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: sim.score,
    date: sim.timestamp
  }));

  if (loading) {
    return (
      <div className="neumorphic-card text-center py-8">
        <p className="text-primary-text">Loading score history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-deep-blue">Score History</h3>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All Time</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {chartData.length > 0 ? (
        <div className="neumorphic-card">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#41A67E" 
                strokeWidth={2}
                name="LRS Score"
                dot={{ fill: '#41A67E', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="neumorphic-card text-center py-8">
          <p className="text-primary-text opacity-70">
            No score history available. Complete a simulation to see your trends.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScoreHistory;

