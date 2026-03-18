import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function SelectAvatar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');

  const avatars = [
    { id: 'male', emoji: '👦', label: '男生小人', color: '#4A90E2' },
    { id: 'female', emoji: '👧', label: '女生小人', color: '#E94B8C' },
  ];

  const handleNext = () => {
    if (selected) {
      navigate('/select-action', { state: { avatar: selected } });
    }
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1>选择你的道歉小人</h1>
      <h2>选择一个代表你的形象</h2>

      <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
        {avatars.map((avatar, index) => (
          <motion.div
            key={avatar.id}
            className={`card ${selected === avatar.id ? 'selected' : ''}`}
            onClick={() => setSelected(avatar.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{ fontSize: '60px', marginBottom: '10px' }}>
              {avatar.emoji}
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: selected === avatar.id ? avatar.color : '#333'
            }}>
              {avatar.label}
            </div>
          </motion.div>
        ))}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleNext}
        disabled={!selected}
      >
        下一步
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => navigate('/')}
      >
        返回
      </button>
    </motion.div>
  );
}

export default SelectAvatar;
