import React, { useState } from 'react';
import './AddSubAdmin.css';

const AddSubAdmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fname: '',
    lname: '',
    email: '',
    phone_number: '',
    valid_till: '',
    status: 'active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/subadmins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('SubAdmin added successfully!');
        setFormData({
          username: '',
          password: '',
          fname: '',
          lname: '',
          email: '',
          phone_number: '',
          valid_till: '',
          status: 'active',
        });
      } else {
        alert('Failed to add SubAdmin.');
      }
    } catch (err) {
      console.error('Error adding SubAdmin:', err);
      alert('Server error while adding SubAdmin.');
    }
  };

  return (
    <div className="add-subgroup-container">
      <h3>Add a New SubAdmin</h3>
      <form onSubmit={handleSubmit} className="add-subadmin-form">
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        <input type="text" name="fname" placeholder="First Name" value={formData.fname} onChange={handleChange} />

        <input type="text" name="lname" placeholder="Last Name" value={formData.lname} onChange={handleChange} />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

        <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />

        <label>Valid Till</label>
        <input type="date" name="valid_till" value={formData.valid_till} onChange={handleChange} />

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit">Add SubAdmin</button>
      </form>
    </div>
  );
};

export default AddSubAdmin;
