import React, { useState } from 'react';
import './AddScheme.css';

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
    setSchemeDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLogin(true);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const correctUsername = "admin";
    const correctPassword = "password";

    if (adminCredentials.username === correctUsername && adminCredentials.password === correctPassword) {
      try {
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

        const response = await fetch('http://localhost:5000/api/schemes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          setAdminCredentials({ username: '', password: '' });
          setShowLogin(false);
        } else {
          const errData = await response.json();
          alert(`Failed to add scheme: ${errData.error}`);
        }
      } catch (err) {
        console.error('Error:', err);
        alert('An error occurred while adding the scheme');
      }
    } else {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="add-scheme-container">
      <h2>Add New Scheme</h2>
      <form onSubmit={handleSubmit} className="add-scheme-form">
        <input name="schemeName" placeholder="Scheme Name" value={schemeDetails.schemeName} onChange={handleChange} required />
        <textarea name="description" placeholder="Scheme Description" value={schemeDetails.description} onChange={handleChange} />
        <input name="targetAudience" placeholder="Target Audience" value={schemeDetails.targetAudience} onChange={handleChange} />
        <input type="number" name="monthlyContribution" placeholder="Monthly Contribution (₹)" value={schemeDetails.monthlyContribution} onChange={handleChange} />
        <input type="number" name="chitPeriod" placeholder="Chit Period (months)" value={schemeDetails.chitPeriod} onChange={handleChange} />
        <input type="number" name="totalSlots" placeholder="Total Slots" value={schemeDetails.totalSlots} onChange={handleChange} />
        <input type="number" name="totalFundAmount" placeholder="Total Fund Amount (₹)" value={schemeDetails.totalFundAmount} onChange={handleChange} />
        <input type="date" name="startDate" value={schemeDetails.startDate} onChange={handleChange} />
        <input type="time" name="startTime" value={schemeDetails.startTime} onChange={handleChange} />

        <button type="submit">Proceed to Admin Verification</button>
      </form>

      {showLogin && (
        <div className="login-dialog-overlay">
          <div className="login-dialog">
            <h3>Admin Verification</h3>
            <form onSubmit={handleLoginSubmit}>
              <input type="text" name="username" placeholder="Admin Username" value={adminCredentials.username} onChange={handleAdminChange} required />
              <input type="password" name="password" placeholder="Admin Password" value={adminCredentials.password} onChange={handleAdminChange} required />
              <button type="submit">Confirm & Add Scheme</button>
            </form>
            <button className="cancel-btn" onClick={() => setShowLogin(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddScheme;
