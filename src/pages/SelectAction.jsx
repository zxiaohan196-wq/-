import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function SelectAction() {
  const navigate = useNavigate();
  const location = useLocation();
  const { avatar } = location.state || {};
  const [selected, setSelected] = useState('');

  const actions = [
    { id: 'kneel', emoji: '🧎', label: '下跪道歉', desc: '最诚恳的姿态' },
    { id: 'bow', emoji: '🙇', label: '鞠躬道歉', desc: '深深的歉意' },
    { id: 'pray', emoji: '🙏', label: '合十祈求', desc: '请求原谅' },
    { id: 'cry', emoji: '😭', label: '痛哭流涕', desc: '真诚的悔意' },
    { id: 'facepalm', emoji: '🤦', label: '自责懊悔', desc: '都怪我' },
    { id: 'flower', emoji: '💐', label: '献花致歉', desc: '送上心意' },
  ];

  const handleNext = () => {
    if (selected) {
      navigate('/edit-apology', { 
        state: { avatar, action: selected } 
      });
    }
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1>选择道歉姿势</h1>
      <h2>选一个最能表达你心意的</h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            className={`card ${selected === action.id ? 'selected' : ''}`}
            onClick={() => setSelected(action.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>
              {action.emoji}
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              {action.label}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#999'
            }}>
              {action.desc}
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
        onClick={() => navigate('/select-avatar')}
      >
        返回
      </button>
    </motion.div>
  );
}

export default SelectAction;
