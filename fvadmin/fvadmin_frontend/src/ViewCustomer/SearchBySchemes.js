import React, { useState } from 'react';
import './SearchBySchemes.css';

const SearchByScheme = ({ searchOption, placeholder }) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    setLoading(true);
    let query = '';
    if (searchOption === 'schemeid' && input) query = `schemeid=${input}`;
    if (searchOption === 'schemename' && input) query = `schemename=${input}`;
    try {
      const res = await fetch(`/api/schemes/search${query ? '?' + query : ''}`);
      if (!res.ok) throw new Error('No results found');
      const data = await res.json();
      if (!data.length) setError('No results found');
      setResults(data);
    } catch (err) {
      setError('Error fetching results');
    }
    setLoading(false);
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
    setError('');
  };

  return (
    <div className="search-by-scheme-container">
      <h3>Search by Scheme</h3>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          aria-label="Scheme Name"
        />
        <div className="button-container">
          <button type="submit">Search</button>
          <button type="button" onClick={handleClear} disabled={!input}>Clear</button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div>
        {results.map(scheme => (
          <div key={scheme._id} className="scheme-details-box">
            <div className="scheme-field"><span>ID:</span> {scheme._id}</div>
            <div className="scheme-field"><span>Name:</span> {scheme.name}</div>
            <div className="scheme-field"><span>Description:</span> {scheme.description}</div>
            <div className="scheme-field"><span>Target Audience:</span> {scheme.target_audience}</div>
            <div className="scheme-field"><span>Monthly Contribution:</span> {scheme.investment_plan?.monthly_contribution}</div>
            <div className="scheme-field"><span>Chit Period:</span> {scheme.investment_plan?.chit_period}</div>
            <div className="scheme-field"><span>Total Fund Value:</span>
              <ul>
                {scheme.investment_plan?.total_fund_value?.map((item, idx) => (
                  <li key={idx}>Duration: {item.duration}, Value: {item.value}</li>
                ))}
              </ul>
            </div>
            <div className="scheme-field"><span>Benefits:</span>
              <ul>
                {scheme.benefits?.map((b, idx) => <li key={idx}>{b}</li>)}
              </ul>
            </div>
            <div className="scheme-field"><span>Number of Slots:</span> {scheme.number_of_slots}</div>
            <div className="scheme-field"><span>Registered Customers:</span>
              {scheme.registered_users && scheme.registered_users.length > 0 ? (
                <div className="registered-users-list">
                  {scheme.registered_users.map(user => (
                    <div key={user._id} className="registered-user-card">
                      <div><b>ID:</b> {user._id}</div>
                      <div><b>Username:</b> {user.username}</div>
                      <div><b>Name:</b> {user.fname} {user.lname}</div>
                      <div><b>Email:</b> {user.email}</div>
                      <div><b>Phone:</b> {user.phone_number}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <span>No customers registered</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchByScheme;
