import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
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
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
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
      await signInWithPopup(auth, provider);
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

  const handleGithubSignIn = async () => {
    setError('');
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('GitHub auth error:', error);
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        setError('GitHub sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method → GitHub. Or use Email/Password or Google sign-in instead.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show error
        return;
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

          <button
            onClick={handleGithubSignIn}
            className="w-full bg-white text-primary-text py-3 rounded-lg border-2 border-primary-text hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <span>⚫</span>
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

