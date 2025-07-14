import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginComponent.css';
import axios from 'axios';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Single state for messages
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setMessage(response.data.message); // Set success message
      console.log('Successful login, navigating to schemes...');

      // Redirect to LoginSchemeComponent and pass username
      setTimeout(() => {
        navigate(`/api/schemes/${username}`); // Navigate to LoginSchemeComponent with the username
      }, 500); // Adjust delay as necessary
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message); // Display error message from server
      } else {
        setMessage('Server error, please try again later');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-content">
          <h2>LOGIN</h2>
          {message && <p className="message">{message}</p>} {/* Display success or error message */}
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
              Don't have an account? <Link to="/register" className="create-link">Create your account</Link>
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
