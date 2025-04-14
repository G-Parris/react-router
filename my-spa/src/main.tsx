import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import React from 'react';


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/react-router">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
