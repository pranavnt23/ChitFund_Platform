import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubAdminLogin from './subAdminLogin/subAdminLogin';  

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubAdminLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
