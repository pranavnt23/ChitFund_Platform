import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupSlot.css';

const AddGroupSlot = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subadminUsername: '',
    groupName: '',
    password: '',
    confirmPassword: '',
    numberOfSubgroups: 1
  });

  const [subgroups, setSubgroups] = useState([]);
  const [schemeOptions, setSchemeOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get('/api/schemes/')
      .then(res => {
        console.log("Loaded schemes from backend:", res.data); // prints the array
        setSchemeOptions(res.data)
      })
      .catch(err => console.error('Error fetching schemes:', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubgroupChange = (index, field, value) => {
    const updated = [...subgroups];
    updated[index] = { ...updated[index], [field]: value };
    setSubgroups(updated);
  };

  const handleNext = () => {
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const emptySubgroups = Array.from({ length: Number(formData.numberOfSubgroups) }, () => ({
        subgroupName: '',
        numberOfSchemes: 1,
        schemes: []
      }));
      setSubgroups(emptySubgroups);
    }
    setStep(step + 1);
  };

  const handleSchemeSelect = (subIndex, schemeIndex, value) => {
    // Log the selected value and corresponding scheme object to the console
    const scheme = schemeOptions.find(opt => opt.name === value);
    console.log(`Selected scheme for Subgroup ${subIndex + 1}, Scheme ${schemeIndex + 1}:`, scheme);

    // update subgroups state
    const updatedSchemes = [...(subgroups[subIndex].schemes || [])];
    updatedSchemes[schemeIndex] = value;
    handleSubgroupChange(subIndex, 'schemes', updatedSchemes);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        subadminUsername: formData.subadminUsername,
        groupName: formData.groupName,
        password: formData.password,
        subgroups: subgroups.map(sub => ({
          subgroupName: sub.subgroupName,
          schemes: sub.schemes
        }))
      };
      await axios.post('/api/groupslot/register', payload);
      setSuccessMessage('GroupSlot created successfully!');
      setStep(4);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create GroupSlot');
    }
  };

  return (
    <div className="groupslot-container">
      <h2 className="groupslot-header">Add Group Slot</h2>

      {step === 1 && (
        <div className="groupslot-section">
          <label>SubAdmin Username</label>
          <input
            type="text"
            name="subadminUsername"
            value={formData.subadminUsername}
            onChange={handleChange}
          />

          <label>Group Name</label>
          <input
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <label>Number of SubGroups</label>
          <input
            type="number"
            name="numberOfSubgroups"
            value={formData.numberOfSubgroups}
            onChange={handleChange}
            min={1}
          />

          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="groupslot-section">
          {subgroups.map((sub, idx) => (
            <div key={idx}>
              <label>SubGroup {idx + 1} Name</label>
              <input
                type="text"
                value={sub.subgroupName}
                onChange={e => handleSubgroupChange(idx, 'subgroupName', e.target.value)}
              />

              <label>Number of Schemes</label>
              <input
                type="number"
                min={1}
                value={sub.numberOfSchemes || 1}
                onChange={e => {
                  const newCount = parseInt(e.target.value, 10) || 1;
                  handleSubgroupChange(idx, 'numberOfSchemes', newCount);
                  handleSubgroupChange(idx, 'schemes', Array(newCount).fill(''));
                }}
              />
            </div>
          ))}
          <button onClick={() => setStep(step + 1)}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div className="groupslot-section">
          {subgroups.map((sub, i) => (
            <div key={i}>
              <h4>{sub.subgroupName || `SubGroup ${i + 1}`} Schemes</h4>
              {Array.from({ length: sub.numberOfSchemes || 1 }).map((_, j) => (
                <div key={j}>
                  <label>Scheme {j + 1}</label>
                  <select
                    value={sub.schemes[j] || ''}
                    onChange={e => handleSchemeSelect(i, j, e.target.value)}
                  >
                    <option value="">--Select Scheme--</option>
                    {schemeOptions.map((s, idx) => (
                      <option key={idx} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {step === 4 && successMessage && (
        <div className="groupslot-section">
          <h3>{successMessage}</h3>
        </div>
      )}
    </div>
  );
};

export default AddGroupSlot;
