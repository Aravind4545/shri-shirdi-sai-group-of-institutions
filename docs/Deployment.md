# Deployment & DevOps Guide

## Server Requirements (Production)
- **OS**: Ubuntu 22.04 LTS
- **RAM**: 4GB Minimum (for MongoDB and Node overhead)
- **Node.js**: v18.x
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx

## Deployment Steps

1. **Build the Frontend**
   Navigate to the frontend folder and run the Vite build process.
   ```bash
   cd frontend
   npm run build
   ```
   *Note: Rollup is configured to split code into vendor and ui chunks to prevent massive JS payloads.*

2. **Serve with Nginx**
   Configure an Nginx block to serve the `frontend/dist` directory on Port 80/443.

3. **Backend Deployment (PM2)**
   Navigate to the backend and start the application using PM2 to ensure it restarts on crashes.
   ```bash
   cd backend
   npm install --production
   pm2 start server.js --name "sssi-api"
   pm2 save
   ```

## CI/CD Pipeline
The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`).
Every push to `main` triggers:
- Dependency installation
- Vite production build verification
- *Optional*: SSH deployment to DigitalOcean/AWS.

## Security & Backups
- **MongoDB**: Use MongoDB Atlas for automated nightly snapshots.
- **Rate Limiting**: Configured to 100 requests per 15 minutes per IP.
- **Logging**: Winston stores API error logs locally under `backend/logs/error.log`.
