import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    income: '',
    expenses: '',
    creditUtilization: '',
    debtRatio: '',
    savings: '',
    creditScore: '',
    employmentYears: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => f !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  React.useEffect(() => {
    setProgress(calculateProgress());
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.income || formData.income <= 0) {
      newErrors.income = 'Income must be greater than 0';
    }
    if (!formData.expenses || formData.expenses < 0) {
      newErrors.expenses = 'Expenses cannot be negative';
    }
    if (!formData.creditUtilization || formData.creditUtilization < 0 || formData.creditUtilization > 100) {
      newErrors.creditUtilization = 'Credit utilization must be between 0 and 100';
    }
    if (!formData.debtRatio || formData.debtRatio < 0 || formData.debtRatio > 100) {
      newErrors.debtRatio = 'Debt ratio must be between 0 and 100';
    }
    if (!formData.savings || formData.savings < 0) {
      newErrors.savings = 'Savings cannot be negative';
    }
    if (!formData.creditScore || formData.creditScore < 300 || formData.creditScore > 850) {
      newErrors.creditScore = 'Credit score must be between 300 and 850';
    }
    if (!formData.employmentYears || formData.employmentYears < 0) {
      newErrors.employmentYears = 'Employment years cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : ''
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const response = await axios.post(`${API_URL}/api/predict`, formData);
      // Navigate to dashboard with analytics data
      navigate('/dashboard', { 
        state: { 
          analyticsData: response.data,
          financialData: formData
        } 
      });
    } catch (error) {
      console.error('Error generating analytics:', error);
      let errorMessage = 'Failed to generate analytics. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 500) {
          errorMessage = 'AI service is temporarily unavailable. Please try again later.';
        } else if (error.response.status === 503) {
          errorMessage = 'Service is currently unavailable. Please check if Flask AI service is running.';
        } else {
          errorMessage = error.response.data?.error || errorMessage;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else {
        // Error setting up request
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-deep-blue mb-2">
          Financial Information Form
        </h1>
        <p className="text-primary-text opacity-70 text-sm md:text-base">
          Fill in your details to get personalized loan insights
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 neumorphic-card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-primary-text font-semibold">Form Completion</span>
          <span className="text-primary-teal font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-light-gray rounded-full h-3">
          <div
            className="bg-primary-teal h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="neumorphic-card">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-deep-blue font-semibold mb-2">
              Annual Income ($)
            </label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className="input-field"
              placeholder="50000"
              required
            />
            {errors.income && (
              <p className="text-red-500 text-sm mt-1">{errors.income}</p>
            )}
          </div>

          <div>
            <label className="block text-deep-blue font-semibold mb-2">
              Monthly Expenses ($)
            </label>
            <input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              className="input-field"
              placeholder="20000"
              required
            />
            {errors.expenses && (
              <p className="text-red-500 text-sm mt-1">{errors.expenses}</p>
            )}
          </div>

          <div>
            <label className="block text-deep-blue font-semibold mb-2">
              Credit Utilization (%)
            </label>
            <input
              type="number"
              name="creditUtilization"
              value={formData.creditUtilization}
              onChange={handleChange}
              className="input-field"
              placeholder="30"
              min="0"
              max="100"
              required
            />
            {errors.creditUtilization && (
              <p className="text-red-500 text-sm mt-1">{errors.creditUtilization}</p>
            )}
          </div>

          <div>
            <label className="block text-deep-blue font-semibold mb-2">
              Debt-to-Income Ratio (%)
            </label>
            <input
              type="number"
              name="debtRatio"
              value={formData.debtRatio}
              onChange={handleChange}
              className="input-field"
              placeholder="25"
              min="0"
              max="100"
              required
            />
            {errors.debtRatio && (
              <p className="text-red-500 text-sm mt-1">{errors.debtRatio}</p>
            )}
          </div>

          <div>
            <label className="block text-deep-blue font-semibold mb-2">
              Savings ($)
            </label>
            <input
              type="number"
              name="savings"
              value={formData.savings}
              onChange={handleChange}
              className="input-field"
              placeholder="10000"
              min="0"
              required
            />
            {errors.savings && (
              <p className="text-red-500 text-sm mt-1">{errors.savings}</p>
            )}
          </div>

          <div>
            <label className="block text-deep-blue font-semibold mb-2">
              Credit Score
            </label>
            <input
              type="number"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              className="input-field"
              placeholder="720"
              min="300"
              max="850"
              required
            />
            {errors.creditScore && (
              <p className="text-red-500 text-sm mt-1">{errors.creditScore}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-deep-blue font-semibold mb-2">
              Years of Employment
            </label>
            <input
              type="number"
              name="employmentYears"
              value={formData.employmentYears}
              onChange={handleChange}
              className="input-field"
              placeholder="5"
              min="0"
              required
            />
            {errors.employmentYears && (
              <p className="text-red-500 text-sm mt-1">{errors.employmentYears}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || progress < 100}
          >
            {loading ? 'Generating Analytics...' : 'Generate Analytics'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

