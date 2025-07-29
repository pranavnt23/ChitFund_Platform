import React, { useState } from 'react';
import './GroupSlot.css';
import AddGroupSlot from './AddGroupSlot';
import ViewGroupSlot from './ViewGroupSlot';
import UpdateGroupSlot from './UpdateGroupSlot';
import DeleteGroupSlot from './DeleteGroupSlot';

const GroupSlot = () => {
  const [activeSection, setActiveSection] = useState('view');

  return (
    <div className="group-slot-container">
      <h1 className="group-slot-header">GroupSlot Management</h1>

      <div className="group-slot-nav">
        <button onClick={() => setActiveSection('add')}>➕ Add</button>
        <button onClick={() => setActiveSection('view')}>🔍 View</button>
        <button onClick={() => setActiveSection('update')}>✏️ Update</button>
        <button onClick={() => setActiveSection('delete')}>🗑️ Delete</button>
      </div>

      <div className="group-slot-content">
        {activeSection === 'add' && <AddGroupSlot />}
        {activeSection === 'view' && <ViewGroupSlot />}
        {activeSection === 'update' && <UpdateGroupSlot />}
        {activeSection === 'delete' && <DeleteGroupSlot />}
      </div>
    </div>
  );
};

export default GroupSlot;
