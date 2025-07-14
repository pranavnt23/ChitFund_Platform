import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './DashBoard/DashBoard';
import AddScheme from './AddScheme/AddScheme';
import DeleteScheme from './DeleteScheme/DeleteScheme';
import ModifyScheme from './ModifyScheme/ModifyScheme';
import ViewCustomer from './ViewCustomer/ViewCustomer';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (loginUsername) => {
    setIsLoggedIn(true);
    setUsername(loginUsername);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/add-scheme"
            element={isLoggedIn ? <AddScheme /> : <Navigate to="/" />}
          />
          <Route
            path="/delete-scheme"
            element={isLoggedIn ? <DeleteScheme /> : <Navigate to="/" />}
          />
          <Route
            path="/modify-scheme"
            element={isLoggedIn ? <ModifyScheme /> : <Navigate to="/" />}
          />
          <Route
            path="/view-customer"
            element={isLoggedIn ? <ViewCustomer /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
