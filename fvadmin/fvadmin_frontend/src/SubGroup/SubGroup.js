import React, { useState } from 'react';
import AddSubGroup from './AddSubGroup';
import ViewSubGroup from './ViewSubGroup';
import ModifySubGroup from './ModifySubGroup';
import DeleteSubGroup from './DeleteSubGroup';
import './SubGroup.css';

const SubGroup = () => {
  const [selectedAction, setSelectedAction] = useState('');

  const renderContent = () => {
    switch (selectedAction) {
      case 'add':
        return <AddSubGroup />;
      case 'view':
        return <ViewSubGroup />;
      case 'modify':
        return <ModifySubGroup />;
      case 'delete':
        return <DeleteSubGroup />;
      default:
        return <p>Select an action to manage SubGroups</p>;
    }
  };

  return (
    <div className="subgroup-container">
      <h2>Manage SubGroups</h2>
      <div className="subgroup-actions">
        <button onClick={() => setSelectedAction('add')}>Add SubGroup</button>
        <button onClick={() => setSelectedAction('view')}>View SubGroups</button>
        <button onClick={() => setSelectedAction('modify')}>Modify SubGroup</button>
        <button onClick={() => setSelectedAction('delete')}>Delete SubGroup</button>
      </div>
      <div className="subgroup-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SubGroup;
