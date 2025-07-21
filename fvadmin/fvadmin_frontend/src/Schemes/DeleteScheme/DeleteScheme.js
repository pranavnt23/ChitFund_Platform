import React, { useEffect, useState } from 'react';
import './DeleteScheme.css';

const DeleteScheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [schemeToDelete, setSchemeToDelete] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/schemes');
      const data = await response.json();
      setSchemes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  const promptDelete = (schemeId) => {
    setSchemeToDelete(schemeId);
    setShowLogin(true);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (adminCredentials.username === "admin" && adminCredentials.password === "password") {
      await confirmDelete();
    } else {
      alert('Invalid admin credentials');
    }
    resetLoginState();
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/schemes/${schemeToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        setMessage('Scheme deleted successfully!');
        fetchSchemes();
      } else {
        setMessage('Failed to delete scheme.');
      }
    } catch (error) {
      console.error('Error deleting scheme:', error);
      setMessage('Error deleting scheme');
    }
  };

  const resetLoginState = () => {
    setShowLogin(false);
    setSchemeToDelete(null);
    setAdminCredentials({ username: '', password: '' });
  };

  return (
    <div className="delete-schemes-container">
      <h2>Delete Schemes</h2>
      {message && <div className="delete-message">{message}</div>}
      <div className="schemes-grid">
        {schemes.length ? schemes.map((scheme) => (
          <div key={scheme._id} className="scheme-card">
            <h3>{scheme.name}</h3>
            <p>{scheme.description}</p>
            <div><b>Target Audience:</b> {scheme.target_audience}</div>
            <ul>
              <li>Monthly Contribution: ₹{scheme.investment_plan?.monthly_contribution}</li>
              <li>Chit Period: {scheme.investment_plan?.chit_period} months</li>
              <li>Total Fund Value: {scheme.investment_plan?.total_fund_value?.map(v => `₹${v.value} for ${v.duration} months`).join(', ')}</li>
            </ul>
            <button onClick={() => promptDelete(scheme._id)} className="delete-btn">Delete</button>
          </div>
        )) : <p>No schemes available</p>}
      </div>

      {showLogin && (
        <div className="login-dialog">
          <form onSubmit={handleLoginSubmit}>
            <h3>Admin Authentication</h3>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={adminCredentials.username}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={adminCredentials.password}
              onChange={handleLoginChange}
              required
            />
            <div className="button-row">
              <button type="submit">Confirm Delete</button>
              <button type="button" onClick={resetLoginState}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeleteScheme;
