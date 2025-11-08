# 🔧 Enable GitHub Sign-In in Firebase

## Step-by-Step Guide

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project: **stablx-app**

### Step 2: Open Authentication
1. Click **"Authentication"** in the left sidebar
2. Click on the **"Sign-in method"** tab

### Step 3: Enable GitHub Provider
1. Scroll down and find **"GitHub"** in the list
2. Click on **"GitHub"**
3. Toggle **"Enable"** to **ON**

### Step 4: Get GitHub OAuth Credentials

You need to create a GitHub OAuth App first:

#### A. Create GitHub OAuth App:
1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"** (or **"OAuth Apps"** → **"New OAuth App"**)
3. Fill in the form:
   - **Application name:** LoanPathfinder (or any name)
   - **Homepage URL:** `http://localhost:3000` (for development)
   - **Authorization callback URL:** `https://stablx-app.firebaseapp.com/__/auth/handler`
     - Or use: `http://localhost:3000` for local development
4. Click **"Register application"**
5. Copy the **"Client ID"** and **"Client secret"**

#### B. Add Credentials to Firebase:
1. Back in Firebase Console, paste:
   - **Client ID:** (from GitHub)
   - **Client secret:** (from GitHub)
2. Click **"Save"**

### Step 5: Test
1. Restart your React app
2. Try signing in with GitHub
3. It should work! ✅

## Alternative: Make GitHub Optional

If you don't want to set up GitHub authentication, you can hide the GitHub button. The app will work fine with just Email/Password and Google sign-in.

## Troubleshooting

- **"Invalid OAuth client"**: Check that the callback URL matches exactly
- **"Redirect URI mismatch"**: Make sure the callback URL in GitHub matches Firebase
- **"Client secret invalid"**: Regenerate the secret in GitHub and update Firebase

