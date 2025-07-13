import React, { useEffect, useState } from 'react';
import './ModifyScheme.css';

const ModifyScheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [editingScheme, setEditingScheme] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/schemes');
      const data = await res.json();
      setSchemes(data);
    } catch (err) {
      setMessage('Error fetching schemes');
    }
  };

  const handleEditClick = (scheme) => {
    setEditingScheme(scheme._id);
    setEditData({
      name: scheme.name,
      description: scheme.description,
      target_audience: scheme.target_audience,
      monthly_contribution: scheme.investment_plan?.monthly_contribution || '',
      chit_period: scheme.investment_plan?.chit_period || '',
      total_fund_value: scheme.investment_plan?.total_fund_value?.[0]?.value || '',
      benefits: scheme.benefits ? scheme.benefits.join(', ') : '',
      icon: scheme.icon || '',
      number_of_slots: scheme.number_of_slots || ''
    });
    setMessage('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (schemeId) => {
    // Prepare payload to match backend schema
    const payload = {
      name: editData.name,
      description: editData.description,
      target_audience: editData.target_audience,
      investment_plan: {
        monthly_contribution: Number(editData.monthly_contribution),
        chit_period: Number(editData.chit_period),
        total_fund_value: [
          {
            duration: Number(editData.chit_period),
            value: Number(editData.total_fund_value)
          }
        ]
      },
      benefits: editData.benefits.split(',').map(b => b.trim()),
      icon: editData.icon,
      number_of_slots: Number(editData.number_of_slots)
    };

    try {
      const res = await fetch(`http://localhost:5000/api/schemes/${schemeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMessage('Scheme updated successfully!');
        setEditingScheme(null);
        fetchSchemes();
      } else {
        setMessage('Failed to update scheme');
      }
    } catch (err) {
      setMessage('Error updating scheme');
    }
  };

  const handleCancel = () => {
    setEditingScheme(null);
    setEditData({});
    setMessage('');
  };

  return (
    <div className="modify-schemes-container">
      <h2>Modify Schemes</h2>
      {message && <div className="modify-message">{message}</div>}
      <div className="modify-schemes-list">
        {schemes.map((scheme) => (
          <div key={scheme._id} className="modify-scheme-card">
            {editingScheme === scheme._id ? (
              <form
                className="edit-form"
                onSubmit={e => {
                  e.preventDefault();
                  handleUpdate(scheme._id);
                }}
              >
                <label>Name:</label>
                <input name="name" value={editData.name} onChange={handleEditChange} required />
                <label>Description:</label>
                <textarea name="description" value={editData.description} onChange={handleEditChange} required />
                <label>Target Audience:</label>
                <input name="target_audience" value={editData.target_audience} onChange={handleEditChange} required />
                <label>Monthly Contribution:</label>
                <input name="monthly_contribution" type="number" value={editData.monthly_contribution} onChange={handleEditChange} required />
                <label>Chit Period (months):</label>
                <input name="chit_period" type="number" value={editData.chit_period} onChange={handleEditChange} required />
                <label>Total Fund Value:</label>
                <input name="total_fund_value" type="number" value={editData.total_fund_value} onChange={handleEditChange} required />
                <label>Benefits (comma separated):</label>
                <input name="benefits" value={editData.benefits} onChange={handleEditChange} />
                <label>Icon:</label>
                <input name="icon" value={editData.icon} onChange={handleEditChange} />
                <label>Number of Slots:</label>
                <input name="number_of_slots" type="number" value={editData.number_of_slots} onChange={handleEditChange} required />
                <div className="edit-btn-row">
                  <button type="submit">Update</button>
                  <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h3>{scheme.name}</h3>
                <p>{scheme.description}</p>
                <div><b>Target Audience:</b> {scheme.target_audience}</div>
                <div><b>Monthly Contribution:</b> ₹{scheme.investment_plan?.monthly_contribution}</div>
                <div><b>Chit Period:</b> {scheme.investment_plan?.chit_period} months</div>
                <div><b>Total Fund Value:</b> {scheme.investment_plan?.total_fund_value?.map(v => `₹${v.value} for ${v.duration} months`).join(', ')}</div>
                <div><b>Benefits:</b> {scheme.benefits?.join(', ')}</div>
                <div><b>Icon:</b> {scheme.icon}</div>
                <div><b>Number of Slots:</b> {scheme.number_of_slots}</div>
                <button className="edit-btn" onClick={() => handleEditClick(scheme)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModifyScheme;
