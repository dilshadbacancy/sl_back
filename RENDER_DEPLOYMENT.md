# 🚀 Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Quick Setup Steps

### 1. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository: `shubhamsoni-prog/sl_back`
5. Select branch: `release-postrgres` (or your main branch)

### 2. Configure Build Settings

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment:**
- Select: `Node`

### 3. Set Environment Variables

Add these environment variables in Render dashboard:

#### Database Configuration
```
DB_HOST=<your-postgres-host>
DB_USER=<your-postgres-user>
DB_PASSWORD=<your-postgres-password>
DB_NAME=trimly_app
DB_PORT=5432
```

#### Server Configuration
```
PORT=10000
NODE_ENV=production
```

#### JWT Configuration
```
JWT_SECRET=<your-jwt-secret-key>
JWT_REFRESH_TOKEN=<your-refresh-token-secret>
```

#### Logging
```
LOG_LEVEL=info
```

### 4. Create PostgreSQL Database (Optional)

If you want Render to create the database:

1. Go to **"New +"** → **"PostgreSQL"**
2. Name: `trimly-db`
3. Database: `trimly_app`
4. User: `trimly_app_root`
5. Copy the connection details to your web service environment variables

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Run build command
   - Start your application

### 6. Verify Deployment

Once deployed, you'll get a URL like: `https://trimly-api.onrender.com`

Test the health endpoint:
```bash
curl https://trimly-api.onrender.com/api
```

Expected response:
```json
{"message":"Server Running"}
```

---

## Troubleshooting

### Build Fails with TypeScript Errors

✅ **Fixed!** The following changes were made:
- Updated `tsconfig.json` to remove explicit `types` array
- Moved `typescript` and `@types/node` to `dependencies`
- Fixed `typeRoots` configuration

### Database Connection Issues

1. **Check environment variables** are set correctly in Render dashboard
2. **Verify database is running** (if using Render PostgreSQL)
3. **Check database credentials** match your `.env` file

### Port Issues

- Render automatically sets `PORT` environment variable
- Your app should use `process.env.PORT` (which it does)
- Default Render port is `10000`

### Application Crashes

1. **Check logs** in Render dashboard
2. **Verify all environment variables** are set
3. **Check database connection** is working
4. **Review build logs** for any warnings

---

## Environment Variables Checklist

Make sure all these are set in Render:

- [ ] `DB_HOST`
- [ ] `DB_USER`
- [ ] `DB_PASSWORD`
- [ ] `DB_NAME`
- [ ] `DB_PORT`
- [ ] `PORT` (usually `10000` on Render)
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET`
- [ ] `JWT_REFRESH_TOKEN`
- [ ] `LOG_LEVEL`

---

## Post-Deployment

### Update Postman Collection

After deployment, update your Postman environment:

1. Change `base_url` from `http://localhost:3036` to your Render URL
2. Example: `https://trimly-api.onrender.com`

### Monitor Your Application

- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory, and response times
- **Alerts**: Set up alerts for downtime

---

## Cost Considerations

- **Free Tier**: 
  - Web services spin down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds
  - PostgreSQL database included (limited storage)

- **Starter Plan** ($7/month):
  - Always-on service
  - Better performance
  - More resources

---

## Next Steps

1. ✅ Code is ready for deployment
2. ✅ Build configuration fixed
3. ⏭️ Create Render account and deploy
4. ⏭️ Set environment variables
5. ⏭️ Test deployed API
6. ⏭️ Update Postman collection with production URL

---

## Support

If you encounter issues:
1. Check Render build logs
2. Check application logs
3. Verify all environment variables
4. Test database connection separately

