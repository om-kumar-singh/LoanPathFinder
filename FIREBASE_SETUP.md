# Firebase Setup Guide for LoanPathfinder

## Overview
This project uses Firebase Firestore for database operations and Firebase Authentication for user management.

## Firebase Project Configuration

**Project ID:** `loanpathfinder-dce3a`  
**Project Name:** LoanPathfinder

## Step 1: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **loanpathfinder-dce3a**
3. Enable required services:

### Enable Firestore Database
1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to your users)
5. Click **"Enable"**

### Enable Authentication
1. Click **"Authentication"** in left sidebar
2. Click **"Get Started"**
3. Enable sign-in methods:
   - **Email/Password** - Enable
   - **Google** - Enable (optional)
   - **GitHub** - Enable (optional)

## Step 2: Backend Firebase Admin Setup

### Option A: Service Account Key (Recommended for Development)

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Save the JSON file as `backend/firebase-service-account.json`
5. Add to `.gitignore`:
   ```
   backend/firebase-service-account.json
   ```

6. Update `backend/.env`:
   ```env
   FIREBASE_PROJECT_ID=loanpathfinder-dce3a
   FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account.json
   ```

### Option B: Application Default Credentials (For Production)

For production environments (GCP, Cloud Run, etc.), use Application Default Credentials:
```env
FIREBASE_PROJECT_ID=loanpathfinder-dce3a
# No FIREBASE_SERVICE_ACCOUNT_KEY needed
```

## Step 3: Firestore Security Rules

Update Firestore security rules in Firebase Console:

1. Go to **Firestore Database** → **Rules**
2. Add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Simulations collection - users can only access their own data
    match /simulations/{simulationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

## Step 4: Frontend Configuration

The frontend Firebase config is already set in `frontend/src/firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBXZm630z7f8cE8gjGshUj0oAaRYT11eGE",
  authDomain: "loanpathfinder-dce3a.firebaseapp.com",
  projectId: "loanpathfinder-dce3a",
  // ... other config
};
```

No changes needed unless you want to use a different Firebase project.

## Step 5: Install Dependencies

### Backend
```bash
cd backend
npm install firebase-admin
```

### Frontend
Firebase SDK should already be installed. Verify:
```bash
cd frontend
npm list firebase
```

If not installed:
```bash
npm install firebase
```

## Step 6: Test the Setup

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Should see: `✅ Firebase Admin initialized successfully`

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test Authentication:**
   - Sign up with email/password
   - Should create user in Firebase Auth

4. **Test Firestore:**
   - Submit a form simulation
   - Check Firebase Console → Firestore Database
   - Should see data in `simulations` collection

## Firestore Collections Structure

### `simulations` Collection
- **Document ID:** Auto-generated
- **Fields:**
  - `userId` (string) - Firebase Auth UID
  - `financialData` (object) - User's financial information
  - `score` (number) - Loan readiness score
  - `explanation` (map) - SHAP explanation values
  - `riskCategory` (string) - Low/Moderate/High
  - `estimatedAPR` (number) - Estimated interest rate
  - `timestamp` (timestamp) - When simulation was created

### `users` Collection
- **Document ID:** Firebase Auth UID
- **Fields:**
  - `firebaseUID` (string) - Firebase Auth UID
  - `email` (string) - User email
  - `preferences` (object) - User preferences
    - `loanPreference` (string) - lowestEMI/fastestApproval/lowestInterest
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

## Troubleshooting

### "Firebase Admin initialization error"
- Check that service account JSON file exists and path is correct
- Verify `FIREBASE_PROJECT_ID` in `.env` matches your project
- Ensure service account has proper permissions

### "Permission denied" errors
- Check Firestore security rules
- Verify user is authenticated
- Ensure rules allow the operation you're trying to perform

### "Collection not found"
- Firestore creates collections automatically on first write
- Check Firebase Console → Firestore Database to verify collections exist

### Data not appearing
- Check Firestore Console to see if data is being written
- Verify userId matches authenticated user
- Check browser console for errors

## Production Considerations

1. **Update Security Rules:** Use more restrictive rules for production
2. **Indexes:** Create composite indexes for complex queries
3. **Backup:** Set up Firestore backups
4. **Monitoring:** Enable Firestore monitoring and alerts
5. **Billing:** Monitor Firestore usage and costs

## Next Steps

After setup:
1. Test all CRUD operations
2. Verify security rules work correctly
3. Test with multiple users
4. Monitor Firestore usage in Firebase Console

