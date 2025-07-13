import React, { useState } from 'react';
import './ViewCustomer.css';
import SearchByCustomer from './SearchByCustomer';
import SearchByScheme from './SearchBySchemes';

const ViewCustomer = () => {
  const [view, setView] = useState(null); // 'customer' or 'scheme'
  const [customerOption, setCustomerOption] = useState('phone');
  const [schemeOption, setSchemeOption] = useState('schemeid');

  // Define placeholders for each option
  const customerPlaceholders = {
    phone: 'Enter Phone Number',
    username: 'Enter Username',
    aadhar: 'Enter Aadhar No'
  };

  const schemePlaceholders = {
    schemeid: 'Enter Scheme ID',
    schemename: 'Enter Scheme Name'
  };

  return (
    <div className="view-customer-container">
      <div className="search-options">
        <button
          onClick={() => setView('customer')}
          className={view === 'customer' ? 'active' : ''}
        >
          Search by Customer
        </button>
        <button
          onClick={() => setView('scheme')}
          className={view === 'scheme' ? 'active' : ''}
        >
          Search by Scheme
        </button>
      </div>

      {view === 'customer' && (
        <div className="search-form">
          <div className="dropdown-container">
            <label htmlFor="customer-dropdown">Search Customer By: </label>
            <select
              id="customer-dropdown"
              value={customerOption}
              onChange={e => setCustomerOption(e.target.value)}
            >
              <option value="phone">Phone Number</option>
              <option value="username">Username</option>
              <option value="aadhar">Aadhar No</option>
            </select>
          </div>
          <SearchByCustomer
            searchOption={customerOption}
            placeholder={customerPlaceholders[customerOption]}
          />
        </div>
      )}

      {view === 'scheme' && (
        <div className="search-form">
          <div className="dropdown-container">
            <label htmlFor="scheme-dropdown">Search Scheme By: </label>
            <select
              id="scheme-dropdown"
              value={schemeOption}
              onChange={e => setSchemeOption(e.target.value)}
            >
              <option value="schemeid">Scheme ID</option>
              <option value="schemename">Scheme Name</option>
            </select>
          </div>
          <SearchByScheme
            searchOption={schemeOption}
            placeholder={schemePlaceholders[schemeOption]}
          />
        </div>
      )}
    </div>
  );
};

export default ViewCustomer;
