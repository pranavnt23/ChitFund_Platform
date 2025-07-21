import React, { useState } from 'react';
import AddScheme from './AddScheme/AddScheme';
import ModifyScheme from './ModifyScheme/ModifyScheme';
import DeleteScheme from './DeleteScheme/DeleteScheme';
import ViewSchemes from './ViewSchemes/ViewSchemes';  // Assuming you have this component
import './Schemes.css';

const Schemes = () => {
  const [selectedAction, setSelectedAction] = useState('');

  const renderContent = () => {
    switch (selectedAction) {
      case 'add':
        return <AddScheme />;
      case 'modify':
        return <ModifyScheme />;
      case 'delete':
        return <DeleteScheme />;
      case 'view':
        return <ViewSchemes />;
      default:
        return <p>Please select an action to manage schemes.</p>;
    }
  };

  return (
    <div className="schemes-container">
      <h2>Manage Schemes</h2>
      <div className="schemes-actions">
        <button onClick={() => setSelectedAction('view')}>View Schemes</button>
        <button onClick={() => setSelectedAction('add')}>Add Scheme</button>
        <button onClick={() => setSelectedAction('modify')}>Modify Scheme</button>
        <button onClick={() => setSelectedAction('delete')}>Delete Scheme</button>
      </div>

      <div className="schemes-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Schemes;
