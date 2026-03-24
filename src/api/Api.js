// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api"  // all requests will automatically prepend /api
// });

// export default api;

import axios from 'axios'
import React from 'react'
import { data } from 'react-router-dom';

const api = axios.create({
    baseURL: "https://separate-backend.vercel.app/api/v1"
});
  


export const requestOTP = (data) => api.post('/request-otp', data);