import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History as HistoryIcon, 
  Cpu,
  Wifi,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { accountService } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await accountService.getBalance();
      setData(result);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle, color: '#ef4444', path: '/withdraw', desc: 'Securely debit funds' },
    { id: 'deposit', label: 'Deposit', icon: ArrowDownCircle, color: '#10b981', path: '/deposit', desc: 'Add balance to vault' },
    { id: 'history', label: 'History', icon: HistoryIcon, color: 'var(--primary)', path: '/history', desc: 'View transaction logs' },
  ];

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="stack" 
      style={{ paddingBottom: '20px' }}
    >
      {/* VIBRANT CRYSTAL CARD */}
      <motion.div 
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        style={{ 
          height: '220px', 
          padding: '24px', 
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.3)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div 
           animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
           transition={{ duration: 10, repeat: Infinity }}
           style={{ position: 'absolute', top: -20, right: -20, width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)' }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="flex-center" style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
            <Cpu size={28} color="white" />
          </div>
          <Wifi size={22} color="white" style={{ transform: 'rotate(90deg)', opacity: 0.8 }} />
        </div>

        <div>
           <div style={{ fontSize: '0.7rem', fontWeight: '700', opacity: 0.8, letterSpacing: '1px', marginBottom: '4px' }}>AVAILABLE BALANCE</div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>$</span>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>
                {data?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
           </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: '700', opacity: 0.7, letterSpacing: '0.5px' }}>ACCOUNT HOLDER</div>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '1rem' }}>{data?.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: '700', opacity: 0.7, letterSpacing: '0.5px' }}>CARD NUMBER</div>
            <div style={{ fontWeight: '600', letterSpacing: '1px', fontSize: '0.9rem' }}>**** **** **** {data?.account_number.slice(-4)}</div>
          </div>
        </div>
      </motion.div>

      {/* Trust & Activity Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
        <div className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '6px', borderRadius: '8px' }}>
            <TrendingUp size={16} />
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: '700' }}>Healthy Activity</div>
        </div>
        <div className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px', borderRadius: '8px' }}>
            <ShieldCheck size={16} />
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: '700' }}>Device Secured</div>
        </div>
      </div>

      {/* Main Operations */}
      <div className="stack" style={{ marginTop: '10px', gap: '10px' }}>
        <div style={{ color: 'var(--text-mute)', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.5px', marginLeft: '4px' }}>OPERATIONS</div>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            className="glass-panel glass-interactive"
            style={{ 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              background: 'white', 
              padding: '12px', 
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              <item.icon size={22} color={item.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>{item.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-mute)' }}>{item.desc}</div>
            </div>
            <ChevronRight size={18} color="var(--text-mute)" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
