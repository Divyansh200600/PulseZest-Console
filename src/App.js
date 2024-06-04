import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginFormPage from './pages/loginFormPage';
import 'react-toastify/dist/ReactToastify.css';
import Db from './pages/dbPage';
import { ProtectedRoute, PublicRoute } from './utils/ProtectedRoute';

function App() {
  return (
    <Router>
      
    <Routes>
    
      <Route path="/" element={<PublicRoute element={LoginFormPage} />} />
      <Route path="/login" element={<PublicRoute element={LoginFormPage} />} />
      <Route path="/db" element={<ProtectedRoute element={Db} />} />
    </Routes>
  </Router>
  );
}

export default App;
