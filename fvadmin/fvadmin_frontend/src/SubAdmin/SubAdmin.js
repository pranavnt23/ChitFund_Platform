import React, { useState } from 'react';
import AddSubAdmin from './AddSubAdmin';
import ViewSubAdmin from './ViewSubAdmin';
import ModifySubAdmin from './ModifySubAdmin';
import DeleteSubAdmin from './DeleteSubAdmin';
import './SubAdmin.css';

const SubAdmin = () => {
  const [selectedAction, setSelectedAction] = useState('');

  const renderContent = () => {
    switch (selectedAction) {
      case 'add':
        return <AddSubAdmin />;
      case 'view':
        return <ViewSubAdmin />;
      case 'modify':
        return <ModifySubAdmin />;
      case 'delete':
        return <DeleteSubAdmin />;
      default:
        return <p>Select an action to manage SubAdmins</p>;
    }
  };

  return (
    <div className="subgroup-container">
      <h2>Manage SubAdmin</h2>
      <div className="subgroup-actions">
        <button onClick={() => setSelectedAction('add')}>Add SubAdmin</button>
        <button onClick={() => setSelectedAction('view')}>View SubAdmin</button>
        <button onClick={() => setSelectedAction('modify')}>Modify SubAdmin</button>
        <button onClick={() => setSelectedAction('delete')}>Delete SubAdmin</button>
      </div>
      <div className="subgroup-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SubAdmin;
