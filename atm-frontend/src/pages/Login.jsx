import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fingerprint, Lock, ShieldCheck, AlertCircle, ArrowRight, X } from 'lucide-react';
import { authService } from '../services/api';

const Login = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (accountNumber.length < 1) return setError('Enter account number');
    if (pin.length < 4) return setError('PIN must be 4 digits');
    
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(accountNumber, pin);
      localStorage.setItem('atm_token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Vault access denied');
    } finally {
      setLoading(false);
    }
  };

  const handleNumberClick = (num) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  return (
    <div className="flex-center" style={{ height: '100%', padding: '10px 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="stack"
        style={{ width: '100%', maxWidth: '340px' }}
      >
        <div className="text-center stack" style={{ gap: '6px' }}>
          <div className="flex-center" style={{ marginBottom: '8px' }}>
            <div className="glass-panel flex-center" style={{ width: '60px', height: '60px', borderRadius: '18px', padding: 0, background: 'white' }}>
              <Lock size={28} className="highlight" />
            </div>
          </div>
          <h2 className="h2">Verify Access</h2>
          <p className="p">Secure credentials required</p>
        </div>

        <div className="stack" style={{ marginTop: '10px', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Fingerprint size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
            <input 
              type="text" 
              placeholder="Account Number" 
              className="glass-panel" 
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              style={{ paddingLeft: '48px', width: '100%', height: '55px', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <div className="stack" style={{ gap: '12px' }}>
            <div className="flex-center" style={{ gap: '12px', height: '24px' }}>
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={pin.length > i ? { scale: 1.2 } : { scale: 1 }}
                  style={{ 
                    width: '14px', 
                    height: '14px', 
                    borderRadius: '50%', 
                    background: pin.length > i ? 'var(--primary)' : 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid var(--primary-glow)'
                  }} 
                />
              ))}
            </div>
            
            <div className="keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((key) => (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (key === 'C') setPin('');
                    else if (key === 'OK') handleLogin();
                    else handleNumberClick(key.toString());
                  }}
                  className="key"
                  style={key === 'OK' ? { background: 'var(--primary)', color: 'white' } : {}}
                >
                  {key === 'OK' ? <ArrowRight size={20} /> : key}
                </motion.button>
              ))}
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              style={{ padding: '12px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--error)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(239, 68, 68, 0.1)' }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <motion.button 
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="btn-crystal" 
            style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}
          >
            {loading ? 'Authenticating...' : 'Authorize Access'}
          </motion.button>
        </div>

        <button 
          onClick={() => navigate('/register')} 
          style={{ background: 'none', color: 'var(--text-mute)', fontSize: '0.9rem', marginTop: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Fingerprint size={16} className="highlight" />
          Enroll New Profile
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
