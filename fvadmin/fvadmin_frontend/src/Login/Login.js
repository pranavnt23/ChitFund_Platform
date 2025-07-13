import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password }); // Debug log

    // Check if fields are empty
    if (!username || !password) {
      setError('Both fields are required');
      return;
    }

    // Check credentials with your specified username and password
    if (username === 'Mohanapriya' && password === 'priya@aviation') {
      console.log('Login successful'); // Debug log
      onLogin(username); // Call the onLogin prop function
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Admin Login</h1>
        <p>Enter your credentials to access the dashboard</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(''); // Clear error when typing
              }}
              className="login-input"
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(''); // Clear error when typing
              }}
              className="login-input"
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
