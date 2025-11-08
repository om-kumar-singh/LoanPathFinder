# LoanPathfinder — An Explainable AI Platform for Transparent Loan Assessment and Financial Empowerment

## 🎯 Objective

A full-stack intelligent loan advisory system built with MERN (MongoDB, Express, React, Node.js) and Flask (Python) for Explainable AI using SHAP + XGBoost.

## 🧠 Core Features

1. **Loan Readiness Score (LRS)** — Explainable AI with SHAP explanations
2. **What-If Simulator** — Dynamic financial scenario testing
3. **Commission-Neutral Loan Marketplace** — Unbiased loan recommendations
4. **Firebase Authentication** — Secure user profiles and data persistence

## ⚙️ Tech Stack

- **Frontend**: React.js, TailwindCSS, Recharts, Firebase Auth
- **Backend (AI)**: Flask, Python, SHAP, XGBoost
- **Backend (API)**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Hosting**: Firebase Hosting (frontend) + Render/Heroku (backend)

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB Atlas account
- Firebase account

### Installation

1. **Clone and install dependencies:**

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

2. **Configure Environment Variables:**

Create a `.env` file in `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<db_username>:<db_password>@loanpathfinder.w8ptzdd.mongodb.net/loanpathfinder?appName=LoanPathFinder
FLASK_URL=http://localhost:5001
```

**Important:** Replace `<db_username>` and `<db_password>` with your actual MongoDB Atlas credentials.

3. **Firebase Setup:**

The Firebase configuration is already set in `frontend/src/firebaseConfig.js`

4. **Run the application:**

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

5. **Deploy:**

```bash
# Frontend to Firebase
cd frontend
npm run build
firebase deploy

# Backend to Render/Heroku
# Follow platform-specific deployment guides
```

## 📁 Project Structure

```
LoanPathfinder/
├── frontend/          # React + Firebase
├── backend/           # Node.js + Express
├── flask_ai/          # Flask ML microservice
├── firebase.json      # Firebase configuration
├── docker-compose.yml # Docker setup
└── README.md
```

## 🎨 Color Palette

- `#B7E5CD` - Dashboard background
- `#8ABEB9` - Card & container accents
- `#305669` - Header / Primary text
- `#C1785A` - Buttons & highlights

## 📝 License

MIT License

