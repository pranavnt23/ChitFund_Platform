import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeleteGroupSlot.css";

const DeleteGroupSlot = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/groupslot/viewall");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching group slots:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedGroupId) {
      setMessage("❌ Please select a group to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete Group ID ${selectedGroupId}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/groupslot/delete/${selectedGroupId}`);
      setMessage(`✅ Group ID ${selectedGroupId} deleted successfully.`);
      setSelectedGroupId("");
      fetchGroups(); // Refresh the list
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("❌ Failed to delete group.");
    }
  };

  return (
    <div className="delete-groupslot-container">
      <h2 className="delete-header">Delete Group Slot</h2>

      <label>Select Group to Delete:</label>
      <select
        className="dropdown"
        value={selectedGroupId}
        onChange={(e) => setSelectedGroupId(e.target.value)}
      >
        <option value="">-- Select Group ID --</option>
        {groups.map((group) => (
          <option key={group.groupId} value={group.groupId}>
            {group.groupId} - {group.groupName}
          </option>
        ))}
      </select>

      <button className="delete-btn" onClick={handleDelete}>
        Delete Group
      </button>

      {message && <p className="delete-message">{message}</p>}
    </div>
  );
};

export default DeleteGroupSlot;
