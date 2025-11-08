# 🔥 Firebase Authentication Setup Guide

## Error: `auth/configuration-not-found`

This error means Firebase Authentication is not enabled or configured in your Firebase project.

## Step-by-Step Fix

### Step 1: Go to Firebase Console

1. Visit: https://console.firebase.google.com/
2. Select your project: **stablx-app** (or create a new one)

### Step 2: Enable Authentication

1. In the left sidebar, click **"Authentication"**
2. Click **"Get Started"** (if you see this button)
3. You should see the Authentication dashboard

### Step 3: Enable Sign-in Methods

1. Click on the **"Sign-in method"** tab
2. Enable the following providers:

#### Email/Password:
- Click on **"Email/Password"**
- Toggle **"Enable"** to ON
- Click **"Save"**

#### Google:
- Click on **"Google"**
- Toggle **"Enable"** to ON
- Enter a project support email
- Click **"Save"**

#### GitHub (Optional):
- Click on **"GitHub"**
- Toggle **"Enable"** to ON
- You'll need to create a GitHub OAuth App (optional)
- Click **"Save"**

### Step 4: Verify Your Firebase Config

Make sure your `frontend/src/firebaseConfig.js` matches your Firebase project:

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click on the web app (or create one)
4. Copy the config values

### Step 5: Update firebaseConfig.js (if needed)

If you created a new project, update `frontend/src/firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Alternative: Create New Firebase Project

If the current project doesn't work:

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter project name: **loanpathfinder** (or any name)
4. Follow the setup wizard
5. Enable Authentication
6. Enable sign-in methods (Email/Password, Google)
7. Copy the config to `firebaseConfig.js`

## Testing

After enabling Authentication:

1. Restart your React app
2. Try signing up with email/password
3. The error should be gone!

## Common Issues

- **"Project not found"**: The project ID in config doesn't match Firebase
- **"Auth domain not authorized"**: Check authDomain matches your project
- **"API key invalid"**: Regenerate API key in Firebase Console

