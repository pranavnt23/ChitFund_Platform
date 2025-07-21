import React, { useEffect, useState } from 'react';
import './ViewSchemes.css';

const ViewSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/schemes');
      const data = await response.json();
      const validData = Array.isArray(data) ? data : [];
      setSchemes(validData);
      setFilteredSchemes(validData);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = schemes.filter(scheme =>
      scheme.name.toLowerCase().includes(term)
    );
    setFilteredSchemes(filtered);
  };

  return (
    <div className="view-schemes-container">
      <h2>Available Schemes</h2>

      <input
        type="text"
        placeholder="Search by scheme name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="scheme-search-input"
      />

      {loading ? (
        <p>Loading schemes...</p>
      ) : filteredSchemes.length ? (
        <div className="schemes-grid">
          {filteredSchemes.map((scheme) => (
            <div key={scheme._id} className="scheme-card">
              <h3>{scheme.name}</h3>
              <p>{scheme.description}</p>
              <div><strong>Target Audience:</strong> {scheme.target_audience}</div>
              <div><strong>Monthly Contribution:</strong> ₹{scheme.investment_plan?.monthly_contribution}</div>
              <div><strong>Chit Period:</strong> {scheme.investment_plan?.chit_period} months</div>
              <div><strong>Total Fund Value:</strong> {scheme.investment_plan?.total_fund_value?.map(v => `₹${v.value} for ${v.duration} months`).join(', ')}</div>
              {scheme.benefits?.length > 0 && (
                <>
                  <strong>Benefits:</strong>
                  <ul>
                    {scheme.benefits.map((benefit, idx) => <li key={idx}>{benefit}</li>)}
                  </ul>
                </>
              )}
              <div><strong>Number of Slots:</strong> {scheme.number_of_slots}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No schemes match your search.</p>
      )}
    </div>
  );
};

export default ViewSchemes;
