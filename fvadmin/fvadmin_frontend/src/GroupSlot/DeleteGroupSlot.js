import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeleteGroupSlot.css";

const API_BASE = "http://localhost:5000/api/groupslot";

const DeleteGroupSlot = () => {
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({}); // For showing/hiding subgroups

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE}/all`);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching group slots:", error);
      setMessage("❌ Failed to fetch group slots.");
    }
  };

  // Helpers to expand/collapse individual groups
  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Delete handlers
  const handleDeleteGroup = async (group_id) => {
    if (!window.confirm(`Are you sure you want to delete Group ID ${group_id} and all its subgroups/slots?`)) return;
    try {
      await axios.delete(`${API_BASE}/delete/group/${group_id}`);
      setMessage(`✅ Group ID ${group_id} deleted successfully.`);
      fetchGroups();
    } catch {
      setMessage("❌ Failed to delete group.");
    }
  };

  const handleDeleteSubGroup = async (subgroup_id) => {
    if (!window.confirm(`Are you sure you want to delete Subgroup ID ${subgroup_id} and its slots?`)) return;
    try {
      await axios.delete(`${API_BASE}/delete/subgroup/${subgroup_id}`);
      setMessage(`✅ Subgroup ID ${subgroup_id} deleted successfully.`);
      fetchGroups();
    } catch {
      setMessage("❌ Failed to delete subgroup.");
    }
  };

  const handleDeleteSlot = async (slot_id) => {
    if (!window.confirm(`Are you sure you want to delete Slot ID ${slot_id}?`)) return;
    try {
      await axios.delete(`${API_BASE}/delete/slot/${slot_id}`);
      setMessage(`✅ Slot ID ${slot_id} deleted successfully.`);
      fetchGroups();
    } catch {
      setMessage("❌ Failed to delete slot.");
    }
  };

  return (
    <div className="delete-groupslot-container">
      <h2 className="delete-header">Delete Group Slot</h2>
      {message && <p className="delete-message">{message}</p>}
      <div className="group-list-table">
        <table>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Subadmin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <React.Fragment key={group.group_id}>
                <tr>
                  <td onClick={() => toggleGroup(group.group_id)}>
                    <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                      {expandedGroups[group.group_id] ? "▼" : "▶"}
                    </span>{" "}
                    {group.group_id}
                  </td>
                  <td>{group.group_name}</td>
                  <td>{group.subadmin_name}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteGroup(group.group_id)}
                    >
                      Delete Group
                    </button>
                  </td>
                </tr>
                {expandedGroups[group.group_id] &&
                  group.subgroups.map((subgroup) => (
                    <React.Fragment key={subgroup.subgroup_id}>
                      <tr className="subgroup-row">
                        <td colSpan={1} style={{ paddingLeft: "32px" }}>
                          {subgroup.subgroup_id}
                        </td>
                        <td>{subgroup.subgroup_name}</td>
                        <td>—</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteSubGroup(subgroup.subgroup_id)}
                          >
                            Delete Subgroup
                          </button>
                        </td>
                      </tr>
                      {subgroup.schemes_available.map((scheme) =>
                        scheme.slot_ids.map((slotObj) => (
                          <tr key={slotObj.slot_id} className="slot-row">
                            <td colSpan={2} style={{ paddingLeft: "56px" }}>
                              {slotObj.slot_id}
                            </td>
                            <td>—</td>
                            <td>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteSlot(slotObj.slot_id)}
                              >
                                Delete Slot
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteGroupSlot;
