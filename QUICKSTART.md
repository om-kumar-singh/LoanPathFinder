# 🚀 Quick Start Guide

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB Atlas** account (free tier works) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Firebase** account - Already configured in `frontend/src/firebaseConfig.js`

## Step 1: Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend (Node.js)
```bash
cd backend
npm install
```

### Flask AI Service
```bash
cd flask_ai
pip install -r requirements.txt
```

## Step 2: Configure Environment

### Backend Configuration
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
FIREBASE_PROJECT_ID=loanpathfinder-dce3a
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account.json
FLASK_URL=http://localhost:5001
```

**Firebase Setup:**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `backend/firebase-service-account.json`
4. See `FIREBASE_SETUP.md` for detailed instructions

**For ngrok Setup (to expose backend):** See `NGROK_SETUP.md`

### Frontend Configuration (Optional - for ngrok)
Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

Or if using ngrok:
```env
REACT_APP_API_URL=https://your-ngrok-url.ngrok.io
```

**Note:** Frontend Firebase config is already set in `frontend/src/firebaseConfig.js`

## Step 3: Run the Application

You need **3 terminal windows** running simultaneously:

### Terminal 1: Flask AI Service
```bash
cd flask_ai
python app.py
```
Expected output: `🚀 Flask AI Service starting on port 5001`

### Terminal 2: Node.js Backend
```bash
cd backend
npm start
```
Expected output: `🚀 Server running on port 5000`

### Terminal 3: React Frontend
```bash
cd frontend
npm start
```
Expected output: Opens browser at `http://localhost:3000`

## Step 4: Access the Application

1. Open your browser to `http://localhost:3000`
2. Sign up or sign in with:
   - Email/Password
   - Google
   - GitHub
3. Start using LoanPathfinder!

## 🎯 Features to Try

1. **Loan Readiness Score**: View your AI-powered loan eligibility score
2. **What-If Simulator**: Adjust financial sliders to see real-time score changes
3. **Loan Marketplace**: Browse commission-neutral loan offers
4. **Profile Dashboard**: View your saved simulations and history

## 🐛 Troubleshooting

### Flask service not responding
- Make sure Flask is running on port 5001
- Check that all Python dependencies are installed
- The app will use fallback calculations if Flask is unavailable

### MongoDB connection error
- Verify your MongoDB URI in `backend/.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Check that your database password is correct

### Frontend not connecting to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `FLASK_URL` in backend `.env` matches Flask service URL

## 📦 Deployment

### Frontend to Firebase
```bash
cd frontend
npm run build
firebase deploy
```

### Backend to Render/Heroku
1. Push code to GitHub
2. Connect repository to Render/Heroku
3. Set environment variables
4. Deploy!

## 🎨 Customization

- **Colors**: Edit `frontend/tailwind.config.js`
- **Firebase**: Update `frontend/src/firebaseConfig.js`
- **ML Model**: Train and save models to `flask_ai/models/`

## 📚 Next Steps

- Train a real ML model with your data
- Add more loan products to the marketplace
- Implement PDF report generation
- Add chatbot for loan tips

Happy coding! 🎉

