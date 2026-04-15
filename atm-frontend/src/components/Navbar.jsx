import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Home, ArrowLeft, Shield } from 'lucide-react';
import { authService } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) return null;

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{ 
        padding: '24px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--glass-border)',
        zIndex: 100,
        position: 'relative' /* IMPORTANT: Relative ensures it takes up space and sibling container sits below it */
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        {location.pathname !== '/dashboard' && (
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }} 
            style={{ width: '38px', height: '38px', background: 'white', color: 'var(--primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
          >
            <ArrowLeft size={18} />
          </motion.button>
        )}
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }} 
          style={{ width: '38px', height: '38px', background: 'white', color: 'var(--primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
        >
          <Home size={18} />
        </motion.button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '10px', boxShadow: '0 4px 10px var(--primary-glow)' }}>
          <Shield size={18} color="white" />
        </div>
        <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          VAULT
        </span>
      </div>

      <motion.button 
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }} 
        style={{ width: '38px', height: '38px', color: 'var(--error)', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
      >
        <LogOut size={18} />
      </motion.button>
    </motion.nav>
  );
};

export default Navbar;
