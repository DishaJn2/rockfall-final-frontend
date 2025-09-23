// src/index.js  (replace entire file)
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <- add this
import App from "./App";
import { SelectionProvider } from "./contexts/SelectionContext";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SelectionProvider>
        <App />
      </SelectionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
