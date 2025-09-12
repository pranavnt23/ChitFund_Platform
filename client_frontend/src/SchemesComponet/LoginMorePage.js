import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './MorePage.css';
import RegisterDialog from './RegisterScheme';

const MorePageComponent = () => {
  const { id, username } = useParams();
  const location = useLocation();
  const registeredSchemes = location.state?.registeredSchemes || [];
  const navigate = useNavigate();

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
    navigate(`/user-auction-history/${username}/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!schemeData) return <div>No scheme data available</div>;

  // Robust scheme ID comparison for isRegistered
  const isRegistered = registeredSchemes.some((scheme) => {
    const schemeIdStr =
      scheme.scheme_id && typeof scheme.scheme_id === 'object'
        ? scheme.scheme_id._id?.toString() || scheme.scheme_id.toString()
        : scheme.scheme_id?.toString();
    return schemeIdStr === id;
  });

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
          <tr>
            <td>Name</td>
            <td>{schemeData.name}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{schemeData.description}</td>
          </tr>
          <tr>
            <td>Target Audience</td>
            <td>{schemeData.target_audience}</td>
          </tr>
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

      {!isRegistered ? (
        <div className="button-container">
          <button className="register-button" onClick={handleRegisterClick}>
            Register for Scheme
          </button>
        </div>
      ) : (
        <div className="button-container">
          <button className="register-button" onClick={handleViewHistoryClick}>
            View Auction History
          </button>
        </div>
      )}

      {isDialogOpen && <RegisterDialog onClose={closeDialog} schemeId={id} username={username} />}
    </div>
  );
};

export default MorePageComponent;
