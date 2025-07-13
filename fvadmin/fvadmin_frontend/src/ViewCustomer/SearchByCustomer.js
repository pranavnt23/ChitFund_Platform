import React, { useState } from 'react';
import './SearchByCustomer.css';

const SearchByCustomer = ({ searchOption, placeholder }) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    let query = '';
    if (searchOption === 'phone') query = `phone=${input}`;
    if (searchOption === 'username') query = `username=${input}`;
    if (searchOption === 'aadhar') query = `aadhar=${input}`;
    try {
      const res = await fetch(`/api/customers?${query}`);
      if (!res.ok) throw new Error('No results found');
      const data = await res.json();
      if (!data.length) setError('No results found');
      setResults(data);
    } catch (err) {
      setError('Error fetching results');
    }
  };

  return (
    <div className="search-by-customer-container">
      <h3>Search by Customer</h3>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div>
        {results.map(user => (
          <div key={user._id} className="user-details-box">
            <div className="user-field"><span>ID:</span> {user._id}</div>
            <div className="user-field"><span>Username:</span> {user.username}</div>
            <div className="user-field"><span>First Name:</span> {user.fname}</div>
            <div className="user-field"><span>Last Name:</span> {user.lname}</div>
            <div className="user-field"><span>Aadhar No:</span> {user.aadharno}</div>
            <div className="user-field"><span>PAN No:</span> {user.panno}</div>
            <div className="user-field"><span>Email:</span> {user.email}</div>
            <div className="user-field"><span>Phone Number:</span> {user.phone_number}</div>
            <div className="user-field"><span>Date of Birth:</span> {user.dob ? new Date(user.dob).toLocaleDateString() : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchByCustomer;
