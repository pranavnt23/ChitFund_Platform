import React from 'react';
import './AuctionHistory.css'; // Import your CSS file for styling

const AuctionHistory = () => {
    const auctionData = [
        // Sample data for user auction history
        {
            month: 'January 2024',
            rounds: [
                { id: 1, date: '2024-01-05', time: '10:00 AM', amount: 15000 },
                { id: 2, date: '2024-01-12', time: '11:15 AM', amount: 20000 },
                { id: 3, date: '2024-01-19', time: '02:30 PM', amount: 18000 },
            ],
            status: 'Won', // Cumulative status for the month
            winningBid: 20000, // Highest bid amount for the month
            paymentStatus: 'Not Paid', // Overall payment status
            monthlyInstallment: 5000 // Monthly installment amount
        },
        {
            month: 'February 2024',
            rounds: [
                { id: 1, date: '2024-02-02', time: '09:00 AM', amount: 25000 },
                { id: 2, date: '2024-02-15', time: '10:30 AM', amount: 27000 },
                { id: 3, date: '2024-02-22', time: '01:00 PM', amount: 22000 },
            ],
            status: 'Lost', // Cumulative status for the month
            winningBid: 0, // No winning bid for the month
            paymentStatus: 'Not Paid', // Overall payment status
            monthlyInstallment: 5000 // Monthly installment amount
        },
        // Add more months and rounds as needed...
    ];

    return (
        <div className="auction-history-container">
            <h2>User Auction History</h2>
            {auctionData.map((monthData, monthIndex) => {
                const totalBiddedAmount = monthData.rounds.reduce((total, round) => total + round.amount, 0);

                return (
                    <div key={monthIndex} className="monthly-history">
                        <h3>{monthData.month}</h3>
                        <table className="auction-history-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Amount Bidded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthData.rounds.map((round, roundIndex) => (
                                    <tr key={round.id}>
                                        <td>{roundIndex + 1}</td>
                                        <td>{round.date}</td>
                                        <td>{round.time}</td>
                                        <td>₹{round.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="monthly-summary">
                            <p><strong>Total Amount Bidded:</strong> ₹{totalBiddedAmount}</p>
                            <p><strong>Status:</strong> {monthData.status}</p>
                            {monthData.status === 'Won' && (
                                <p><strong>Bidded Amount:</strong> ₹{monthData.winningBid}</p>
                            )}
                            <p><strong>Payment Status:</strong> {monthData.paymentStatus}</p>
                            <p><strong>Monthly Installment:</strong> ₹{monthData.monthlyInstallment}</p>
                            {monthData.paymentStatus === 'Not Paid' && (
                                <button className="payment-button">Pay Now</button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AuctionHistory;
