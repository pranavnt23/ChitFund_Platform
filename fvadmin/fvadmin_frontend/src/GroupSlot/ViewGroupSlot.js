import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewGroupSlot.css';

const ViewGroupSlot = () => {
  const [groupSlots, setGroupSlots] = useState([]);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGroupSlots();
  }, []);

  const fetchGroupSlots = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/groupslot/all');
      setGroupSlots(res.data);
    } catch (err) {
      console.error('Error fetching GroupSlot data:', err);
      setError('Failed to fetch GroupSlot data.');
    }
  };

  // Toggle "Read More"
  const toggleExpand = (groupId) => {
    setExpanded((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Case-insensitive search
  const filteredGroups = groupSlots.filter((group) =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="groupslot-container">
      <h2 className="groupslot-header">📌 View Group Slots</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search Box */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="🔍 Search by Group Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            width: '250px',
          }}
        />
      </div>

      <div className="groupslot-section">
        {filteredGroups.length === 0 ? (
          <p>No Group Slots available.</p>
        ) : (
          filteredGroups.map((group, gIdx) => (
            <div
              key={gIdx}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                background: '#f9f9f9',
              }}
            >
              {/* Compact Summary */}
              <h4>🟢 Group ID: {group.group_id}</h4>
              <p><strong>Group Name:</strong> {group.group_name}</p>
              <p><strong>Group Password:</strong> {group.group_password}</p>
              <p><strong>SubAdmin:</strong> {group.subadmin_name || "N/A"}</p>
              <p><strong>Total ChitSlots:</strong> {group.total_chitslots}</p>

              {/* Read More Button */}
              <button
                onClick={() => toggleExpand(group.group_id)}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: expanded[group.group_id] ? '#ff5252' : '#4caf50',
                  color: '#fff',
                }}
              >
                {expanded[group.group_id] ? 'Read Less ▲' : 'Read More ▼'}
              </button>

              {/* Expanded Details */}
              {expanded[group.group_id] && (
                <div style={{ marginTop: '15px' }}>
                  <h5>📂 Subgroups:</h5>
                  {group.subgroups && group.subgroups.length > 0 ? (
                    group.subgroups.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          paddingLeft: '20px',
                          marginTop: '10px',
                          borderLeft: '3px solid #aaa',
                        }}
                      >
                        <p><strong>SubGroup ID:</strong> {sub.subgroup_id}</p>
                        <p><strong>SubGroup Name:</strong> {sub.subgroup_name}</p>

                        <h6>📑 Schemes Available:</h6>
                        {sub.schemes_available && sub.schemes_available.length > 0 ? (
                          sub.schemes_available.map((scheme, scIdx) => (
                            <div
                              key={scIdx}
                              style={{
                                paddingLeft: '20px',
                                marginTop: '5px',
                                borderLeft: '2px dotted #bbb',
                              }}
                            >
                              <p><strong>Scheme ID:</strong> {scheme.scheme_id}</p>
                              <p><strong>Slots:</strong></p>
                              {scheme.slot_ids && scheme.slot_ids.length > 0 ? (
                                scheme.slot_ids.map((slotObj, slotIdx) => (
                                  <div
                                    key={slotIdx}
                                    style={{
                                      paddingLeft: '20px',
                                      marginTop: '3px',
                                      borderLeft: '1px dashed #ddd',
                                    }}
                                  >
                                    <p>🔹 Slot ID: {slotObj.slot_id}</p>
                                    <p>Seats Left: {slotObj.no_of_seats_left}</p>
                                  </div>
                                ))
                              ) : (
                                <p>No Slots</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p>No Schemes Available</p>
                        )}

                        <h6>🎟️ ChitSlots:</h6>
                        {sub.chitslots && sub.chitslots.length > 0 ? (
                          sub.chitslots.map((chit, cIdx) => (
                            <div
                              key={cIdx}
                              style={{
                                paddingLeft: '20px',
                                marginTop: '3px',
                                borderLeft: '1px dashed #888',
                              }}
                            >
                              <p>Slot ID: {chit.slot_id}</p>
                              <p>Users: {chit.users.length}</p>
                            </div>
                          ))
                        ) : (
                          <p>No ChitSlots</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No SubGroups</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewGroupSlot;
