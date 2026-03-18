import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import catLogo from '../assets/home-logo.png';
import pawImg from '../assets/paw-btn.png';

function ApologyCertificate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { apology = '' } = location.state || {};
  const [saving, setSaving] = useState(false);
  const certRef = useRef(null);

  const paragraphs = useMemo(() => {
    const text = String(apology || '').trim();
    if (!text) return ['（没有读取到道歉信内容）'];
    return text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [apology]);

  const handleSaveImage = async () => {
    if (!certRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: null,
        scale: window.devicePixelRatio || 2,
        useCORS: true,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `道歉凭证-${Date.now()}.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="container certificate"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="certificate-header">
        <div className="certificate-catIcon">
          <img src={catLogo} alt="道歉喵" />
        </div>
        <h1 className="certificate-title">道歉凭证</h1>
        <p className="certificate-subtitle">保存下来，作为认真道歉的证明</p>
      </div>

      <div className="certificate-paper" ref={certRef}>
        <div className="certificate-content">
          {paragraphs.map((p, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={idx} className={idx === 0 ? 'first' : ''}>
              {p}
            </p>
          ))}
        </div>

        <div className="certificate-signLine">
          <span className="certificate-signText">我承诺下次不再犯错</span>
          <img className="certificate-pawStamp" src={pawImg} alt="猫爪印" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          返回上一页
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSaveImage} disabled={saving}>
          {saving ? '正在保存…' : '保存为图片'}
        </button>
      </div>
    </motion.div>
  );
}

export default ApologyCertificate;

