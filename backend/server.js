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
    // Fallback response if Flask is not available
    res.status(500).json({
      error: 'AI service unavailable',
      message: 'Flask AI service is not running. Please start the Flask service.',
      fallback: {
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
      }
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

