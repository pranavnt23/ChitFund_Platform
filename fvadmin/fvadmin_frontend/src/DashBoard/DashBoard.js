import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './DashBoard.css';

import Schemes from '../Schemes/Schemes';
import ViewCustomer from '../ViewCustomer/ViewCustomer';
import SubAdmin from '../SubAdmin/SubAdmin';
import GroupSlot from '../GroupSlot/GroupSlot';
import Auction from '../Auction/Auction'; 

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
            <li><Link to="schemes"><button>Schemes</button></Link></li>
            <li><Link to="subadmin"><button>SubAdmin</button></Link></li>
            <li><Link to="groupslot"><button>Group Slot</button></Link></li>
            <li><Link to="auction"><button>Auction</button></Link></li>
            <li><Link to="auction-history"><button>Auction History</button></Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="view-customer" element={<ViewCustomer />} />
            <Route path="schemes/*" element={<Schemes />} />
            <Route path="subadmin/*" element={<SubAdmin />} />
            <Route path="groupslot/*" element={<GroupSlot />} /> 
            <Route path="auction" element={<Auction />} />
            <Route path="auction-history" element={<AuctionHistory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AuctionHistory = () => (
  <div className="content-container">
    <h2>Auction History</h2>
    <p>Auction history content goes here.</p>
  </div>
);

export default Dashboard;
