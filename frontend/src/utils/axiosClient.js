// // src/utils/axiosClient.js
// import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: "https://codeclan-backend.onrender.com" || "http://localhost:3000",
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' },
// });

// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error) // just reject the original error
// );

// export default axiosClient;


import axios from "axios";

console.log("ENV URL CHECK:", import.meta.env.VITE_BACKEND_URL);

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
