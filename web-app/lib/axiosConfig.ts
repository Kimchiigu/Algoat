// lib/axiosConfig.ts
import axios from 'axios';

axios.defaults.baseURL = 'https://algoatapi3-production.up.railway.app/'; // Replace with your FastAPI server URL
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
