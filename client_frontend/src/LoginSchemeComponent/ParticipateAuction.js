import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ParticipateAuction.css';

const ParticipateAuction = () => {
  const { schemeId, username } = useParams();
  const navigate = useNavigate();

  const [auctionData, setAuctionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/auction/user-auction/${username}/${schemeId}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch auction data (status ${res.status})`);
        }
        const data = await res.json();
        setAuctionData(data);
      } catch (err) {
        setError(err.message || 'Error fetching auction data');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionData();
  }, [schemeId, username]);

  const handleBack = () => {
    navigate(`/login/${username}`);
  };

  const handleBidChange = (e) => {
    setBidAmount(e.target.value);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // Adjusted to call GET route with bid amount as URL param
  const handleBidSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setSubmitError('Please enter a valid positive bid amount');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auction/user-auction/${username}/${schemeId}/${amount}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit bid');
      }

      setSubmitSuccess('Bid submitted successfully!');
      setBidAmount('');
    } catch (err) {
      setSubmitError(err.message || 'Error submitting bid');
    }
  };

  if (loading) return <div className="loading">Loading auction data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="participate-auction-container">
      <h2>Participate in Auction</h2>
      <p><strong>User:</strong> {username}</p>
      <p><strong>Scheme:</strong> {auctionData?.scheme_name || schemeId}</p>
      {auctionData ? (
        <div className="auction-details">
          <h3>Auction Info</h3>
          <p><strong>Status:</strong> {auctionData.auction_status}</p>
          <p><strong>Months Left:</strong> {auctionData.auction_left_months}</p>
          <p><strong>Slot ID:</strong> {auctionData.slot_id}</p>
          <div>
            <h4>Auction Rounds:</h4>
            <ul>
              {auctionData.auction_details && auctionData.auction_details.length > 0 ? (
                auctionData.auction_details.map((round, index) => (
                  <li key={index}>
                    Start: {new Date(round.auction_start_timestamp).toLocaleString()}
                    {round.auction_end_timestamp ? ` - End: ${new Date(round.auction_end_timestamp).toLocaleString()}` : ''}
                  </li>
                ))
              ) : (
                <li>No auction rounds started yet.</li>
              )}
            </ul>
          </div>
          <div className="bid-section">
            <label htmlFor="bidAmount">Enter your bid amount:</label>
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={handleBidChange}
              placeholder="Enter a positive number"
              min="1"
            />
            <button onClick={handleBidSubmit}>Submit Bid</button>
            {submitError && <p className="submit-error">{submitError}</p>}
            {submitSuccess && <p className="submit-success">{submitSuccess}</p>}
          </div>
        </div>
      ) : (
        <p>No auction data available.</p>
      )}
      <button className="back-button" onClick={handleBack}>
        Back to Schemes
      </button>
    </div>
  );
};

export default ParticipateAuction;
