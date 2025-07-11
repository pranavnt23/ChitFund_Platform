import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import backgroundImage from './img10.png'; // Use a relative path to your background image
import './RegisterComponent.css';

function RegisterComponent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    dob: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadharNumber: '',
    panNumber: '',
    document: null,
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
  };

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
          <h2>REGISTRATION</h2>

          {/* Use Link instead of a for login */}
          <p className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
            
          </p>
          <br></br>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>User Name</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
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

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
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
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                {/* Use Link for Terms and Privacy Policy */}
                <span>I agree to all the <Link to="/terms">Terms</Link> and <Link to="/privacy-policy">Privacy Policy</Link></span>
              </label>
            </div>

            <button type="submit" className="submit-button">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterComponent;
