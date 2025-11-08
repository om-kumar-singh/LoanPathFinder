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
  const [profile, setProfile] = useState({ name: '', gender: '', age: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', gender: '', age: '' });
  
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

    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const response = await axios.get(`${API_URL}/api/users/${user.uid}/profile`);
          const profileData = response.data || {};
          setProfile({
            name: profileData.name || '',
            gender: profileData.gender || '',
            age: profileData.age || null,
            email: profileData.email || user?.email || ''
          });
          setEditForm({
            name: profileData.name || '',
            gender: profileData.gender || '',
            age: profileData.age || ''
          });
        } catch (err) {
          console.error('Error fetching profile:', err);
          // Set default empty profile if fetch fails
          setProfile({
            name: '',
            gender: '',
            age: null,
            email: user?.email || ''
          });
        }
      }
    };

    if (user) {
      fetchSimulations();
      fetchProfile();
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
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-deep-blue mb-2">
          👤 Your Profile
        </h1>
        <p className="text-primary-text opacity-70 text-sm md:text-base">
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
        <div className="flex flex-wrap space-x-2 md:space-x-4 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 md:px-4 font-semibold transition-colors whitespace-nowrap text-sm md:text-base ${
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
            
            {profileError && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {profileError}
              </div>
            )}
            
            {profileSuccess && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {profileSuccess}
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-4">
                <div className="neumorphic-card">
                  <div className="space-y-4">
                    <div>
                      <label className="text-primary-text opacity-70 text-sm">Name</label>
                      <div className="text-deep-blue font-semibold mt-1">
                        {profile.name ? profile.name : <span className="text-gray-400 italic">Not set</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-primary-text opacity-70 text-sm">Gender</label>
                      <div className="text-deep-blue font-semibold mt-1">
                        {profile.gender ? profile.gender : <span className="text-gray-400 italic">Not set</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-primary-text opacity-70 text-sm">Age</label>
                      <div className="text-deep-blue font-semibold mt-1">
                        {profile.age ? profile.age : <span className="text-gray-400 italic">Not set</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-primary-text opacity-70 text-sm">Email</label>
                      <div className="text-deep-blue font-semibold mt-1">
                        {profile.email || user?.email || 'Not set'}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="neumorphic-card">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-deep-blue font-semibold mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="input-field"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-blue font-semibold mb-2">
                        Gender
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-deep-blue font-semibold mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={editForm.age}
                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                        className="input-field"
                        placeholder="Enter your age"
                        min="1"
                        max="120"
                      />
                    </div>
                    <div>
                      <label className="text-primary-text opacity-70 text-sm">Email</label>
                      <div className="text-deep-blue font-semibold mt-1">
                        {profile.email || user?.email || 'Not set'}
                      </div>
                      <p className="text-xs text-primary-text opacity-60 mt-1">
                        Email cannot be changed here. Use Firebase Authentication to update email.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={async () => {
                      setProfileLoading(true);
                      setProfileError('');
                      setProfileSuccess('');
                      try {
                        const response = await axios.put(
                          `${API_URL}/api/users/${user.uid}/profile`,
                          {
                            name: editForm.name,
                            gender: editForm.gender,
                            age: editForm.age ? parseInt(editForm.age) : null,
                            email: profile.email || user?.email
                          }
                        );
                        setProfile(response.data);
                        setIsEditing(false);
                        setProfileSuccess('Profile updated successfully!');
                        setTimeout(() => setProfileSuccess(''), 3000);
                      } catch (err) {
                        console.error('Error updating profile:', err);
                        setProfileError('Failed to update profile. Please try again.');
                      } finally {
                        setProfileLoading(false);
                      }
                    }}
                    className="btn-primary"
                    disabled={profileLoading}
                  >
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: profile.name || '',
                        gender: profile.gender || '',
                        age: profile.age || ''
                      });
                      setProfileError('');
                      setProfileSuccess('');
                    }}
                    className="px-4 py-2 border-2 border-primary-text text-primary-text rounded-lg hover:bg-light-gray transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

