// lib/axiosConfig.ts
import axios from 'axios';

axios.defaults.baseURL = 'https://d3fe-180-252-170-201.ngrok-free.app/'; // Replace with your FastAPI server URL
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
