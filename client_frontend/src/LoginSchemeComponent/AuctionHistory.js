import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AuctionHistory.css';

const AuctionHistory = () => {
  const { username, schemeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/auction/user-auction-history/${username}/${schemeId}`);
        console.log('Response :',response)
        if (!response.ok) throw new Error('Failed to fetch auction history');
        const data = await response.json();
        setHistory(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [username, schemeId]);

  if (loading) return <div>Loading auction history...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!history) return <div>No auction history available.</div>;

  return (
    <div className="auction-history-container" style={{ padding: '20px', color: 'white' }}>
      <h2>
        Auction History - {history.scheme_name}
      </h2>
      <div>
        <strong>Months Completed:</strong> {history.months_completed}
      </div>
      <div>
        <strong>Has Won Bid:</strong> {history.has_won_bid ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Current Bid Status:</strong> {history.current_bid_status ? 'Active' : 'Inactive'}
      </div>
      <div>
        <strong>Current Bid Amount:</strong> {history.current_bid_amount}
      </div>

      <h3>Previous Bids:</h3>
      {history.bid_history.length === 0 ? (
        <p>No bid history available.</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', color: '#fff' }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Bid Made</th>
              <th>Bid Amount</th>
              <th>Timestamp</th>
              <th>Payment Made</th>
            </tr>
          </thead>
          <tbody>
            {history.bid_history.map((bid, idx) => (
              <tr key={idx}>
                <td>{bid.month}</td>
                <td>{bid.bid_made ? 'Yes' : 'No'}</td>
                <td>{bid.bid_amount}</td>
                <td>{new Date(bid.timestamp).toLocaleString()}</td>
                <td>{bid.payment_made ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
        Back
      </button>
    </div>
  );
};

export default AuctionHistory;
