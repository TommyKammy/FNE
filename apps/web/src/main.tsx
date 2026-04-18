import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root");

if (container === null) {
  throw new Error("Expected #root container to exist.");
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
