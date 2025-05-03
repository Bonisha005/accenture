import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // or .tsx
import './index.css'; // Tailwind or your base styles
import './App.css';
import { UserProvider } from './context/UserContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
    <App />
    </UserProvider>
  </React.StrictMode>
);