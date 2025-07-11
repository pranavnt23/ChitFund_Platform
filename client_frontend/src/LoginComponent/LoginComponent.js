import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginComponent.css';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-content">
          <h2>LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="create-account-section">
              Don't have an account? <Link className="create-link">Create your account</Link>
            </div>

            <button type="submit" className="login-button">
              LOGIN
            </button>
          </form>
        </div>
        
        <div className="welcome-back">
          <div className="welcome-content">
            <h2>WELCOME<br/>BACK!!</h2>
            <p>Reconnect with your investment journey!! Log in to view your chit fund progress.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;