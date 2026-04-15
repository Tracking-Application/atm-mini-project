import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownCircle, Wallet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { accountService } from '../services/api';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  useEffect(() => {
    accountService.getBalance()
      .then(res => setBalance(res.balance))
      .catch(() => navigate('/login'));
  }, []);

  const handleDeposit = async () => {
    const amtValue = parseFloat(amount);
    if (!amtValue || amtValue <= 0) return setStatus({ type: 'error', msg: 'Enter a valid amount' });

    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await accountService.deposit(amtValue);
      setBalance(res.balance);
      setAmount('');
      setStatus({ type: 'success', msg: `CREDIT SUCCESSFUL: $${amtValue}` });
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.detail || 'Transaction failed' });
    } finally {
      setLoading(false);
    }
  };

  const addDigit = (digit) => {
    if (amount.length < 9) setAmount(prev => prev + digit);
  };

  return (
    <div className="flex-center" style={{ height: '100%', padding: '10px 0' }}>
      <AnimatePresence>
        {status.type === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              zIndex: 5000, 
              background: 'rgba(255, 255, 255, 0.8)', 
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              textAlign: 'center',
              padding: '40px'
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              style={{ background: 'var(--success)', padding: '24px', borderRadius: '50%', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
            >
              <CheckCircle2 size={72} color="white" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 style={{ color: 'var(--success)', fontWeight: '800', fontSize: '2rem', letterSpacing: '-1px' }}>DEPOSIT COMPLETE</h1>
              <p className="p" style={{ fontSize: '1.1rem', marginTop: '10px' }}>Your assets have been secured.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="stack"
        style={{ width: '100%', maxWidth: '340px' }}
      >
        <div className="text-center stack" style={{ gap: '6px' }}>
          <div className="flex-center" style={{ marginBottom: '8px' }}>
            <div className="glass-panel flex-center" style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'white' }}>
              <ArrowDownCircle size={28} color="var(--success)" />
            </div>
          </div>
          <h2 className="h2">Vault Deposit</h2>
          <p className="p">Inject capital into your digital assets</p>
        </div>

        <div className="glass-panel" style={{ background: 'white', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-mute)', fontWeight: '800', letterSpacing: '0.5px' }}>CURRENT ASSETS</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                ${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
           </div>
           <Wallet size={20} color="var(--primary)" />
        </div>

        <div className="stack" style={{ marginTop: '10px', gap: '15px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70px', background: 'white', borderRadius: '20px', border: '1px dashed var(--primary-glow)' }}>
            <span style={{ position: 'absolute', left: '20px', fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '800' }}>$</span>
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1px' }}>
              {amount || '0.00'}
            </span>
            {amount && (
              <button 
                onClick={() => setAmount('')}
                style={{ position: 'absolute', right: '15px', color: 'var(--text-mute)', background: 'none' }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'DEL'].map((k) => (
              <motion.button
                key={k}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (k === 'DEL') setAmount(prev => prev.slice(0, -1));
                  else if (k === '.' && amount.includes('.')) return;
                  else addDigit(k.toString());
                }}
                className="key"
              >
                {k}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {status.type === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ 
                  color: 'var(--error)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  marginTop: '5px'
                }}
              >
                <AlertCircle size={16} />
                {status.msg}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeposit}
            className="btn-crystal" 
            style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}
          >
            {loading ? 'Processing...' : 'Authorize Deposit'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Deposit;
