import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateGroupSlot.css';

const UpdateGroupSlot = () => {
  const [groupSlots, setGroupSlots] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [groupData, setGroupData] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    axios.get('/api/groupslot/view')
      .then(res => setGroupSlots(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleGroupSelect = async (e) => {
    const id = e.target.value;
    setSelectedGroupId(id);
    try {
      const res = await axios.get(`/api/groupslot/${id}`);
      setGroupData(res.data);
      setSuccessMsg('');
    } catch (error) {
      console.error('Error fetching group data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleSubGroupChange = (index, e) => {
    const updatedSubGroups = [...groupData.subGroups];
    updatedSubGroups[index][e.target.name] = e.target.value;
    setGroupData({ ...groupData, subGroups: updatedSubGroups });
  };

  const handleSchemeChange = (subGroupIndex, schemeIndex, e) => {
    const updatedSubGroups = [...groupData.subGroups];
    updatedSubGroups[subGroupIndex].schemes[schemeIndex] = e.target.value;
    setGroupData({ ...groupData, subGroups: updatedSubGroups });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/groupslot/update/${selectedGroupId}`, groupData);
      setSuccessMsg('GroupSlot updated successfully!');
    } catch (error) {
      console.error('Error updating group slot', error);
    }
  };

  return (
    <div className="update-groupslot-container">
      <h2 className="update-header">Update Group Slot</h2>

      <select className="dropdown" onChange={handleGroupSelect} value={selectedGroupId}>
        <option value="">-- Select Group to Edit --</option>
        {groupSlots.map(group => (
          <option key={group._id} value={group._id}>{group.groupName}</option>
        ))}
      </select>

      {groupData && (
        <div className="update-form">
          <label>Group Name</label>
          <input type="text" name="groupName" value={groupData.groupName} onChange={handleChange} />

          <label>Group Password</label>
          <input type="text" name="groupPassword" value={groupData.groupPassword} onChange={handleChange} />

          <label>SubAdmin Username</label>
          <input type="text" name="subAdminUserName" value={groupData.subAdminUserName} onChange={handleChange} />

          <h4>SubGroups</h4>
          {groupData.subGroups.map((subGroup, index) => (
            <div key={index} className="subgroup-box">
              <label>SubGroup Name</label>
              <input
                type="text"
                name="subGroupName"
                value={subGroup.subGroupName}
                onChange={(e) => handleSubGroupChange(index, e)}
              />
              <label>Number of Schemes</label>
              <input
                type="number"
                name="noOfSchemes"
                value={subGroup.noOfSchemes}
                onChange={(e) => handleSubGroupChange(index, e)}
              />
              <label>Schemes</label>
              {subGroup.schemes.map((scheme, sIndex) => (
                <input
                  key={sIndex}
                  type="text"
                  value={scheme}
                  onChange={(e) => handleSchemeChange(index, sIndex, e)}
                />
              ))}
            </div>
          ))}

          <button className="submit-btn" onClick={handleSubmit}>Update</button>
        </div>
      )}

      {successMsg && <p className="success-msg">{successMsg}</p>}
    </div>
  );
};

export default UpdateGroupSlot;
    