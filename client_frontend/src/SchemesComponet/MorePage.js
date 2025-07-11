import React, { useState } from 'react';
import './MorePage.css';
import RegisterDialog from './RegisterScheme';
import Auction from './Auction'; // Import Auction component
import AuctionHistory from './AuctionHistory'; // Import AuctionHistory component

const MorePage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAuctionVisible, setAuctionVisible] = useState(false); // State for auction visibility
  const [isAuctionHistoryVisible, setAuctionHistoryVisible] = useState(false); // State for auction history visibility
  const [isLoading, setLoading] = useState(false); // State for loading

  const handleRegisterClick = () => {
    setDialogOpen(true); // Open the register dialog
  };

  const closeDialog = () => {
    setDialogOpen(false); // Close the dialog
    setLoading(true); // Start loading
    // Simulate an API call with a timeout
    setTimeout(() => {
      setAuctionVisible(true); // Show the Auction component
      setAuctionHistoryVisible(true); // Show the AuctionHistory component
      setLoading(false); // End loading
    }, 1000); // Adjust time as necessary
  };

  const schemeData = {
    name: "Gold Savings Scheme",
    description: "Members contribute a fixed amount monthly to accumulate gold or cash equivalent at the end of the chit period.",
    target_audience: "Individuals seeking stable, long-term savings in gold.",
    investment_plan: {
      monthly_contribution: { min: 10000, max: 50000 },
      chit_period: { min: 12, max: 36 },
      total_fund_value: [
        { duration: 12, min_value: 120000, max_value: 600000 },
        { duration: 36, min_value: 360000, max_value: 1800000 }
      ]
    },
    benefits: [
      "Redeemable in gold bars or coins, or in cash based on market rates.",
      "Option for early withdrawal or purchase from partnered jewelers at discounted rates."
    ]
  };

  return (
    <div>
      <div className="table-container">
        <h1>FUNDVERSE SCHEMES</h1>
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
              <td>₹{schemeData.investment_plan.monthly_contribution.min} - ₹{schemeData.investment_plan.monthly_contribution.max}</td>
            </tr>
            <tr>
              <td>Chit Period</td>
              <td>{schemeData.investment_plan.chit_period.min} - {schemeData.investment_plan.chit_period.max} months</td>
            </tr>
            <tr>
              <td>Total Fund Value (12 months)</td>
              <td>₹{schemeData.investment_plan.total_fund_value[0].min_value} - ₹{schemeData.investment_plan.total_fund_value[0].max_value}</td>
            </tr>
            <tr>
              <td>Total Fund Value (36 months)</td>
              <td>₹{schemeData.investment_plan.total_fund_value[1].min_value} - ₹{schemeData.investment_plan.total_fund_value[1].max_value}</td>
            </tr>
            <tr>
              <td>Benefits</td>
              <td>
                <ul>
                  {schemeData.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="button-container">
          <button className="register-button" onClick={handleRegisterClick}>Register</button>
        </div>

        {/* Render the RegisterDialog if it's open */}
        {isDialogOpen && <RegisterDialog onClose={closeDialog} />}
      </div>

      {/* Render both Auction and AuctionHistory components or loading message */}
      {isLoading ? (
        <p>Loading auction and auction history...</p>
      ) : (
        <>
          {isAuctionVisible && <Auction />}
          {isAuctionHistoryVisible && <AuctionHistory />}
        </>
      )}
    </div>
  );
};

export default MorePage;
