import React, { useState } from 'react';
import './AddScheme.css'; // Link to the CSS file if needed

const AddScheme = () => {
  const [schemeDetails, setSchemeDetails] = useState({
    schemeName: '',
    description: '',
    targetAudience: '',
    monthlyContribution: '',
    chitPeriod: '',
    totalSlots: '',
    startDate: '',
    startTime: '',
    totalFundAmount: '' 
  });

  const [showLogin, setShowLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchemeDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLogin(true); 
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
        // Prepare the payload
        const payload = {
          name: schemeDetails.schemeName,
          description: schemeDetails.description,
          target_audience: schemeDetails.targetAudience,
          investment_plan: {
            monthly_contribution: Number(schemeDetails.monthlyContribution),
            chit_period: Number(schemeDetails.chitPeriod),
            total_fund_value: [{
              duration: Number(schemeDetails.chitPeriod),
              value: Number(schemeDetails.totalFundAmount)
            }]
          },
          number_of_slots: Number(schemeDetails.totalSlots),
          start_date: schemeDetails.startDate,
          start_time: schemeDetails.startTime
        };

        // API call to add the scheme
        const response = await fetch('http://localhost:5000/api/schemes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert('Scheme added successfully!');
          setSchemeDetails({
            schemeName: '',
            description: '',
            targetAudience: '',
            monthlyContribution: '',
            chitPeriod: '',
            totalSlots: '',
            startDate: '',
            startTime: '',
            totalFundAmount: ''
          });
          setShowLogin(false);
          setAdminCredentials({ username: '', password: '' });
        } else {
          const errorData = await response.json();
          alert(`Failed to add scheme: ${errorData.error}`);
        }
      } catch (err) {
        console.error('Error adding scheme:', err);
        alert('An error occurred while adding the scheme');
      }
    } else {
      alert('Invalid username or password!');
    }
};


  return (
    <div className="add-scheme-container">
      <h2>Fill the Form to Add Schemes</h2>
      <p className="warning-message">
        <strong>Warning:</strong> Please fill in all details carefully. Once added, the scheme cannot be edited.
      </p>
      <form onSubmit={handleSubmit} className="add-scheme-form">
        <label htmlFor="schemeName">Scheme Name:</label>
        <input
          type="text"
          id="schemeName"
          name="schemeName"
          value={schemeDetails.schemeName}
          onChange={handleChange}
          placeholder="Enter scheme name"
          required 
        />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={schemeDetails.description}
          onChange={handleChange}
          placeholder="Description of the scheme"
        />
        <label htmlFor="targetAudience">Target Audience:</label>
        <input
          type="text"
          id="targetAudience"
          name="targetAudience"
          value={schemeDetails.targetAudience}
          onChange={handleChange}
          placeholder="Individuals seeking stable, long-term savings in gold"
        />
        <label htmlFor="monthlyContribution">Monthly Contribution (₹):</label>
        <input
          type="number"
          id="monthlyContribution"
          name="monthlyContribution"
          value={schemeDetails.monthlyContribution}
          onChange={handleChange}
          placeholder="Enter monthly contribution"
        />
        <label htmlFor="chitPeriod">Chit Period (months):</label>
        <input
          type="number"
          id="chitPeriod"
          name="chitPeriod"
          value={schemeDetails.chitPeriod}
          onChange={handleChange}
          placeholder="Enter chit period in months"
        />
        <label htmlFor="totalSlots">Total Slots:</label>
        <input
          type="number"
          id="totalSlots"
          name="totalSlots"
          value={schemeDetails.totalSlots}
          onChange={handleChange}
          placeholder="Enter total number of slots"
        />
        <label htmlFor="totalFundAmount">Total Fund Amount (₹):</label>
        <input
          type="number"
          id="totalFundAmount"
          name="totalFundAmount"
          value={schemeDetails.totalFundAmount}
          onChange={handleChange}
          placeholder="Enter total fund amount"
        />
        <label htmlFor="startDate">Starting Date of Bidding:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={schemeDetails.startDate}
          onChange={handleChange}
        />
        <label htmlFor="startTime">Starting Time of Bidding:</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={schemeDetails.startTime}
          onChange={handleChange}
        />
        <button type="submit">Add Scheme</button>
      </form>

      {showLogin && (
        <div className="login-dialog-overlay">
          <div className="login-dialog">
            <h3>Admin Login</h3>
            <form onSubmit={handleLoginSubmit}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={adminCredentials.username}
                onChange={handleAdminChange}
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={adminCredentials.password}
                onChange={handleAdminChange}
                required
              />
              <button type="submit">Login to Add Scheme</button>
            </form>
            <button onClick={() => setShowLogin(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddScheme;
