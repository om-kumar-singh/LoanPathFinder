# LoanPathfinder — An Explainable AI Platform for Transparent Loan Assessment

A full-stack intelligent loan advisory system built with React, Node.js, and Flask for Explainable AI using SHAP + XGBoost. Features Firebase Authentication and Firestore for data persistence.

## 🎯 Core Features

1. **Loan Readiness Score (LRS)** — Explainable AI with SHAP explanations
2. **What-If Simulator** — Dynamic financial scenario testing with real-time score updates
3. **Commission-Neutral Loan Marketplace** — Unbiased loan recommendations
4. **Firebase Authentication** — Secure user profiles and data persistence
5. **Analytics Dashboard** — Comprehensive insights into loan eligibility
6. **Score History** — Track your loan readiness over time

## ⚙️ Tech Stack

- **Frontend**: React.js, TailwindCSS, Recharts, Firebase Auth & Firestore
- **Backend (AI)**: Flask, Python, SHAP, XGBoost
- **Backend (API)**: Node.js, Express.js, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Firebase account (project: `loanpathfinder-dce3a`)

### Installation

1. **Clone the repository and install dependencies:**

```bash
# Frontend
cd frontend
npm install

# Backend (Node.js)
cd ../backend
npm install

# Flask AI Service
cd ../flask_ai
pip install -r requirements.txt
```

2. **Configure Backend Environment:**

Create a `.env` file in `backend/` directory:

```env
PORT=5000
FIREBASE_PROJECT_ID=loanpathfinder-dce3a
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account.json
FLASK_URL=http://localhost:5001
```

**Firebase Service Account Setup:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **loanpathfinder-dce3a**
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Save the JSON file as `backend/firebase-service-account.json`

3. **Enable Firebase Services:**

- **Firestore Database**: Go to Firestore Database → Create database (start in test mode for development)
- **Authentication**: Go to Authentication → Get Started → Enable Email/Password sign-in

4. **Run the Application:**

You need **3 terminal windows**:

```bash
# Terminal 1 - Flask AI Service
cd flask_ai
python app.py

# Terminal 2 - Node.js Backend
cd backend
npm start

# Terminal 3 - React Frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Flask AI: http://localhost:5001

## 📁 Project Structure

```
LoanPathfinder/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── styles/         # CSS and theme files
│   │   └── firebaseConfig.js
│   └── package.json
├── backend/               # Node.js API server
│   ├── routes/           # API routes
│   ├── services/         # Firestore service layer
│   ├── firebaseAdmin.js  # Firebase Admin initialization
│   └── server.js
├── flask_ai/            # Flask ML microservice
│   ├── app.py           # Flask application
│   ├── utils/          # ML utilities (SHAP, preprocessing)
│   └── requirements.txt
└── README.md
```

## 🔐 Firebase Configuration

The frontend Firebase configuration is already set in `frontend/src/firebaseConfig.js`:

- **Project ID**: `loanpathfinder-dce3a`
- **Auth Domain**: `loanpathfinder-dce3a.firebaseapp.com`

### Firestore Security Rules

Set up security rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /simulations/{simulationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        userId == request.auth.uid;
    }
  }
}
```

## 🎨 Color Palette

- **Primary Teal**: `#41A67E` - Buttons, highlights, headers
- **Deep Blue**: `#05339C` - Navbar background, active links
- **Royal Blue**: `#1055C9` - Form inputs, hover states
- **Highlight Yellow**: `#E5C95F` - Cards, statistics highlights
- **Light Gray**: `#F9FAFB` - Background

## 📝 API Endpoints

### Simulations
- `POST /api/simulations` - Save a simulation
- `GET /api/simulations?userId={uid}` - Get user simulations
- `DELETE /api/simulations/:id` - Delete a simulation

### Statistics
- `GET /api/statistics?timeRange={week|month|year}` - Get aggregated statistics

### Users
- `POST /api/users/sync` - Sync/create user
- `GET /api/users/:uid/preferences` - Get user preferences
- `PUT /api/users/:uid/preferences` - Update user preferences

### Loans
- `GET /api/loans?preference={lowestEMI|lowestInterest|fastestApproval}` - Get loan offers

### Export
- `GET /api/export/csv?userId={uid}` - Export simulations as CSV

## 🚢 Deployment

### Frontend (Firebase Hosting)

```bash
cd frontend
npm run build
firebase deploy
```

### Backend (Render/Heroku)

1. Set environment variables:
   - `FIREBASE_PROJECT_ID=loanpathfinder-dce3a`
   - `FIREBASE_SERVICE_ACCOUNT_KEY` (as environment variable or file)
   - `FLASK_URL=<your-flask-service-url>`

2. Deploy using platform-specific guides

### Flask AI Service

Deploy to any Python hosting service (Render, Heroku, AWS, etc.)

## 🛠️ Development

### Running in Development Mode

```bash
# Backend with auto-reload
cd backend
npm run dev

# Frontend (auto-reloads on changes)
cd frontend
npm start
```

### Testing

- Frontend: `cd frontend && npm test`
- Backend: Manual testing via API endpoints
- Flask: Test ML predictions via `/predict` endpoint

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues and questions, please open an issue on GitHub.
