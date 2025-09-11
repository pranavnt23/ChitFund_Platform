import React, { useEffect, useState } from 'react';
import './liveAuction.css';

const LiveAuction = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dispauction/auctions');
        if (!response.ok) throw new Error('Failed to fetch auctions');
        const data = await response.json();
        setAuctions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  return (
    <div className="live-auction-container">
      <h2>Live Auctions</h2>
      {loading && <p className="info">Loading auctions...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && auctions.length === 0 && (
        <p className="info">No ongoing auctions at the moment.</p>
      )}
      <div className="auction-list">
        {auctions.map(auction => (
          <div key={auction.id} className={`auction-card ${auction.status === 'live' ? 'live' : ''}`}>
            <h3>Slot: {auction.slotId}</h3>
            <p>Status: <span className="status">{auction.status.toUpperCase()}</span></p>
            <p>Months Left: {auction.monthsLeft}</p>
            <p>Started On:</p>
            <ul>
              {auction.auctionDetails.map((detail, idx) => (
                <li key={idx}>
                  {new Date(detail.startTimestamp).toLocaleString()}
                </li>
              ))}
            </ul>
            <p className="timestamps">
              Created: {new Date(auction.createdAt).toLocaleString()}<br/>
              Updated: {new Date(auction.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveAuction;
