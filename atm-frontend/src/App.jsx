import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages...
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import Deposit from './pages/Deposit';
import History from './pages/History';

const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function AppContent() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="atm-shell"
    >
      <Navbar />
      <div className="shell-content">
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/withdraw" element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            } />
            
            <Route path="/deposit" element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageWrapper>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
