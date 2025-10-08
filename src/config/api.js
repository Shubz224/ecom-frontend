const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-url.railway.app/api' // Replace with your Railway URL
  : 'http://localhost:5000/api';

export { API_BASE_URL };
