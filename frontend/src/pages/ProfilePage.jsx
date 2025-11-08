import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import axios from 'axios';
import ScoreHistory from '../components/ScoreHistory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('history');
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/simulations`, {
          params: { userId: user?.uid || 'current-user' }
        });
        // Handle new API response format with pagination
        setSavedSimulations(response.data.simulations || response.data);
      } catch (err) {
        console.error('Error fetching simulations:', err);
        setSavedSimulations([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSimulations();
    }
  }, [user]);

  const handleDeleteSimulation = async (simId) => {
    if (!window.confirm('Are you sure you want to delete this simulation?')) {
      return;
    }
    
    try {
      // Note: You'll need to add DELETE endpoint in backend
      await axios.delete(`${API_URL}/api/simulations/${simId}`);
      setSavedSimulations(prev => prev.filter(sim => sim._id !== simId));
    } catch (err) {
      console.error('Error deleting simulation:', err);
      alert('Failed to delete simulation');
    }
  };

  const chartData = savedSimulations.map((sim, index) => ({
    name: `Sim ${index + 1}`,
    score: sim.score,
    income: sim.financialData?.income || 0
  }));

  const tabs = [
    { id: 'history', label: 'Score History' },
    { id: 'simulations', label: 'Saved Simulations' },
    { id: 'settings', label: 'Account Settings' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-blue mb-2">
          👤 Your Profile
        </h1>
        <p className="text-primary-text opacity-70">
          Manage your account and view your loan assessment history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-primary-text opacity-70">Email</label>
              <div className="text-deep-blue font-semibold">{user?.email}</div>
            </div>
            <div>
              <label className="text-primary-text opacity-70">User ID</label>
              <div className="text-deep-blue font-semibold text-sm break-all">
                {user?.uid}
              </div>
            </div>
            <div>
              <label className="text-primary-text opacity-70">Account Created</label>
              <div className="text-deep-blue font-semibold">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">
            Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary-text">Total Simulations</span>
              <span className="text-deep-blue font-bold">
                {savedSimulations.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-text">Average Score</span>
              <span className="text-deep-blue font-bold">
                {savedSimulations.length > 0
                  ? (savedSimulations.reduce((sum, s) => sum + (s.score || 0), 0) /
                      savedSimulations.length).toFixed(1)
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-text">Best Score</span>
              <span className="text-deep-blue font-bold">
                {savedSimulations.length > 0
                  ? Math.max(...savedSimulations.map(s => s.score || 0))
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="neumorphic-card mb-6">
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-teal border-b-2 border-primary-teal'
                  : 'text-primary-text opacity-70 hover:text-primary-teal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'history' && (
          <div>
            <ScoreHistory userId={user?.uid} />
            {chartData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-deep-blue mb-4">Score Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#41A67E" name="LRS Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === 'simulations' && (
          <div>
            <h3 className="text-xl font-bold text-deep-blue mb-4">
              💾 Saved Simulations
            </h3>
            {loading ? (
              <div className="text-center text-primary-text">Loading...</div>
            ) : savedSimulations.length > 0 ? (
              <div className="space-y-3">
                {savedSimulations.map((sim, index) => (
                  <div
                    key={sim._id || index}
                    className="bg-light-gray p-4 rounded-lg border border-primary-teal border-opacity-20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-deep-blue">
                          Simulation #{index + 1}
                        </div>
                        <div className="text-sm text-primary-text opacity-70 mt-1">
                          {new Date(sim.timestamp).toLocaleString()}
                        </div>
                        <div className="mt-2 text-sm text-primary-text">
                          <div>Income: ${sim.financialData?.income?.toLocaleString() || 'N/A'}</div>
                          <div>Expenses: ${sim.financialData?.expenses?.toLocaleString() || 'N/A'}</div>
                          <div>Credit Score: {sim.financialData?.creditScore || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary-teal">
                          {sim.score?.toFixed(0) || 'N/A'}
                        </div>
                        <div className="text-sm text-primary-text opacity-70">LRS Score</div>
                        <button
                          onClick={() => handleDeleteSimulation(sim._id)}
                          className="mt-2 text-red-500 text-sm hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-primary-text opacity-70 py-8">
                No saved simulations. Use the What-If Simulator and save your results!
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="text-xl font-bold text-deep-blue mb-4">
              Account Settings
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-light-gray rounded-lg">
                <p className="text-primary-text opacity-70 mb-2">
                  To change your password or update account settings, please use Firebase Authentication.
                </p>
                <p className="text-sm text-primary-text opacity-60">
                  Account management is handled through Firebase Auth. You can update your profile in the Firebase Console.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

