import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './DashBoard.css';

import AddScheme from '../AddScheme/AddScheme';
import DeleteScheme from '../DeleteScheme/DeleteScheme';
import ViewCustomer from '../ViewCustomer/ViewCustomer';
import ModifyScheme from '../ModifyScheme/ModifyScheme';
import SubGroup from '../SubGroup/SubGroup';

const Dashboard = ({ username, onLogout }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/images/FundLogo-removebg-preview.png" alt="FundVerse Logo" className="fundverse-logo" />
            <h1>FUNDVERSE</h1>
          </div>

          <div className="user-controls">
            <span>Welcome, {username}!</span>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="sidebar">
          <ul>
            <li><Link to="view-customer"><button>View Customer</button></Link></li>
            <li><Link to="add-scheme"><button>Add Scheme</button></Link></li>
            <li><Link to="delete-scheme"><button>Delete Scheme</button></Link></li>
            <li><Link to="modify-scheme"><button>Modify Scheme</button></Link></li>
            <li><Link to="subgroup"><button>SubGroup</button></Link></li>
            <li><Link to="auction"><button>Auction</button></Link></li>
            <li><Link to="auction-history"><button>Auction History</button></Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="view-customer" element={<ViewCustomer />} />
            <Route path="add-scheme" element={<AddScheme />} />
            <Route path="delete-scheme" element={<DeleteScheme />} />
            <Route path="modify-scheme" element={<ModifyScheme />} />
            <Route path="subgroup/*" element={<SubGroup />} />
            <Route path="auction" element={<Auction />} />
            <Route path="auction-history" element={<AuctionHistory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Auction = () => (
  <div className="content-container">
    <h2>Auction</h2>
    <p>Auction content goes here.</p>
  </div>
);

const AuctionHistory = () => (
  <div className="content-container">
    <h2>Auction History</h2>
    <p>Auction history content goes here.</p>
  </div>
);

export default Dashboard;
