import React, { useEffect, useState } from 'react';
import './DeleteSubAdmin.css';

const DeleteSubAdmin = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [selectedSubAdminId, setSelectedSubAdminId] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

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

  const handleDelete = async () => {
    if (adminUsername !== 'admin' || adminPassword !== 'password') {
      setAuthError('Invalid admin credentials!');
      return;
    }
    if (!selectedSubAdminId) {
      setAuthError('Please select a SubAdmin to delete.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/subadmins/${selectedSubAdminId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteMessage('SubAdmin deleted successfully!');
        fetchSubAdmins(); // Refresh list
        setSelectedSubAdminId('');
        setAuthError('');
      } else {
        setAuthError('Failed to delete SubAdmin.');
      }
    } catch (error) {
      console.error('Error deleting subadmin:', error);
      setAuthError('Error during deletion.');
    }
  };

  return (
    <div className="delete-subadmin-container">
      <h3>Delete SubAdmin</h3>

      <label>Select SubAdmin to Delete:</label>
      <select value={selectedSubAdminId} onChange={(e) => setSelectedSubAdminId(e.target.value)}>
        <option value="">-- Select --</option>
        {subAdmins.map(admin => (
          <option key={admin._id} value={admin._id}>
            {admin.username}
          </option>
        ))}
      </select>

      <div className="admin-auth-section">
        <h4>Admin Credentials Required</h4>
        <input
          type="text"
          placeholder="Admin Username"
          value={adminUsername}
          onChange={(e) => setAdminUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        <button onClick={handleDelete}>Delete SubAdmin</button>
      </div>

      {authError && <p className="error-message">{authError}</p>}
      {deleteMessage && <p className="success-message">{deleteMessage}</p>}
    </div>
  );
};

export default DeleteSubAdmin;
