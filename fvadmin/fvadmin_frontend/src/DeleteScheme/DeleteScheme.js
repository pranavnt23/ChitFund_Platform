import React, { useEffect, useState } from 'react';
import './DeleteScheme.css';

const DeleteScheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [schemeToDelete, setSchemeToDelete] = useState(null);

  const fetchSchemes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/schemes');
      const data = await response.json();
      console.log('Fetched schemes:', data);
      setSchemes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleDelete = (id) => {
    setSchemeToDelete(id);
    setShowLogin(true);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const correctUsername = "admin";
    const correctPassword = "password";

    if (
      adminCredentials.username === correctUsername &&
      adminCredentials.password === correctPassword
    ) {
      try {
        const response = await fetch(`http://localhost:5000/api/schemes/${schemeToDelete}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Scheme deleted successfully');
          fetchSchemes(); // Refresh the schemes list
        } else {
          alert('Failed to delete scheme');
        }
        resetLoginState();
      } catch (error) {
        console.error('Error deleting scheme:', error);
        alert('Error deleting scheme');
        resetLoginState();
      }
    } else {
      alert('Invalid admin credentials');
    }
  };

  const resetLoginState = () => {
    setShowLogin(false);
    setSchemeToDelete(null);
    setAdminCredentials({ username: '', password: '' });
  };

  return (
    <div className="schemes-container">
      {schemes.length > 0 ? (
        schemes.map((scheme) => (
          <div key={scheme._id} className="scheme-card">
            <h3>{scheme.name}</h3>
            <p>{scheme.description}</p>
            <h4>Target Audience: {scheme.target_audience}</h4>
            <h4>Investment Plan:</h4>
            <ul>
              <li>Monthly Contribution: ₹{scheme.investment_plan?.monthly_contribution}</li>
              <li>Chit Period: {scheme.investment_plan?.chit_period} months</li>
              <li>
                Total Fund Value:{" "}
                {scheme.investment_plan?.total_fund_value
                  ?.map((v) => `₹${v.value} for ${v.duration} months`)
                  .join(', ')}
              </li>
            </ul>
            <h4>Benefits:</h4>
            <ul>
              {scheme.benefits?.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
            <button onClick={() => handleDelete(scheme._id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No schemes available</p>
      )}

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
              <button type="button" onClick={resetLoginState}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeleteScheme;
