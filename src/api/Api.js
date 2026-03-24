// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api"  // all requests will automatically prepend /api
// });

// export default api;

import axios from 'axios'
import React from 'react'

const api = axios.create({
    baseURL: "https://separate-backend.vercel.app/api/v1"
});
  


export default api