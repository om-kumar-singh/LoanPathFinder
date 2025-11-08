# 🔧 Quick Guide: Enable GitHub Sign-In

## Option 1: Enable GitHub in Firebase (Recommended if you want GitHub sign-in)

### Quick Steps:
1. **Firebase Console** → Your project → **Authentication** → **Sign-in method**
2. Click **"GitHub"**
3. Toggle **"Enable"** to ON
4. You'll need GitHub OAuth credentials:
   - Go to: https://github.com/settings/developers
   - Click **"New OAuth App"**
   - **Authorization callback URL:** `https://stablx-app.firebaseapp.com/__/auth/handler`
   - Copy **Client ID** and **Client secret**
   - Paste them in Firebase
5. Click **"Save"**

## Option 2: Skip GitHub (Easier - App works without it)

The app works perfectly fine with just:
- ✅ Email/Password sign-in
- ✅ Google sign-in

GitHub is optional. If you don't want to set it up, just ignore the error and use Email/Password or Google instead.

## Current Status

Your app already has:
- ✅ Email/Password authentication
- ✅ Google authentication  
- ⚠️ GitHub authentication (optional - needs setup)

You can use the app right now with Email/Password or Google sign-in!

