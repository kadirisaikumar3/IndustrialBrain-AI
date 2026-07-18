import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <BrowserRouter>

      <ThemeProvider>

        <App />

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>
);