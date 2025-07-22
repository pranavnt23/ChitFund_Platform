import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './MorePage.css';
import RegisterDialog from './RegisterScheme';

const MorePageComponent = () => {
  const { id, username } = useParams(); // Extract id and username from URL params
  const location = useLocation(); // Use location to get passed state
  const registeredSchemes = location.state?.registeredSchemes || []; // Default to an empty array if not provided
  const navigate = useNavigate(); // Initialize useNavigate

  const [schemeData, setSchemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

useEffect(() => {
  const fetchSchemeDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/schemes/${id}`);
      const data = await response.json();
      setSchemeData(data);
    } catch (error) {
      console.error('Error fetching scheme details:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchSchemeDetails();
}, [id]); 

  const handleRegisterClick = () => {
  navigate('/login');  
};


  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleViewHistoryClick = () => {
    navigate('/auction', { state: { schemeId: id, username } }); // Navigate to Auction with state
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!schemeData) {
    return <div>No scheme data available</div>;
  }

  // Check if the scheme is already registered by the user
  const isRegistered = registeredSchemes.some(scheme => scheme.scheme_id === id);

  return (
    <div className="table-container">
      <h1>{schemeData.name}</h1>
      <table className="scheme-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Name</td><td>{schemeData.name}</td></tr>
          <tr><td>Description</td><td>{schemeData.description}</td></tr>
          <tr><td>Target Audience</td><td>{schemeData.target_audience}</td></tr>
          <tr>
          <td>Monthly Contribution</td>
          <td>₹{schemeData.investment_plan?.monthly_contribution}</td>
          </tr>
          <tr>
          <td>Chit Period</td>
          <td>{schemeData.investment_plan?.chit_period} months</td>
          </tr>
          <tr>
          <td>Total Fund Value</td>
          <td>₹{schemeData.investment_plan?.total_fund_value?.[0]?.value}</td>
          </tr>
          <tr>
            <td>Benefits</td>
            <td>
              <ul>
                {schemeData.benefits?.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Show Register button only if not already registered */}
      {!isRegistered ? (
        <div className="button-container">
          <button className="register-button" onClick={handleRegisterClick}>Register for Scheme</button>
        </div>
      ) : (
        // Show View Auction History button if the scheme is registered
        <div className="button-container">
          <button className="view-history-button" onClick={handleViewHistoryClick}>View Auction History</button>
        </div>
      )}

      {isDialogOpen && (
        <RegisterDialog 
          onClose={closeDialog}
          schemeId={id}
          username={username}
        />
      )}
    </div>
  );
};

export default MorePageComponent;
