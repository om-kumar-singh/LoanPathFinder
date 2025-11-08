import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Sync user to backend/Firestore
      if (userCredential?.user) {
        try {
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          await fetch(`${API_URL}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firebaseUID: userCredential.user.uid,
              email: userCredential.user.email
            })
          });
        } catch (syncError) {
          console.error('Error syncing user:', syncError);
          // Don't block login if sync fails
        }
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      if (error.code === 'auth/configuration-not-found') {
        setError('Firebase Authentication is not enabled. Please enable it in Firebase Console.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('This sign-in method is not enabled. Please enable Email/Password in Firebase Console.');
      } else {
        setError(error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Sync user to backend/Firestore
      if (result?.user) {
        try {
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          await fetch(`${API_URL}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firebaseUID: result.user.uid,
              email: result.user.email
            })
          });
        } catch (syncError) {
          console.error('Error syncing user:', syncError);
          // Don't block login if sync fails
        }
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
      if (error.code === 'auth/configuration-not-found') {
        setError('Google sign-in is not enabled. Please enable it in Firebase Console.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Google sign-in method is not enabled. Please enable it in Firebase Console.');
      } else {
        setError(error.message);
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="neumorphic-card max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary-text mb-2 text-center">
          🏦 LoanPathfinder
        </h1>
        <p className="text-primary-text text-center mb-6">
          Transparent Loan Assessment Platform
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-primary-text mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-primary-text mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary-text hover:text-button-highlight transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-text opacity-30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card-accent text-primary-text">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-primary-text py-3 rounded-lg border-2 border-primary-text hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🔵</span>
            <span>Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

