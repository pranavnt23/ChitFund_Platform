import React, { useEffect, useState } from 'react';
import './ViewSubGroup.css';

const ViewSubGroup = () => {
  const [subGroups, setSubGroups] = useState([]);
  const [usernameFilter, setUsernameFilter] = useState('');
  const [filteredSubGroups, setFilteredSubGroups] = useState([]);

  useEffect(() => {
    fetchSubGroups();
  }, []);

  const fetchSubGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subgroups');
      const data = await response.json();
      setSubGroups(data);
      setFilteredSubGroups(data);
    } catch (error) {
      console.error('Failed to fetch subgroups:', error);
    }
  };

  const handleFilterChange = (e) => {
    const username = e.target.value;
    setUsernameFilter(username);
    const filtered = subGroups.filter(sub => sub.username.includes(username));
    setFilteredSubGroups(filtered);
  };

  return (
    <div className="view-subgroup-container">
      <h3>All SubGroups</h3>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by username"
          value={usernameFilter}
          onChange={handleFilterChange}
        />
      </div>

      <div className="subgroup-list">
        {filteredSubGroups.length > 0 ? (
          filteredSubGroups.map((sub, index) => (
            <div key={index} className="subgroup-card">
              <h4>SubGroup Name: {sub.name}</h4>
              <p>Username: {sub.username}</p>
              <p>Description: {sub.description}</p>
            </div>
          ))
        ) : (
          <p>No subgroups found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewSubGroup;
