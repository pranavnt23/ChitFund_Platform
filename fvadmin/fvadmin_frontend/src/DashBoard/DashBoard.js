import React, { useState } from 'react';
import './DashBoard.css';
import AddScheme from '../AddScheme/AddScheme';
import DeleteScheme from '../DeleteScheme/DeleteScheme';
import ViewCustomer from '../ViewCustomer/ViewCustomer';
import ModifyScheme from '../ModifyScheme/ModifyScheme'; // <-- Add this line

const Dashboard = ({ username, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('view-customer');

  const renderContent = () => {
    switch (currentPage) {
      case 'view-customer':
        return <ViewCustomer />;
      case 'add-scheme':
        return <AddScheme />;
      case 'delete-scheme':
        return <DeleteScheme />;
      case 'modify-scheme':
        return <ModifyScheme />;
      case 'auction':
        return <Auction />;
      case 'auction-history':
        return <AuctionHistory />;
      default:
        return <ViewCustomer />;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          {/* Logo and Text */}
          <div className="logo-container">
            <img src="/images/FundLogo-removebg-preview.png" alt="FundVerse Logo" className="fundverse-logo" />
            <h1>FUNDVERSE</h1>
          </div>

          {/* User Info */}
          <div className="user-controls">
            <span>Welcome, {username}!</span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="sidebar">
          <ul>
            <li>
              <button
                onClick={() => setCurrentPage('view-customer')}
                className={currentPage === 'view-customer' ? 'active' : ''}
              >
                View Customer
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('add-scheme')}
                className={currentPage === 'add-scheme' ? 'active' : ''}
              >
                Add Scheme
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('delete-scheme')}
                className={currentPage === 'delete-scheme' ? 'active' : ''}
              >
                Delete Scheme
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('modify-scheme')}
                className={currentPage === 'modify-scheme' ? 'active' : ''}
              >
                Modify Scheme
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('auction')}
                className={currentPage === 'auction' ? 'active' : ''}
              >
                Auction
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('auction-history')}
                className={currentPage === 'auction-history' ? 'active' : ''}
              >
                Auction History
              </button>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Dummy Components for Other Pages
const Auction = () => (
  <div className="content-container">
    <h2>Auction</h2>
    <div>Auction Content</div>
  </div>
);

const AuctionHistory = () => (
  <div className="content-container">
    <h2>Auction History</h2>
    <div>Auction History Content</div>
  </div>
);

export default Dashboard;
