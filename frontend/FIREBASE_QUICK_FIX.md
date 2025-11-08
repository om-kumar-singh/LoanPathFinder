# ⚡ Quick Fix for Firebase Auth Error

## The Problem
`auth/configuration-not-found` means Firebase Authentication is not enabled.

## Quick Solution (2 minutes)

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select project: **stablx-app**

2. **Enable Authentication:**
   - Click **"Authentication"** in left sidebar
   - Click **"Get Started"** (if shown)
   - Go to **"Sign-in method"** tab

3. **Enable Email/Password:**
   - Click **"Email/Password"**
   - Toggle **"Enable"** ON
   - Click **"Save"**

4. **Enable Google (optional):**
   - Click **"Google"**
   - Toggle **"Enable"** ON
   - Enter support email
   - Click **"Save"**

5. **Restart your React app:**
   ```bash
   # Stop the app (Ctrl+C) and restart
   npm start
   ```

## That's it! ✅

The error should be gone. Try signing up now!

## Still Not Working?

If you get "Project not found":
- The Firebase project might not exist
- Create a new project and update `firebaseConfig.js` with new credentials

