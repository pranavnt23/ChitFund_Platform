import React, { useState } from 'react';
import './Auction.css'; // Ensure to import the CSS file

const Auction = () => {
  const nextAuctionDate = new Date(); // Example: current date
  nextAuctionDate.setHours(nextAuctionDate.getHours() + 24); // Set it to 24 hours later for demonstration

  const [biddingAmount, setBiddingAmount] = useState('');
  const [round, setRound] = useState(1); // Track the current round
  const [lowestBid, setLowestBid] = useState(null); // Track the lowest bid
  const [isWinner, setIsWinner] = useState(null); // Track if the user is the winner
  const [monthlyInstallment, setMonthlyInstallment] = useState(0); // Track monthly installment

  // Function to get a name based on the auction date
  const getAuctionName = (date) => {
    const hour = date.getHours();
    if (hour < 12) {
      return "Morning Auction";
    } else if (hour < 18) {
      return "Afternoon Auction";
    } else {
      return "Evening Auction";
    }
  };

  // Function to get the day name
  const getDayName = (date) => {
    const options = { weekday: 'long' }; // Options for day name
    return date.toLocaleDateString('en-US', options); // Get the day name
  };

  // Handle bidding input and logic
  const handleBidding = () => {
    const bid = parseInt(biddingAmount, 10);
    if (!isNaN(bid)) {
      // Update the lowest bid if necessary
      if (lowestBid === null || bid < lowestBid) {
        setLowestBid(bid);
      }

      // Move to the next round if we are not at round 3
      if (round < 3) {
        setRound(round + 1);
      } else {
        // Randomly decide if the user won in round 3
        const won = Math.random() < 0.5; // 50% chance to win for demonstration
        setIsWinner(won);
        setMonthlyInstallment(won ? Math.round(bid / 12) : 0); // Monthly installment if won
      }
    }
    setBiddingAmount(''); // Clear the input
  };

  return (
    <div className="auction-container">
      <h2>NEXT AUCTION</h2>
      
      {/* Flexbox container for date, day, and time */}
      <div className="auction-details">
        <p className="auction-item">Date: {nextAuctionDate.toLocaleDateString()}</p>
        <p className="auction-item">Day: {getDayName(nextAuctionDate)}</p>
        <p className="auction-item">Time: {nextAuctionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      
      <div className="bidding-status">
        <h3>AUCTION STATUS: Live</h3>
        <br></br>
        <p>Lowest Amount: ₹{lowestBid !== null ? lowestBid : 'N/A'}</p>
        <p>Bidding Round: {round}</p>
      </div>
      
      <input
        type="number"
        value={biddingAmount}
        onChange={(e) => setBiddingAmount(e.target.value)}
        placeholder="Enter your bidding amount"
        className="bidding-input"
      />
      <button onClick={handleBidding} className="bidding-button">BID</button>

      {round === 3 && isWinner !== null && (
        <div className="result">
          <h3>RESULT</h3>
          {isWinner ? (
            <>
              <p>Congratulations! You won!</p>
              <p>Winning amount: ₹{lowestBid} will be deposited in your account within 24 hours.</p>
              <p>Your Monthly Installment: ₹{monthlyInstallment}</p>
              <button className="pay-button">Pay Now</button>
            </>
          ) : (
            <>
              <p>Better luck next time!</p>
              <p>Your Monthly Installment: ₹{monthlyInstallment}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Auction;
