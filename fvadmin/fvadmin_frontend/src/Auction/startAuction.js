import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './startAuction.css';

const BACKEND_URL = 'http://localhost:5000';

const StartAuction = () => {
  const [auctionType, setAuctionType] = useState('');
  const [customOption, setCustomOption] = useState('');
  const [randomOption, setRandomOption] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Dynamic data state
  const [schemes, setSchemes] = useState([]);
  const [randomSlots, setRandomSlots] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [customSlots, setCustomSlots] = useState([]);

  useEffect(() => {
    setSelectedItem(null);

    if (auctionType === 'random') {
  if (randomOption === 'schemewise') {
    axios.get(`${BACKEND_URL}/api/dispauction/random/schemes`)
      .then(res => {
        setSchemes(res.data);
      })
      .catch(err => {
        console.error('Error fetching random schemes:', err);
        setSchemes([]);
      });
    setRandomSlots([]);
  } else if (randomOption === 'slotwise') {
    axios.get(`${BACKEND_URL}/api/dispauction/random/slots`)
      .then(res => {
        setRandomSlots(res.data);
      })
      .catch(err => {
        console.error('Error fetching random slots:', err);
        setRandomSlots([]);
      });
    setSchemes([]);
  } else {
    setSchemes([]);
    setRandomSlots([]);
  }
  setGroups([]);
  setSubgroups([]);
  setCustomSlots([]);
}
 else if (auctionType === 'custom') {
      if (customOption === 'groupwise') {
  axios.get(`${BACKEND_URL}/api/dispauction/custom/groups`)
    .then(res => {
      setGroups(res.data);
    })
    .catch(err => {
      console.error('Error fetching groups:', err);
      setGroups([]);
    });
} else if (customOption === 'subgroupwise') {
  axios.get(`${BACKEND_URL}/api/dispauction/custom/subgroups`)
    .then(res => {
      setSubgroups(res.data);
    })
    .catch(err => {
      console.error('Error fetching subgroups:', err);
      setSubgroups([]);
    });
} else if (customOption === 'slotwise') {
  axios.get(`${BACKEND_URL}/api/dispauction/custom/slots`)
    .then(res => {
      setCustomSlots(res.data);
    })
    .catch(err => {
      console.error('Error fetching custom slots:', err);
      setCustomSlots([]);
    });
} else {
  setGroups([]);
  setSubgroups([]);
  setCustomSlots([]);
}

      setSchemes([]);
      setRandomSlots([]);
      setRandomOption('');
    } else {
      setSchemes([]);
      setRandomSlots([]);
      setGroups([]);
      setSubgroups([]);
      setCustomSlots([]);
      setCustomOption('');
      setRandomOption('');
    }
  }, [auctionType, randomOption, customOption]);

  const handleStartAuction = () => {
    if (!auctionType) {
      alert('Please select an auction type.');
      return;
    }
    if (auctionType === 'random' && !randomOption) {
      alert('Please select a random option.');
      return;
    }
    if (auctionType === 'custom' && !customOption) {
      alert('Please select a custom option.');
      return;
    }
    if (!selectedItem) {
      alert('Please select an item from the list.');
      return;
    }

    const payload = {
      auction_type: auctionType,
      custom_option: auctionType === 'custom' ? customOption : null,
      random_option: auctionType === 'random' ? randomOption : null,
      selected_item: selectedItem,
    };

    console.log('Starting auction with data:', payload);
    alert('Auction started (placeholder). Check console for payload.');
    // TODO: Send payload to backend via API
  };

  return (
    <div className="start-auction-container">
      <h2>Start Auction</h2>

      <div className="form-group">
        <label>Select Auction Type:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="auctionType"
              value="custom"
              checked={auctionType === 'custom'}
              onChange={e => setAuctionType(e.target.value)}
            />
            Custom
          </label>
          <label>
            <input
              type="radio"
              name="auctionType"
              value="random"
              checked={auctionType === 'random'}
              onChange={e => setAuctionType(e.target.value)}
            />
            Random
          </label>
        </div>
      </div>

      {auctionType === 'custom' && (
        <div className="custom-options">
          <label>Choose Custom Option:</label>
          <div className="button-group">
            <button
              type="button"
              className={customOption === 'groupwise' ? 'active' : ''}
              onClick={() => setCustomOption('groupwise')}
            >
              Groupwise
            </button>
            <button
              type="button"
              className={customOption === 'subgroupwise' ? 'active' : ''}
              onClick={() => setCustomOption('subgroupwise')}
            >
              Subgroupwise
            </button>
            <button
              type="button"
              className={customOption === 'slotwise' ? 'active' : ''}
              onClick={() => setCustomOption('slotwise')}
            >
              Slotwise
            </button>
          </div>

          {/* Display groups */}
          {customOption === 'groupwise' && (
            <div className="select-list">
              <h4>Select Group</h4>
              {groups.length === 0 && <p>Loading...</p>}
              <ul>
                {groups.map(group => (
                  <li key={group._id}>
                    <button
                      type="button"
                      className={selectedItem === group._id ? 'active' : ''}
                      onClick={() => setSelectedItem(group._id)}
                    >
                      {group.group_name || group._id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display subgroups */}
          {customOption === 'subgroupwise' && (
            <div className="select-list">
              <h4>Select Subgroup</h4>
              {subgroups.length === 0 && <p>Loading...</p>}
              <ul>
                {subgroups.map(sg => (
                  <li key={sg._id}>
                    <button
                      type="button"
                      className={selectedItem === sg._id ? 'active' : ''}
                      onClick={() => setSelectedItem(sg._id)}
                    >
                      {sg.subgroup_name || sg._id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display custom slots */}
        {customOption === 'slotwise' && (
        <div className="select-list">
          <h4>Select Slot</h4>
          {customSlots.length === 0 && <p>Loading...</p>}
          <ul>
            {customSlots.map(slot => {
              // Build display label: slot_id, slot_name, or fallback to object id
              const labelParts = [];
              if (slot.slot_id) labelParts.push(slot.slot_id);
              if (slot.slot_name) labelParts.push(slot.slot_name);

              // Robust object ID handling
              let objectId = slot._id;
              if (objectId && typeof objectId === 'object' && objectId.$oid) {
                objectId = objectId.$oid;
              } else if (objectId && objectId.toString) {
                objectId = objectId.toString();
              }
              const label = labelParts.join(' - ') || objectId;

              return (
                <li key={objectId}>
                  <button
                    type="button"
                    className={selectedItem === objectId ? 'active' : ''}
                    onClick={() => setSelectedItem(objectId)}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}


        </div>
      )}

      {auctionType === 'random' && (
  <div className="random-options">
    <label>Choose Random Option:</label>
    <div className="button-group">
      <button
        type="button"
        className={randomOption === 'schemewise' ? 'active' : ''}
        onClick={() => setRandomOption('schemewise')}
      >
        Schemewise
      </button>
      <button
        type="button"
        className={randomOption === 'slotwise' ? 'active' : ''}
        onClick={() => setRandomOption('slotwise')}
      >
        Slotwise
      </button>
    </div>

    {/* Display schemes */}
    {randomOption === 'schemewise' && (
  <div className="select-list">
    <h4>Select Scheme</h4>
    {schemes.length === 0 && <p>Loading...</p>}
    <ul>
      {schemes.map(scheme => {
        // scheme_id is an ObjectId object, convert to string if necessary
        const schemeLabel = scheme.scheme_id ? scheme.scheme_id.toString() : scheme._id.toString();

        return (
          <li key={scheme._id}>
            <button
              type="button"
              className={selectedItem === scheme._id ? 'active' : ''}
              onClick={() => setSelectedItem(scheme._id)}
            >
              {schemeLabel}
            </button>
          </li>
        );
      })}
    </ul>
  </div>
)}



    {/* Display random slots grouped by scheme */}
    {randomOption === 'slotwise' && (
    <div className="select-list">
      <h4>Select Slot</h4>
      {randomSlots.length === 0 && <p>Loading...</p>}
      {randomSlots.map(schemeGroup => {
        // Use scheme_id or fallback _id as label since schemeName not in your data
        const schemeLabel = schemeGroup.scheme_id || schemeGroup._id;
        return (
          <div key={schemeGroup._id}>
            <h5>Scheme: {schemeLabel}</h5>
            <ul>
              {schemeGroup.slot_ids.map(slot => {
                const slotLabel = slot.slot_id || slot._id;
                return (
                  <li key={slot._id}>
                    <button
                      type="button"
                      className={selectedItem === slot.slot_id ? 'active' : ''}
                      onClick={() => setSelectedItem(slot.slot_id)}
                    >
                      {slotLabel} - Status: {slot.status}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  )}

  </div>
)}

      <button className="start-auction-button" onClick={handleStartAuction}>
        Start Auction
      </button>
    </div>
  );
};

export default StartAuction;
