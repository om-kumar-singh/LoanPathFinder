# ngrok Setup Guide

## Overview
ngrok creates a secure tunnel to your local backend, allowing external access for testing and development.

## Step 1: Install ngrok

### Download
1. Visit: https://ngrok.com/download
2. Download for your operating system
3. Extract the executable

### Or use package manager:

**Windows (Chocolatey)**
```bash
choco install ngrok
```

**macOS (Homebrew)**
```bash
brew install ngrok/ngrok/ngrok
```

**Linux**
```bash
# Download and extract
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

## Step 2: Sign Up and Get Auth Token

1. Go to https://dashboard.ngrok.com/signup
2. Create a free account
3. Get your authtoken from the dashboard
4. Authenticate:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## Step 3: Expose Backend API

### Start your backend first:
```bash
cd backend
npm start
```

### In a new terminal, start ngrok:
```bash
ngrok http 5000
```

You'll see output like:
```
Forwarding   https://abc123.ngrok.io -> http://localhost:5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

## Step 4: Update Frontend Configuration

1. Create `frontend/.env` file:

```env
REACT_APP_API_URL=https://your-ngrok-url.ngrok.io
```

2. Restart your React app:
```bash
cd frontend
npm start
```

## Step 5: Update Backend CORS (if needed)

The backend already includes ngrok URL support. If you need to add a specific URL:

1. Update `backend/.env`:
```env
NGROK_URL=https://your-ngrok-url.ngrok.io
```

2. Restart backend server

## Step 6: Optional - Expose Flask AI Service

If you need external access to Flask:

```bash
# In a new terminal
cd flask_ai
python app.py

# In another terminal
ngrok http 5001
```

Update `backend/.env`:
```env
FLASK_URL=https://flask-ngrok-url.ngrok.io
```

## Important Notes

1. **Free tier limitations:**
   - ngrok URL changes each time you restart (unless you have a paid plan)
   - Update `.env` file each time you get a new URL

2. **Security:**
   - ngrok URLs are public - don't expose sensitive data
   - Use only for development/testing

3. **Persistence:**
   - For a static URL, consider ngrok paid plans
   - Or use a domain with ngrok reserved domains

## Testing

1. Start backend: `cd backend && npm start`
2. Start ngrok: `ngrok http 5000`
3. Copy ngrok HTTPS URL
4. Update `frontend/.env` with the URL
5. Start frontend: `cd frontend && npm start`
6. Test API calls - they should work through ngrok

## Troubleshooting

### Connection refused
- Ensure backend is running on port 5000
- Check ngrok is forwarding to correct port

### CORS errors
- Verify ngrok URL is in backend CORS configuration
- Check backend server.js CORS settings

### URL not working
- ngrok free URLs expire - restart ngrok to get new URL
- Update frontend `.env` with new URL
- Restart React app after updating `.env`

## Alternative: Use ngrok with config file

Create `ngrok.yml`:
```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN
tunnels:
  backend:
    addr: 5000
    proto: http
  flask:
    addr: 5001
    proto: http
```

Run:
```bash
ngrok start --all
```

