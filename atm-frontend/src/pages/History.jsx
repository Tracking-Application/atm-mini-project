import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History as HistoryIcon, ArrowUpRight, ArrowDownLeft, Calendar, Search, Filter } from 'lucide-react';
import { accountService } from '../services/api';

const History = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await accountService.getTransactions();
      setData(result);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex-center" style={{ height: '100%' }}>
       <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: '40px', height: '40px', border: '3px solid rgba(59, 130, 246, 0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
      />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="stack" 
      style={{ paddingBottom: '20px', height: '100%', overflow: 'hidden' }}
    >
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', background: 'white' }}>
        <div>
          <h2 className="h2"><span className="highlight">Audit</span> Ledger</h2>
          <p className="p" style={{ fontSize: '0.8rem' }}>Vault Account: {data?.account_number}</p>
        </div>
        <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary)', color: 'white', boxShadow: '0 8px 15px var(--primary-glow)' }}>
          <HistoryIcon size={24} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-mute)', letterSpacing: '0.5px' }}>TRANSACTION ACTIVITY</span>
          <Filter size={14} color="var(--primary)" />
      </div>

      <div className="stack" style={{ gap: '10px', flex: 1, overflowY: 'auto', paddingRight: '4px', maxHeight: '520px' }}>
        {data?.transactions.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '60px', background: 'white' }}>
            <Search size={40} color="var(--text-mute)" style={{ marginBottom: '12px' }} />
            <p className="p">No ledger entries found.</p>
          </div>
        ) : (
          data?.transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass-panel glass-interactive"
              style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '16px', background: 'white' }}
            >
              <div style={{ 
                background: tx.transaction_type === 'deposit' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', 
                padding: '10px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${tx.transaction_type === 'deposit' ? 'var(--success)' : 'var(--error)'}11`
              }}>
                {tx.transaction_type === 'deposit' ? 
                  <ArrowDownLeft size={18} color="var(--success)" /> : 
                  <ArrowUpRight size={18} color="var(--error)" />
                }
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)', textTransform: 'capitalize' }}>
                    {tx.transaction_type}
                  </div>
                  <div style={{ 
                    fontWeight: '800', 
                    fontSize: '1.1rem', 
                    color: tx.transaction_type === 'deposit' ? 'var(--success)' : 'var(--error)' 
                  }}>
                    {tx.transaction_type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-mute)', fontSize: '0.75rem', fontWeight: '600' }}>
                      <Calendar size={12} />
                      {new Date(tx.created_at).toLocaleDateString()}
                   </div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>
                     Balance: ${tx.balance_after.toLocaleString()}
                   </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* Visual Fade Indicator for scroll */}
      <div style={{ height: '30px', background: 'linear-gradient(to top, var(--bg-shell), transparent)', position: 'absolute', bottom: 0, left: 0, right: 0, pointerEvents: 'none', borderRadius: '0 0 44px 44px' }} />
    </motion.div>
  );
};

export default History;
