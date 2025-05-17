import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ExerciseProvider } from "./context/ExerciseContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ExerciseProvider>
      <App />
    </ExerciseProvider>
  </React.StrictMode>
);
