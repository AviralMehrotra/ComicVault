import cron from 'node-cron';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'https://comicvault-backend-g86t.onrender.com';

// Self-ping every 14 minutes to prevent Render sleep
cron.schedule('*/14 * * * *', async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log(`Health check: ${response.status} - ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`Health check failed: ${error.message} - ${new Date().toISOString()}`);
  }
});

console.log('Health check cron job started - pinging every 14 minutes');