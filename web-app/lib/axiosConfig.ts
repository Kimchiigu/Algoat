// lib/axiosConfig.ts
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000'; // Replace with your FastAPI server URL
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
