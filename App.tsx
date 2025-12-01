import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './src/pages/Home';
import { Admin } from './src/pages/Admin';
import { Groups } from './src/pages/Groups';
import { Ministrations } from './src/pages/Ministrations';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/ministrations" element={<Ministrations />} />
      </Routes>
    </Router>
  );
};

export default App;
