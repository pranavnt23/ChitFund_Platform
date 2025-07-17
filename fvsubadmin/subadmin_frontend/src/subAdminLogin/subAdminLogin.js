import React, { useState } from 'react';
import axios from 'axios';
import '../subAdminLogin/subAdminLogin.css';  

const SubAdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/subadmin/login', credentials);
      setMessage(`Login Successful: Welcome ${res.data.username}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="subadmin-login-container">
      <h2>FundVerse SubAdmin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SubAdminLogin;
