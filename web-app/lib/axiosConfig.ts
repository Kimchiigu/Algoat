// lib/axiosConfig.ts
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/'; // Replace with your FastAPI server URL
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
