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

  const [auctionResults, setAuctionResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setSelectedItem(null);
    setAuctionResults(null);
    setErrorMessage(null);
    if (auctionType === 'random') {
      if (randomOption === 'schemewise') {
        axios.get(`${BACKEND_URL}/api/dispauction/random/schemes`)
          .then(res => {
            setSchemes(res.data);
            setRandomSlots([]);
            setGroups([]);
            setSubgroups([]);
            setCustomSlots([]);
          })
          .catch(err => {
            console.error('Error fetching random schemes:', err);
            setSchemes([]);
          });
      } else if (randomOption === 'slotwise') {
        axios.get(`${BACKEND_URL}/api/dispauction/random/slots`)
          .then(res => {
            setRandomSlots(res.data);
            setSchemes([]);
            setGroups([]);
            setSubgroups([]);
            setCustomSlots([]);
          })
          .catch(err => {
            console.error('Error fetching random slots:', err);
            setRandomSlots([]);
          });
      } else {
        setSchemes([]);
        setRandomSlots([]);
        setGroups([]);
        setSubgroups([]);
        setCustomSlots([]);
      }
      setCustomOption('');
    } else if (auctionType === 'custom') {
      if (customOption === 'groupwise') {
        axios.get(`${BACKEND_URL}/api/dispauction/custom/groups`)
          .then(res => {
            setGroups(res.data);
            setSchemes([]);
            setRandomSlots([]);
            setSubgroups([]);
            setCustomSlots([]);
          })
          .catch(err => {
            console.error('Error fetching groups:', err);
            setGroups([]);
          });
      } else if (customOption === 'subgroupwise') {
        axios.get(`${BACKEND_URL}/api/dispauction/custom/subgroups`)
          .then(res => {
            setSubgroups(res.data);
            setSchemes([]);
            setRandomSlots([]);
            setGroups([]);
            setCustomSlots([]);
          })
          .catch(err => {
            console.error('Error fetching subgroups:', err);
            setSubgroups([]);
          });
      } else if (customOption === 'slotwise') {
        axios.get(`${BACKEND_URL}/api/dispauction/custom/slots`)
          .then(res => {
            setCustomSlots(res.data);
            setSchemes([]);
            setRandomSlots([]);
            setGroups([]);
            setSubgroups([]);
          })
          .catch(err => {
            console.error('Error fetching custom slots:', err);
            setCustomSlots([]);
          });
      } else {
        setGroups([]);
        setSubgroups([]);
        setCustomSlots([]);
        setSchemes([]);
        setRandomSlots([]);
      }
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
    setAuctionResults(null);
    setErrorMessage(null);
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
    axios.post(`${BACKEND_URL}/api/auction/start`, payload)
      .then(response => {
        setAuctionResults(response.data);
        alert('Auction request processed. See results below.');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Unknown error occurred while starting auction.');
        }
        console.error('Auction start error:', error);
      });
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

      {/* Custom options */}
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

          {customOption === 'groupwise' && (
            <div className="select-list">
              <h4>Select Group</h4>
              {groups.length === 0 && <p>Loading...</p>}
              <ul>
                {groups.map(group => {
                  const groupIdStr = group.group_id || group._id.toString();
                  return (
                    <li key={group._id.toString()}>
                      <button
                        type="button"
                        className={selectedItem === groupIdStr ? 'active' : ''}
                        onClick={() => setSelectedItem(groupIdStr)}
                      >
                        {group.group_name || groupIdStr}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {customOption === 'subgroupwise' && (
            <div className="select-list">
              <h4>Select Subgroup</h4>
              {subgroups.length === 0 && <p>Loading...</p>}
              <ul>
                {subgroups.map(sg => {
                  const subgroupName = sg.subgroup_name || sg._id.toString();
                  return (
                    <li key={sg._id.toString()}>
                      <button
                        type="button"
                        className={selectedItem === subgroupName ? 'active' : ''}
                        onClick={() => setSelectedItem(subgroupName)}
                      >
                        {subgroupName}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {customOption === 'slotwise' && (
            <div className="select-list">
              <h4>Select Slot</h4>
              {customSlots.length === 0 && <p>Loading...</p>}
              <ul>
                {customSlots.map(slot => {
                  const labelParts = [];
                  if (slot.slot_id) labelParts.push(slot.slot_id);
                  if (slot.slot_name) labelParts.push(slot.slot_name);

                  let objectId = slot._id;
                  if (objectId && typeof objectId === 'object' && objectId.$oid) {
                    objectId = objectId.$oid;
                  } else if (objectId && objectId.toString) {
                    objectId = objectId.toString();
                  }
                  const label = labelParts.join(' - ') || objectId;
                  const slotId = slot.slot_id || objectId;

                  return (
                    <li key={objectId}>
                      <button
                        type="button"
                        className={selectedItem === slotId ? 'active' : ''}
                        onClick={() => setSelectedItem(slotId)}
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

      {/* Random options */}
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

          {randomOption === 'schemewise' && (
            <div className="select-list">
              <h4>Select Scheme</h4>
              {schemes.length === 0 && <p>Loading...</p>}
              <ul>
                {schemes.map(scheme => {
                  const schemeIdStr = scheme.scheme_id
                    ? typeof scheme.scheme_id === 'object'
                      ? scheme.scheme_id.toString()
                      : scheme.scheme_id
                    : scheme._id.toString();
                  return (
                    <li key={scheme._id.toString()}>
                      <button
                        type="button"
                        className={selectedItem === schemeIdStr ? 'active' : ''}
                        onClick={() => setSelectedItem(schemeIdStr)}
                      >
                        {scheme.name || schemeIdStr}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {randomOption === 'slotwise' && (
            <div className="select-list">
              <h4>Select Slot</h4>
              {randomSlots.length === 0 && <p>Loading...</p>}
              {randomSlots.map(schemeGroup => {
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

      {/* Display error message */}
      {errorMessage && <div className="error-message">Error: {errorMessage}</div>}

      {/* Display auction results if present */}
      {auctionResults && (
        <div className="auction-results">
          <h3>Auction Results</h3>
          {Array.isArray(auctionResults) ? (
            <ul>
              {auctionResults.map((result, idx) => (
                <li key={idx}>
                  {result.slot_id || result.subgroup_id || result.group_id} — Status: {result.status}
                  {result.reason && <> — Reason: {result.reason}</>}
                  {result.message && <> — Message: {result.message}</>}
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p>Slot ID: {auctionResults.slot_id}</p>
              <p>Status: live</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StartAuction;
