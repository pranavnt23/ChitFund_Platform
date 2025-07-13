import React, { useEffect, useState } from 'react';
import './DeleteScheme.css'; // Ensure this path is correct

const DeleteScheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [schemeToDelete, setSchemeToDelete] = useState(null);

  useEffect(() => {
    // Fetch all schemes from the server
    const fetchSchemes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/schemes');
        const data = await response.json();
        setSchemes(data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      }
    };

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
    const correctUsername = "Mohanapriya";
    const correctPassword = "priya@aviation";
    if (
      adminCredentials.username === correctUsername &&
      adminCredentials.password === correctPassword
    ) {
      // Proceed to delete
      try {
        await fetch(`http://localhost:5000/api/schemes/${schemeToDelete}`, {
          method: 'DELETE',
        });
        setSchemes(schemes.filter((scheme) => scheme._id !== schemeToDelete));
        setShowLogin(false);
        setSchemeToDelete(null);
        setAdminCredentials({ username: '', password: '' });
      } catch (error) {
        alert('Error deleting scheme');
      }
    } else {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="schemes-container">
      {schemes.map((scheme) => (
        <div key={scheme._id} className="scheme-card">
          <h3>{scheme.name}</h3>
          <p>{scheme.description}</p>
          <h4>Target Audience: {scheme.target_audience}</h4>
          <h4>Investment Plan:</h4>
          <ul>
            <li>Monthly Contribution: ₹{scheme.investment_plan.monthly_contribution}</li>
            <li>Chit Period: {scheme.investment_plan.chit_period} months</li>
            <li>Total Fund Value: {scheme.investment_plan.total_fund_value.map(v => `₹${v.value} for ${v.duration} months`).join(', ')}</li>
          </ul>
          <h4>Benefits:</h4>
          <ul>
            {scheme.benefits.map((benefit, i) => (
              <li key={i}>{benefit}</li>
            ))}
          </ul>
          <button
            onClick={() => {
              setSchemeToDelete(scheme._id);
              setShowLogin(true);
            }}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      ))}
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
              <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeleteScheme;
