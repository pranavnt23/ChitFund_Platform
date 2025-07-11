import React, { useState } from 'react';
import './ContactComponent.css';

const ContactComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your form submission logic here
  };

  return (
    <div className="contact-container">
      <div className="contact-form">
        <h2>CONTACT US</h2>
        <div className="form-scroll-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
      <div className="contact-image">
        <img src={require('./imgg1.webp')} alt="Contact Us" />
      </div>
    </div>
  );
};

export default ContactComponent;