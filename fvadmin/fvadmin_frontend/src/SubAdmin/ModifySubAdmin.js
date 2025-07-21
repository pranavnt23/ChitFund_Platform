import React, { useEffect, useState } from 'react';
import './ModifySubAdmin.css';

const ModifySubAdmin = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone_number: '',
    valid_till: '',
    status: 'active',
  });

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subadmins');
      const data = await response.json();
      setSubAdmins(data);
    } catch (error) {
      console.error('Error fetching subadmins:', error);
    }
  };

  const handleSelectChange = (e) => {
    const subAdminId = e.target.value;
    const selected = subAdmins.find(admin => admin._id === subAdminId);
    setSelectedSubAdmin(selected);
    setFormData({
      fname: selected.fname || '',
      lname: selected.lname || '',
      email: selected.email || '',
      phone_number: selected.phone_number || '',
      valid_till: selected.valid_till ? selected.valid_till.substring(0, 10) : '',
      status: selected.status || 'active',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedSubAdmin) return;

    try {
      const response = await fetch(`http://localhost:5000/api/subadmins/${selectedSubAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('SubAdmin updated successfully');
        fetchSubAdmins(); 
      } else {
        alert('Failed to update SubAdmin');
      }
    } catch (error) {
      console.error('Error updating SubAdmin:', error);
    }
  };

  return (
    <div className="modify-subadmin-container">
      <h3>Modify SubAdmin</h3>

      <div className="modify-form-section">
        <label>Select SubAdmin:</label>
        <select onChange={handleSelectChange} value={selectedSubAdmin?._id || ''}>
          <option value="">-- Select --</option>
          {subAdmins.map(admin => (
            <option key={admin._id} value={admin._id}>
              {admin.username}
            </option>
          ))}
        </select>

        {selectedSubAdmin && (
          <div className="form-fields">
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <label>Valid Till:</label>
            <input
              type="date"
              name="valid_till"
              value={formData.valid_till}
              onChange={handleInputChange}
            />
            <label>Status:</label>
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button onClick={handleUpdate}>Update SubAdmin</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModifySubAdmin;
