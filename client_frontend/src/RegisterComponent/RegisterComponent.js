import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link for routing
import backgroundImage from './img10.png'; // Ensure correct path for the image
import './RegisterComponent.css';

function RegisterComponent() {
  const [formData, setFormData] = useState({
    fname: '',              // Changed to fname
    lname: '',              // Changed to lname
    username: '',           // Changed to username
    dob: '',
    phone_number: '',       // Changed to phone_number
    email: '',
    password: '',
    confirm_password: '',    // Changed to confirm_password
    aadharno: '',          // Changed to aadharno
    panno: '',             // Changed to panno
    asset_doc: null,       // Changed to asset_doc
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match!";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:5000/api/users/register', { // Update with correct API endpoint
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Registration successful!');
        setFormData({
          fname: '',
          lname: '',
          username: '',
          dob: '',
          phone_number: '',
          email: '',
          password: '',
          confirm_password: '',
          aadharno: '',
          panno: '',
          asset_doc: null,
          agreeToTerms: false
        });
      } else {
        setMessage(result.error || 'Registration failed!');
      }
    } catch (error) {
      setMessage('Error occurred during registration');
      console.error('Error:', error);
    }
  };

  // Left section background styling
  const leftSectionStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="register-page">
      {/* Left section */}
      <div className="left-section" style={leftSectionStyle}>
        <div className="content">
          <h1>JOIN THE FUTURE<br />OF SMART SAVING<br />AND INVESTMENT!!</h1> 
          <div className="graphic">
            <div className="graphic-overlay cyan"></div>
            <div className="graphic-overlay pink"></div>
            <div className="graphic-content">
              <div className="grid-container">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="grid-item"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="right-section">
        <div className="form-container">
          <h2>REGISTER HERE</h2>
          <p className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          <br />
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            {/* User Name and Date of Birth fields */}
            <div className="form-row">
              <div className="form-group">
                <label>User Name</label>
                <input
                  type="text"
                  name="username" // Changed to username
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* First and Last Name fields */}
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="fname" // Changed to fname
                  value={formData.fname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lname" // Changed to lname
                  value={formData.lname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone Number and Email fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number" // Changed to phone_number
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Aadhar Number and PAN Number fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Aadhar Number</label>
                <input
                  type="text"
                  name="aadharno" // Changed to aadharno
                  value={formData.aadharno}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="panno" // Changed to panno
                  value={formData.panno}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password and Confirm Password fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password" // Changed to confirm_password
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
                {errors.confirm_password && <p className="error-message">{errors.confirm_password}</p>}
              </div>
            </div>

            {/* Document Attachment */}
            <div className="form-row">
              <div className="form-group">
                <label>Attach Document</label>
                <input
                  type="file"
                  name="asset_doc" // Changed to asset_doc
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <span>I agree to all the <a href="#">Terms</a> and <a href="#">Privacy Policy</a></span>
              </label>
              {errors.agreeToTerms && <p className="error-message">{errors.agreeToTerms}</p>}
            </div>

            {/* Submit button */}
            <button type="submit" className="submit-button">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterComponent;
