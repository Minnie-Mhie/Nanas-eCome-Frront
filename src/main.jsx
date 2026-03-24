import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "./App.css"
import appSlice from "./redux/appSlice.js"
import axios from "axios";
import axiosInstance from "./api/Axios.js";

axios.get("${import.meta.env.VITE_API_URL}/api/v1/products").catch(() => {})

  // axiosInstance.get("/v1/products").catch(() => {})

  // fetch("/api/hello").catch(() => {})

  //axios.post("/api/v1/request-otp", data)

const store = configureStore({
  reducer: appSlice,
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);