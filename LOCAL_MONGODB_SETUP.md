# Local MongoDB Setup Guide

## Overview
This guide will help you set up a local MongoDB instance for development instead of using MongoDB Atlas.

## Step 1: Install MongoDB Community Edition

### Windows
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service (recommended)
5. Install MongoDB Compass (optional GUI tool)

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

## Step 2: Start MongoDB Service

### Windows
MongoDB should start automatically as a Windows Service. If not:
1. Open Services (services.msc)
2. Find "MongoDB" service
3. Right-click → Start

### macOS
```bash
brew services start mongodb-community
```

### Linux
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Start on boot
```

## Step 3: Verify MongoDB is Running

```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB: 7.0.x
```

## Step 4: Update Backend Configuration

1. Open `backend/.env` file
2. Update the MONGO_URI:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/loanpathfinder
FLASK_URL=http://localhost:5001
```

## Step 5: Test Connection

Run the backend:
```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

## Step 6: Create Database and Collections

MongoDB will automatically create the database and collections when you first save data. However, you can also create them manually:

```bash
mongosh
use loanpathfinder
db.createCollection("simulations")
db.createCollection("users")
```

## Troubleshooting

### MongoDB won't start
- Check if port 27017 is already in use
- Verify MongoDB service is running
- Check MongoDB logs (usually in `/var/log/mongodb/mongod.log` on Linux)

### Connection refused
- Ensure MongoDB service is running
- Check firewall settings
- Verify connection string in `.env` file

### Permission errors
- On Linux, ensure MongoDB has write permissions to data directory
- Check `/var/lib/mongodb` permissions

## Data Directory

MongoDB stores data in:
- **Windows**: `C:\Program Files\MongoDB\Server\7.0\data\`
- **macOS**: `/usr/local/var/mongodb`
- **Linux**: `/var/lib/mongodb`

## Backup and Restore

### Backup
```bash
mongodump --db=loanpathfinder --out=/path/to/backup
```

### Restore
```bash
mongorestore --db=loanpathfinder /path/to/backup/loanpathfinder
```

## Next Steps

After setting up local MongoDB, proceed to ngrok setup (see NGROK_SETUP.md) to expose your backend API.

