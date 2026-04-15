import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, ChevronRight } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="flex-center" style={{ height: '100%' }}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="stack text-center"
        style={{ width: '100%', maxWidth: '340px' }}
      >
        <motion.div variants={itemVariants} className="flex-center" style={{ position: 'relative', marginBottom: '10px' }}>
          <div className="glass-panel shimmer" style={{ borderRadius: '50%', padding: '32px', background: 'white', border: '1px solid var(--primary-glow)', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}>
             <CreditCard size={64} color="var(--primary)" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stack" style={{ gap: '8px' }}>
          <h1 className="h1">
            <span className="highlight">Crystal</span> Vault
          </h1>
          <p className="p">Secure Digital Asset Management</p>
        </motion.div>

        <motion.div variants={itemVariants} className="stack" style={{ marginTop: '30px', gap: '12px' }}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')} 
            className="btn-crystal" 
            style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}
          >
            Access Vault
            <ChevronRight size={20} />
          </motion.button>
          
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/register')} 
            style={{ width: '100%', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '18px', padding: '16px', fontWeight: 'bold' }}
          >
            Create Account
          </motion.button>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="flex-center" 
          style={{ marginTop: '30px', gap: '20px', color: 'var(--text-mute)', fontSize: '0.75rem', fontWeight: '600' }}
        >
          <div className="flex-center" style={{ gap: '6px' }}>
            <Shield size={14} className="highlight" />
            End-to-End Encryption
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
