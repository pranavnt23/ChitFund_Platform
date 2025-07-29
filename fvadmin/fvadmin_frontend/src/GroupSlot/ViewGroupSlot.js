import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GroupSlot.css';

const ViewGroupSlot = () => {
  const [groupSlots, setGroupSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroupSlots();
  }, []);

  const fetchGroupSlots = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/groupslot/view');
      setGroupSlots(res.data);
    } catch (err) {
      console.error('Error fetching GroupSlot data:', err);
      setError('Failed to fetch GroupSlot data.');
    }
  };

  return (
    <div className="groupslot-container">
      <h2 className="groupslot-header">View Group Slots</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="groupslot-section">
        {groupSlots.length === 0 ? (
          <p>No Group Slots available.</p>
        ) : (
          groupSlots.map((group, index) => (
            <div key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '15px', marginBottom: '15px' }}>
              <h4>Group ID: {group.group_id}</h4>
              <p><strong>Group Name:</strong> {group.group_name}</p>
              <p><strong>SubAdmin Username:</strong> {group.subadmin_username}</p>

              <h5>Subgroups:</h5>
              {group.subgroups && group.subgroups.length > 0 ? (
                group.subgroups.map((sub, idx) => (
                  <div key={idx} style={{ paddingLeft: '20px' }}>
                    <p><strong>SubGroup ID:</strong> {sub.subgroup_id}</p>
                    <p><strong>SubGroup Name:</strong> {sub.subgroup_name}</p>

                    <h6>Schemes:</h6>
                    {sub.slots && sub.slots.length > 0 ? (
                      sub.slots.map((slot, sidx) => (
                        <div key={sidx} style={{ paddingLeft: '20px' }}>
                          <p><strong>Slot ID:</strong> {slot.slot_id}</p>
                          <p><strong>Scheme Name:</strong> {slot.scheme_name}</p>
                        </div>
                      ))
                    ) : (
                      <p>No Slots</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No SubGroups</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewGroupSlot;
