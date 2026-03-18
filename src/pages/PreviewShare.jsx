import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

function encodeText(text) {
  return encodeURIComponent(String(text || ''));
}

function PreviewShare() {
  const location = useLocation();
  const { apology = '' } = location.state || {};
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = Math.random().toString(36).substring(7);
    const url = `${window.location.origin}/view/${id}?t=${encodeText(apology)}`;
    setShareUrl(url);

    // 把分享内容存下来（无后端时用 localStorage 模拟）
    try {
      localStorage.setItem(
        `apologyShare:${id}`,
        JSON.stringify({
          apology,
          createdAt: Date.now(),
          version: 1,
        })
      );
    } catch (e) {
      // ignore
    }
  }, [apology]) 

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="container previewApology"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="previewApology-header">
        <h1 className="previewApology-title">道歉信预览</h1>
        <p className="previewApology-subtitle">确认无误后分享给对方</p>
      </div>

      <div className="previewApology-card">
        <div className="previewApology-aiBadge">最终内容</div>
        <div className="previewApology-content">
          {apology.split('\n').map((p, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={idx} className={idx === 0 ? 'first' : ''}>
              {p}
            </p>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 15,
            color: '#333',
          }}
        >
          分享给对方
        </div>

        <div
          style={{
            display: 'inline-block',
            padding: 20,
            background: 'white',
            borderRadius: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: 20,
          }}
        >
          <QRCodeCanvas value={shareUrl} size={200} />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <input
            type="text"
            value={shareUrl}
            readOnly
            style={{
              flex: 1,
              padding: 12,
              fontSize: 14,
              background: '#f5f5f5',
            }}
          />
          <button
            className="btn btn-primary"
            onClick={handleCopy}
            style={{ width: 'auto', padding: '12px 24px' }}
          >
            {copied ? '已复制!' : '复制'}
          </button>
        </div>

        <div
          style={{
            fontSize: 12,
            color: '#999',
            marginTop: 10,
          }}
        >
          扫码或复制链接分享给对方
        </div>
      </div>
    </motion.div>
  );
}

export default PreviewShare;
