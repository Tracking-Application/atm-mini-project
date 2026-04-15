import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Hash, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    account_number: '',
    pin: '',
    opening_balance: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.pin.length !== 4) return setError('PIN must be 4 digits');
    
    setError('');
    setLoading(true);
    try {
      await authService.register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-center" style={{ height: '100%', padding: '10px 0' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="stack"
        style={{ width: '100%', maxWidth: '340px' }}
      >
        <div className="text-center stack" style={{ gap: '6px' }}>
          <div className="flex-center" style={{ marginBottom: '8px' }}>
            <div className="glass-panel flex-center" style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'white' }}>
              <UserPlus size={28} className="highlight" />
            </div>
          </div>
          <h2 className="h2">Create Profile</h2>
          <p className="p">Initialize your secure banking ID</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel flex-center stack" 
            style={{ padding: '30px 20px', marginTop: '10px', background: 'white' }}
          >
            <CheckCircle2 size={56} color="var(--success)" />
            <h3 style={{ marginTop: '16px', color: 'var(--success)', fontWeight: '800' }}>ENROLLED</h3>
            <p className="p text-center">Redirecting to login portal...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleRegister} className="stack" style={{ marginTop: '10px', gap: '12px' }}>
            <div className="stack" style={{ gap: '6px' }}>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input 
                  name="name"
                  type="text" 
                  placeholder="Full Name" 
                  className="glass-panel" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '48px', width: '100%', height: '52px', outline: 'none' }}
                />
              </div>
            </div>

            <div className="stack" style={{ gap: '6px' }}>
              <div style={{ position: 'relative' }}>
                <Hash size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input 
                  name="account_number"
                  type="text" 
                  maxLength={6}
                  placeholder="Account Number" 
                  className="glass-panel" 
                  value={formData.account_number}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '48px', width: '100%', height: '52px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="stack" style={{ gap: '6px' }}>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input 
                    name="pin"
                    type="password" 
                    maxLength={4}
                    placeholder="4-Digit PIN" 
                    className="glass-panel" 
                    value={formData.pin}
                    onChange={handleChange}
                    required
                    style={{ paddingLeft: '48px', width: '100%', height: '52px', outline: 'none' }}
                  />
                </div>
              </div>
              <div className="stack" style={{ gap: '6px' }}>
                <input 
                  name="opening_balance"
                  type="number" 
                  placeholder="Initial Dep" 
                  className="glass-panel" 
                  value={formData.opening_balance}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', height: '52px', outline: 'none' }}
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--error)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <motion.button 
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="btn-crystal" 
              style={{ width: '100%', padding: '18px', fontSize: '1.1rem', marginTop: '10px' }}
            >
              {loading ? 'Processing...' : 'Complete Enrollment'}
            </motion.button>
            
            <button 
              type="button"
              onClick={() => navigate('/login')} 
              style={{ background: 'none', color: 'var(--text-mute)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '700' }}
            >
              <ArrowLeft size={16} className="highlight" /> Return to Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
