#!/bin/bash

echo "🚀 Setting up LoanPathfinder..."

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Flask AI setup
echo "📦 Installing Flask AI dependencies..."
cd flask_ai
pip install -r requirements.txt
cd ..

echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo "1. Start Flask AI: cd flask_ai && python app.py"
echo "2. Start Backend: cd backend && npm start"
echo "3. Start Frontend: cd frontend && npm start"
echo ""
echo "Make sure to:"
echo "- Set up Firebase service account (backend/firebase-service-account.json)"
echo "- Configure backend/.env with Firebase settings"
echo "- Enable Firestore and Authentication in Firebase Console"

