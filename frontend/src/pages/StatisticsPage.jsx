import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    loanType: 'all',
    timeRange: 'all'
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/statistics`, {
          params: filters
        });
        setStatistics(response.data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        // Fallback mock data
        setStatistics({
          averageScore: 72,
          totalSimulations: 150,
          riskDistribution: [
            { name: 'Low', value: 45 },
            { name: 'Moderate', value: 75 },
            { name: 'High', value: 30 }
          ],
          trendData: [
            { month: 'Jan', score: 68 },
            { month: 'Feb', score: 70 },
            { month: 'Mar', score: 72 },
            { month: 'Apr', score: 71 },
            { month: 'May', score: 73 },
            { month: 'Jun', score: 75 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [filters]);

  const COLORS = ['#41A67E', '#E5C95F', '#E53E3E'];

  const handleExport = (format) => {
    // Export functionality - would need backend endpoint
    alert(`Export to ${format.toUpperCase()} functionality coming soon!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-primary-text">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-blue mb-2">
          📊 Global Statistics
        </h1>
        <p className="text-primary-text opacity-70">
          Loan trends and comparisons across all users
        </p>
      </div>

      {/* Filters */}
      <div className="neumorphic-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-deep-blue font-semibold mb-2">Loan Type</label>
            <select
              value={filters.loanType}
              onChange={(e) => setFilters({ ...filters, loanType: e.target.value })}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="personal">Personal</option>
              <option value="home">Home</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-deep-blue font-semibold mb-2">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="btn-primary flex-1"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="btn-primary flex-1"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="neumorphic-card text-center">
          <div className="text-4xl font-bold text-primary-teal mb-2">
            {statistics?.averageScore?.toFixed(1) || 'N/A'}
          </div>
          <div className="text-primary-text opacity-70">Average LRS Score</div>
        </div>
        <div className="neumorphic-card text-center">
          <div className="text-4xl font-bold text-royal-blue mb-2">
            {statistics?.totalSimulations || 'N/A'}
          </div>
          <div className="text-primary-text opacity-70">Total Simulations</div>
        </div>
        <div className="neumorphic-card text-center">
          <div className="text-4xl font-bold text-highlight-yellow mb-2">
            {statistics?.successRate?.toFixed(1) || 'N/A'}%
          </div>
          <div className="text-primary-text opacity-70">Success Rate</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="neumorphic-card">
          <h3 className="text-xl font-bold text-deep-blue mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statistics?.riskDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(statistics?.riskDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="neumorphic-card">
          <h3 className="text-xl font-bold text-deep-blue mb-4">Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statistics?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#41A67E" 
                strokeWidth={2}
                name="Average Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

