# 🚀 PM2 Setup Guide

## Overview

PM2 (Process Manager 2) is a production process manager for Node.js applications. It keeps your application alive forever, reloads it without downtime, and facilitates common system admin tasks.

---

## ✅ Prerequisites

- Node.js installed
- Project built (`npm run build`)
- `.env` file configured

---

## 📦 Installation

PM2 is already installed globally on your system. If you need to install it:

```bash
# Global installation (recommended)
npm install -g pm2

# Or local installation
npm install pm2 --save-dev
```

---

## 🔧 Configuration

### Ecosystem File

The PM2 configuration is in `ecosystem.config.js`:

- **App Name**: `trimly-api`
- **Script**: `dist/server.js` (compiled TypeScript)
- **Instances**: `max` (uses all CPU cores)
- **Mode**: `cluster` (load balancing)
- **Port**: Reads from `.env` file (default: 3036)
- **Logs**: Stored in `./logs/` directory

---

## 🎯 Quick Start

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Start PM2

**Development:**
```bash
npm run pm2:start
```

**Production:**
```bash
npm run pm2:start:prod
```

### Step 3: Verify

```bash
npm run pm2:status
```

You should see `trimly-api` running.

---

## 📋 Available PM2 Commands

### Start/Stop

```bash
# Start in development mode
npm run pm2:start

# Start in production mode
npm run pm2:start:prod

# Stop the application
npm run pm2:stop

# Restart the application
npm run pm2:restart

# Delete from PM2 (stops and removes)
npm run pm2:delete
```

### Monitoring

```bash
# View logs (real-time)
npm run pm2:logs

# Monitor resources (CPU, memory)
npm run pm2:monit

# Check status
npm run pm2:status
```

### Persistence

```bash
# Save current process list
npm run pm2:save

# Setup PM2 to start on system boot
npm run pm2:startup
# Follow the instructions shown
```

---

## 🔍 Common Operations

### View Logs

```bash
# All logs
npm run pm2:logs

# Only error logs
pm2 logs trimly-api --err

# Only output logs
pm2 logs trimly-api --out

# Last 100 lines
pm2 logs trimly-api --lines 100
```

### Restart Application

```bash
# Graceful restart (zero downtime)
npm run pm2:restart

# Hard restart
pm2 restart trimly-api --update-env
```

### Monitor Resources

```bash
# Interactive monitoring
npm run pm2:monit

# Or use
pm2 monit
```

### Check Status

```bash
npm run pm2:status

# Detailed info
pm2 describe trimly-api

# Show process info
pm2 show trimly-api
```

---

## 🔄 Production Deployment

### Step 1: Build

```bash
npm run build
```

### Step 2: Start in Production Mode

```bash
npm run pm2:start:prod
```

### Step 3: Save Process List

```bash
npm run pm2:save
```

### Step 4: Setup Auto-Start on Boot

```bash
npm run pm2:startup
```

This will generate a command like:
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-username --hp /home/your-username
```

**Copy and run that command** to enable PM2 on system boot.

---

## 📊 PM2 Features

### ✅ Automatic Restart
- App automatically restarts if it crashes
- Configurable restart limits

### ✅ Load Balancing
- Uses all CPU cores (`instances: "max"`)
- Automatic load distribution

### ✅ Log Management
- All logs stored in `./logs/` directory
- Separate error and output logs
- Timestamped logs

### ✅ Memory Management
- Auto-restart if memory exceeds 500MB
- Prevents memory leaks

### ✅ Zero Downtime Reloads
- Graceful restarts without dropping connections
- Perfect for production

---

## 🐛 Troubleshooting

### Application Not Starting

1. **Check if build exists:**
   ```bash
   ls -la dist/server.js
   ```
   If missing, run `npm run build`

2. **Check logs:**
   ```bash
   npm run pm2:logs
   ```

3. **Check status:**
   ```bash
   npm run pm2:status
   ```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3036

# Kill the process or change PORT in .env
```

### PM2 Process Not Found

```bash
# List all PM2 processes
pm2 list

# If empty, start the app
npm run pm2:start
```

### Logs Not Appearing

```bash
# Check logs directory exists
ls -la logs/

# Check permissions
chmod -R 755 logs/
```

### Memory Issues

```bash
# Check memory usage
pm2 monit

# Restart if needed
npm run pm2:restart
```

---

## 📁 File Structure

```
.
├── ecosystem.config.js    # PM2 configuration
├── logs/                  # PM2 logs directory
│   ├── pm2-error.log     # Error logs
│   ├── pm2-out.log        # Output logs
│   └── pm2-combined.log   # Combined logs
└── dist/                  # Compiled JavaScript
    └── server.js          # Main entry point
```

---

## 🔒 Security Notes

1. **Don't commit logs** - Add `logs/` to `.gitignore` ✅
2. **Environment variables** - Keep `.env` secure ✅
3. **PM2 web interface** - Disable in production if not needed
4. **Log rotation** - Configure if logs get too large

---

## 📝 Environment Variables

PM2 reads from `.env` file automatically. Make sure these are set:

```bash
PORT=3036
NODE_ENV=production
DB_HOST=...
DB_USER=...
# ... other variables
```

---

## 🎯 Best Practices

1. **Always build before starting:**
   ```bash
   npm run build && npm run pm2:start:prod
   ```

2. **Save after changes:**
   ```bash
   npm run pm2:save
   ```

3. **Monitor in production:**
   ```bash
   npm run pm2:monit
   ```

4. **Regular log checks:**
   ```bash
   npm run pm2:logs
   ```

5. **Use production mode:**
   ```bash
   npm run pm2:start:prod
   ```

---

## ✅ Quick Checklist

- [ ] Project built (`npm run build`)
- [ ] `.env` file configured
- [ ] PM2 started (`npm run pm2:start:prod`)
- [ ] Status verified (`npm run pm2:status`)
- [ ] Logs checked (`npm run pm2:logs`)
- [ ] Process saved (`npm run pm2:save`)
- [ ] Auto-start configured (`npm run pm2:startup`)

---

## 🚀 Next Steps

1. **Start the application:**
   ```bash
   npm run build
   npm run pm2:start:prod
   ```

2. **Verify it's running:**
   ```bash
   npm run pm2:status
   ```

3. **Check logs:**
   ```bash
   npm run pm2:logs
   ```

4. **Monitor resources:**
   ```bash
   npm run pm2:monit
   ```

---

**Your PM2 setup is ready!** 🎉

