import React, { useEffect, useState } from 'react';
import './ViewSubAdmin.css';

const ViewSubAdmin = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [usernameFilter, setUsernameFilter] = useState('');
  const [filteredSubAdmins, setFilteredSubAdmins] = useState([]);
  const [showGroups, setShowGroups] = useState({});

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subadmins/');
      const data = await response.json();
      setSubAdmins(data);
      setFilteredSubAdmins(data);
    } catch (error) {
      console.error('Failed to fetch subadmins:', error);
    }
  };

  const handleFilterChange = (e) => {
    const username = e.target.value;
    setUsernameFilter(username);
    const filtered = subAdmins.filter(sub => sub.username.includes(username));
    setFilteredSubAdmins(filtered);
  };

  const toggleShowGroups = (id) => {
    setShowGroups((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="view-subgroup-container">
      <h3>All SubAdmins</h3>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by username"
          value={usernameFilter}
          onChange={handleFilterChange}
        />
      </div>

      <div className="subgroup-list">
        {filteredSubAdmins.length > 0 ? (
          filteredSubAdmins.map((sub, index) => (
            <div key={index} className="subgroup-card">
              <h4>{sub.fname} {sub.lname}</h4>
              <p><strong>Username:</strong> {sub.username}</p>
              <p><strong>Email:</strong> {sub.email}</p>
              <p><strong>Phone Number:</strong> {sub.phone_number}</p>
              <p><strong>Status:</strong> {sub.status}</p>
              <p><strong>Valid Till:</strong> {new Date(sub.valid_till).toLocaleDateString()}</p>
              <button 
                className="toggle-btn"
                onClick={() => toggleShowGroups(sub._id)}
              >
                {showGroups[sub._id] ? 'Hide Group IDs' : 'Show Group IDs'}
              </button>

              {showGroups[sub._id] && (
                <ul className="group-ids-list">
                  {sub.group_ids && sub.group_ids.length > 0 ? (
                    sub.group_ids.map((groupId, i) => (
                      <li key={i}>{groupId}</li>
                    ))
                  ) : (
                    <li>No Groups Assigned</li>
                  )}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p>No subadmins found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewSubAdmin;
