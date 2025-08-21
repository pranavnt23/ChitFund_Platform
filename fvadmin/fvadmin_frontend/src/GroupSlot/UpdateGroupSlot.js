import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateGroupSlot.css";

const API_BASE = "http://localhost:5000/api/groupslot";

const UpdateGroupSlot = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch groups with nested data on mount
  useEffect(() => {
    axios.get(`${API_BASE}/all`)
      .then(res => setGroups(res.data))
      .catch(() => setMessage("❌ Failed to fetch groups."));
  }, []);

  // When group is selected, load a deep copy of the data for editing
  const handleGroupSelect = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);
    const group = groups.find(g => g.group_id === groupId);
    if (group) {
      // Deep copy to avoid mutating original state
      setSelectedGroup(JSON.parse(JSON.stringify(group)));
      setMessage("");
    } else {
      setSelectedGroup(null);
    }
  };

  // Update handlers
  const handleGroupNameChange = (e) => {
    setSelectedGroup({ ...selectedGroup, group_name: e.target.value });
  };

  const handleSubgroupNameChange = (sgIdx, e) => {
    const newSubgroups = [...selectedGroup.subgroups];
    newSubgroups[sgIdx].subgroup_name = e.target.value;
    setSelectedGroup({ ...selectedGroup, subgroups: newSubgroups });
  };

  const handleSchemeIdChange = (sgIdx, schIdx, e) => {
    const newSubgroups = [...selectedGroup.subgroups];
    newSubgroups[sgIdx].schemes_available[schIdx].scheme_id = e.target.value;
    setSelectedGroup({ ...selectedGroup, subgroups: newSubgroups });
  };

  const handleAddScheme = (sgIdx) => {
    const newSubgroups = [...selectedGroup.subgroups];
    newSubgroups[sgIdx].schemes_available.push({
      scheme_id: "",
      slot_ids: [],
    });
    setSelectedGroup({ ...selectedGroup, subgroups: newSubgroups });
  };

  const handleAddSlot = (sgIdx, schIdx) => {
    const newSubgroups = [...selectedGroup.subgroups];
    newSubgroups[sgIdx].schemes_available[schIdx].slot_ids.push({
      slot_id: "", // Empty string for new slot, backend will generate ID
      no_of_seats_left: 10,
    });
    setSelectedGroup({ ...selectedGroup, subgroups: newSubgroups });
  };

  // Optional: Edit seats left or slot_id for existing slots (not required, but easy to add)

  // Submit updated data
  const handleSubmit = async () => {
    try {
      if (!selectedGroup) {
        setMessage("❌ No group selected");
        return;
      }
      await axios.put(`${API_BASE}/update/${selectedGroup.group_id}`, selectedGroup);
      setMessage("✅ Group updated successfully!");
      // Refresh groups to reflect updates
      const updatedGroups = await axios.get(`${API_BASE}/all`);
      setGroups(updatedGroups.data);
    } catch (error) {
      setMessage("❌ Failed to update group");
      console.error(error);
    }
  };

  return (
    <div className="update-groupslot-container">
      <h2 className="update-header">Update Group Slot</h2>
      {message && <p className="update-message">{message}</p>}

      <label>Select Group to Update:</label>
      <select
        className="dropdown"
        value={selectedGroupId}
        onChange={handleGroupSelect}
      >
        <option value="">-- Select Group --</option>
        {groups.map(group => (
          <option key={group.group_id} value={group.group_id}>
            {group.group_id} - {group.group_name}
          </option>
        ))}
      </select>

      {selectedGroup && (
        <div className="update-form">
          <label>Group Name</label>
          <input
            type="text"
            value={selectedGroup.group_name}
            onChange={handleGroupNameChange}
          />

          <h4>SubGroups</h4>
          {selectedGroup.subgroups.map((sg, sgIdx) => (
            <div key={sg.subgroup_id} className="subgroup-section">
              <label>SubGroup Name</label>
              <input
                type="text"
                value={sg.subgroup_name}
                onChange={(e) => handleSubgroupNameChange(sgIdx, e)}
              />

              <button
                type="button"
                onClick={() => handleAddScheme(sgIdx)}
                className="add-scheme-btn"
              >
                + Add Scheme
              </button>

              <div className="schemes-list">
                {sg.schemes_available.map((scheme, schIdx) => (
                  <div key={schIdx} className="scheme-section">
                    <label>Scheme ID</label>
                    <input
                      type="text"
                      value={scheme.scheme_id}
                      onChange={(e) => handleSchemeIdChange(sgIdx, schIdx, e)}
                    />

                    <button
                      type="button"
                      onClick={() => handleAddSlot(sgIdx, schIdx)}
                      className="add-slot-btn"
                    >
                      + Add Slot
                    </button>

                    <div className="slot-list">
                      {scheme.slot_ids.map((slot, slotIdx) => (
                        <span key={slotIdx} className="slot-label">
                          {slot.slot_id || "[New Slot]"} (Seats left: {slot.no_of_seats_left})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button className="submit-btn" onClick={handleSubmit}>
            Update Group Slot
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateGroupSlot;
