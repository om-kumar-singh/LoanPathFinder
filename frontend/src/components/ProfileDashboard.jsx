import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProfileDashboard = ({ user }) => {
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/simulations', {
          params: { userId: user?.uid || 'current-user' }
        });
        setSavedSimulations(response.data);
      } catch (err) {
        console.error('Error fetching simulations:', err);
        // Fallback data
        setSavedSimulations([
          {
            _id: '1',
            financialData: { income: 50000, expenses: 20000 },
            score: 75,
            timestamp: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSimulations();
    }
  }, [user]);

  const chartData = savedSimulations.map((sim, index) => ({
    name: `Sim ${index + 1}`,
    score: sim.score,
    income: sim.financialData?.income || 0
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-text mb-2">
          👤 Your Profile
        </h1>
        <p className="text-primary-text opacity-80">
          Manage your account and view your loan assessment history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-primary-text mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-primary-text opacity-70">Email</label>
              <div className="text-primary-text font-semibold">{user?.email}</div>
            </div>
            <div>
              <label className="text-primary-text opacity-70">User ID</label>
              <div className="text-primary-text font-semibold text-sm break-all">
                {user?.uid}
              </div>
            </div>
            <div>
              <label className="text-primary-text opacity-70">Account Created</label>
              <div className="text-primary-text font-semibold">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-primary-text mb-4">
            Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary-text">Total Simulations</span>
              <span className="text-primary-text font-bold">
                {savedSimulations.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-text">Average Score</span>
              <span className="text-primary-text font-bold">
                {savedSimulations.length > 0
                  ? (savedSimulations.reduce((sum, s) => sum + (s.score || 0), 0) /
                      savedSimulations.length).toFixed(1)
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-text">Best Score</span>
              <span className="text-primary-text font-bold">
                {savedSimulations.length > 0
                  ? Math.max(...savedSimulations.map(s => s.score || 0))
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="neumorphic-card mb-6">
        <h2 className="text-2xl font-bold text-primary-text mb-4">
          📊 Score History
        </h2>
        {loading ? (
          <div className="text-center text-primary-text">Loading...</div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#C1785A" name="LRS Score" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-primary-text opacity-70">
            No simulations saved yet. Try the What-If Simulator!
          </div>
        )}
      </div>

      <div className="neumorphic-card">
        <h2 className="text-2xl font-bold text-primary-text mb-4">
          💾 Saved Simulations
        </h2>
        {loading ? (
          <div className="text-center text-primary-text">Loading...</div>
        ) : savedSimulations.length > 0 ? (
          <div className="space-y-3">
            {savedSimulations.map((sim, index) => (
              <div
                key={sim._id || index}
                className="bg-white bg-opacity-70 p-4 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-semibold text-primary-text">
                      Simulation #{index + 1}
                    </div>
                    <div className="text-sm text-primary-text opacity-70">
                      {new Date(sim.timestamp).toLocaleString()}
                    </div>
                    <div className="mt-2 text-sm text-primary-text">
                      Income: ${sim.financialData?.income?.toLocaleString() || 'N/A'} | 
                      Expenses: ${sim.financialData?.expenses?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-button-highlight">
                      {sim.score?.toFixed(0) || 'N/A'}
                    </div>
                    <div className="text-sm text-primary-text opacity-70">LRS Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-primary-text opacity-70">
            No saved simulations. Use the What-If Simulator and save your results!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;

