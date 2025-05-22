import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ExerciseProvider } from "./context/ExerciseContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ExerciseProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ExerciseProvider>
  </React.StrictMode>
);
