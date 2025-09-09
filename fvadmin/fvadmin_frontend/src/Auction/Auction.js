import React, { useState } from 'react';
import './Auction.css';
import StartAuction from './startAuction';
import LiveAuction from './liveAuction';

const Auction = () => {
  const [activeSection, setActiveSection] = useState('start'); // default to start auction

  return (
    <div className="auction-container">
      <h1 className="auction-header">Auction Module</h1>

      <div className="auction-nav">
        <button onClick={() => setActiveSection('start')}>▶️ Start Auction</button>
        <button onClick={() => setActiveSection('live')}>🔴 Live Auction</button>
      </div>

      <div className="auction-content">
        {activeSection === 'start' && <StartAuction />}
        {activeSection === 'live' && <LiveAuction />}
      </div>
    </div>
  );
};

export default Auction;
