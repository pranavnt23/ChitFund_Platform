import React, { useState } from 'react';
import './RegisterScheme.css';

const RegisterDialog = ({ onClose }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    username: '',
    password: '',
    aadharNumber: '',
    panNumber: '',
    document: null // For file attachment
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      document: e.target.files[0] // Get the selected file
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration data:', formData);
    onClose();
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 className="dialog-title">FILL OUT TO REGISTER</h2>
          <button className="close-x" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter your account number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ifscCode">IFSC Code</label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder="Enter IFSC code"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="bankName">Bank Account Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Enter your bank account name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="aadharNumber">Aadhar Number</label>
            <input
              type="text"
              id="aadharNumber"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              placeholder="Enter your Aadhar number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="panNumber">PAN Number</label>
            <input
              type="text"
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="Enter your PAN number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="document">Attach Your Ration Card</label>
            <input
              type="file"
              id="document"
              name="document"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">REGISTER NOW</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDialog;
