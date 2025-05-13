import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SidebarLayout from './SidebarLayout';
import Login from './Login';
import Register from './Register';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import VerifyEmail from './VerifyEmail';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(JSON.parse(user).email);
      }
    };

    checkLoginStatus();

    // Listen for changes in localStorage (logout from other tabs)
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserEmail('');
    window.localStorage.setItem('logout', Date.now()); // To trigger logout across other tabs
  };

  return (
    <Router>
      <Routes>
        {/* Default route redirects to Menu if logged in, otherwise to Login */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/menu" /> : <Navigate to="/login" />} />

        {/* Login and Register Routes */}
        <Route path="/login" element={<Login onLogin={setIsLoggedIn} />} />
        <Route path="/register" element={<Register onLogin={setIsLoggedIn} />} />
        <Route path="/verify-email" element={<VerifyEmail />} /> {/* Verification route */}

        {/* Sidebar layout for authenticated pages */}
        <Route path="/menu" element={isLoggedIn ? (
          <SidebarLayout onLogout={handleLogout} userEmail={userEmail}>
            <MenuManagement />
          </SidebarLayout>
        ) : <Navigate to="/login" />} />
        <Route path="/orders" element={isLoggedIn ? (
          <SidebarLayout onLogout={handleLogout} userEmail={userEmail}>
            <OrderManagement />
          </SidebarLayout>
        ) : <Navigate to="/login" />} />

        <Route path="/users" element={isLoggedIn ? (
          <SidebarLayout onLogout={handleLogout} userEmail={userEmail}>
            <UserManagement />
          </SidebarLayout>
        ) : <Navigate to="/login" />} />

        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product" element={<EditProduct />} />

        {/* Redirect any other routes to Login */}
      </Routes>
    </Router>
  );
}

export default App;
