import React, { useState } from 'react';
import Login from './Login/Login'; // Your Login Component
import Dashboard from './DashBoard/DashBoard';
import './App.css'; // App-level styling

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (loginUsername) => {
    setIsLoggedIn(true);
    setUsername(loginUsername);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} /> // Show login page if not logged in
      ) : (
        <Dashboard username={username} onLogout={handleLogout} /> // Show dashboard if logged in
      )}
    </div>
  );
};

export default App;
