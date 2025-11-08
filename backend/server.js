import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import './firebaseAdmin.js'; // Initialize Firebase Admin

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5001';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    ...(process.env.NGROK_URL ? [process.env.NGROK_URL] : [])
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

console.log('✅ Firebase Admin initialized');
console.log('📊 Project ID: loanpathfinder-dce3a');

// Routes
app.use('/api/users', userRoutes);
app.use('/api', loanRoutes);

// Proxy route to Flask AI service
app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_URL}/predict`, req.body, {
      timeout: 10000
    });
    res.json(response.data);
  } catch (error) {
    console.error('Flask service error:', error.message);
    console.log('⚠️  Using fallback calculation - Flask service may not be running');
    
    // Calculate fallback score based on input data
    const data = req.body;
    const income = data.income || 50000;
    const expenses = data.expenses || 20000;
    const creditUtil = data.creditUtilization || 30;
    const debtRatio = data.debtRatio || 25;
    const savings = data.savings || 10000;
    const creditScore = data.creditScore || 720;
    const employment = data.employmentYears || 5;
    
    // Simple scoring algorithm (same as Flask fallback)
    let score = 50; // Base score
    
    // Income stability (0-20 points)
    if (income > 40000) score += 15;
    else if (income > 30000) score += 10;
    
    // Credit score (0-25 points)
    if (creditScore >= 750) score += 25;
    else if (creditScore >= 700) score += 18;
    else if (creditScore >= 650) score += 10;
    
    // Debt ratio (0-15 points)
    if (debtRatio < 20) score += 15;
    else if (debtRatio < 30) score += 10;
    else if (debtRatio < 40) score += 5;
    
    // Credit utilization (0-15 points)
    if (creditUtil < 30) score += 15;
    else if (creditUtil < 50) score += 8;
    
    // Savings buffer (0-10 points)
    if (savings > 20000) score += 10;
    else if (savings > 10000) score += 6;
    else if (savings > 5000) score += 3;
    
    // Employment stability (0-10 points)
    if (employment >= 5) score += 10;
    else if (employment >= 3) score += 6;
    else if (employment >= 1) score += 3;
    
    // Expenses impact (negative)
    const expenseRatio = (expenses / income) * 100;
    if (expenseRatio > 60) score -= 15;
    else if (expenseRatio > 50) score -= 10;
    
    score = Math.max(0, Math.min(100, score));
    
    // Determine risk category
    let riskCategory = 'Moderate';
    if (score >= 75) riskCategory = 'Low';
    else if (score < 50) riskCategory = 'High';
    
    // Estimate APR
    const baseAPR = {
      'Low': 3.5,
      'Moderate': 6.0,
      'High': 9.5
    };
    const estimatedAPR = baseAPR[riskCategory] + ((100 - score) * 0.05);
    
    // Generate explanation
    const explanation = {};
    if (income > 40000) explanation['Stable Income History'] = 28;
    else if (income > 30000) explanation['Stable Income History'] = 18;
    else explanation['Stable Income History'] = 8;
    
    if (creditUtil > 70) explanation['High Credit Utilization'] = -37;
    else if (creditUtil > 50) explanation['Moderate Credit Utilization'] = -22;
    else explanation['Low Credit Utilization'] = 15;
    
    if (debtRatio < 20) explanation['Low Debt-to-Income Ratio'] = 22;
    else if (debtRatio < 30) explanation['Moderate Debt-to-Income Ratio'] = 10;
    else explanation['High Debt-to-Income Ratio'] = -18;
    
    if (creditScore >= 750) explanation['Good Credit Score'] = 35;
    else if (creditScore >= 700) explanation['Fair Credit Score'] = 22;
    else explanation['Poor Credit Score'] = -15;
    
    if (employment >= 5) explanation['Employment Stability'] = 18;
    else if (employment >= 3) explanation['Employment Stability'] = 12;
    else explanation['Employment Stability'] = 5;
    
    if (savings > 20000) explanation['Savings Buffer'] = 15;
    else if (savings > 10000) explanation['Savings Buffer'] = 9;
    else explanation['Savings Buffer'] = 3;
    
    // Return fallback data in same format as Flask
    res.json({
      prediction: Math.round(score * 10) / 10,
      explanation: explanation,
      riskCategory: riskCategory,
      estimatedAPR: Math.round(estimatedAPR * 10) / 10
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    flaskUrl: FLASK_URL
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Flask AI URL: ${FLASK_URL}`);
});

