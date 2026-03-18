import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import catLogo from '../assets/home-logo.png';
import pawImg from '../assets/paw-btn.png';

function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="container home-cute"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.12, type: 'spring', stiffness: 220, damping: 16 }}
        style={{ textAlign: 'center', marginBottom: '14px' }}
      >
        <div className="home-logoWrap">
          <img className="home-logo" src={catLogo} alt="道歉喵" />
        </div>
      </motion.div>

      <motion.h1
        className="home-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
      >
        道歉喵
      </motion.h1>

      <motion.h2
        className="home-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
      >
        喵喵喵～别生气了嘛 🐾
      </motion.h2>

      <motion.p
        className="home-slogan"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26 }}
      >
        做错事了，不知道怎么开口？<br />
        让小猫咪帮你说出那句&quot;对不起&quot;吧～
      </motion.p>

      <motion.button
        className="btn home-pawBtnImage"
        onClick={() => navigate('/edit-apology')}
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        <img src={pawImg} alt="开始创建道歉信" className="home-pawImg" />
      </motion.button>

      <div className="home-pawHint">点击猫爪开始创建道歉信</div>

      <motion.div
        className="home-features"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
      >
        <div className="home-featuresTitle">✨ 特色功能 ✨</div>
        <ul className="home-featuresList">
          <li>🐱 可爱猫咪帮你认错</li>
          <li>🎨 AI润色让道歉更走心</li>
          <li>📱 轻松分享给TA查看</li>
          <li>💕 收到反馈才算和好哦</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default Home;