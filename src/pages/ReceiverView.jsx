import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import catLogo from '../assets/home-logo.png';
import receiverVideo from '../assets/receiver.mp4';
import pawImg from '../assets/paw-btn.png';

function decodeText(text) {
  try {
    return decodeURIComponent(String(text || ''));
  } catch (e) {
    return '';
  }
}

function ReceiverView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const urlText = useMemo(() => {
    const params = new URLSearchParams(location.search || '');
    return decodeText(params.get('t'));
  }, [location.search]);

  const data = useMemo(() => {
    if (!id) return null;
    try {
      const raw = localStorage.getItem(`apologyShare:${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }, [id]);

  const finalApology = (data && data.apology) || urlText;

  if (!finalApology) {
    return (
      <motion.div
        className="container receiverView"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="receiverView-header">
          <div className="receiverView-catIcon">
            <img src={catLogo} alt="道歉喵" />
          </div>
          <h1 className="receiverView-title">这封道歉信找不到啦</h1>
          <p className="receiverView-subtitle">链接可能已过期或只在发送者设备上保存</p>
        </div>
        <div className="receiverView-card receiverView-empty">
          <div className="receiverView-emptyEmoji">📭</div>
          <div className="receiverView-emptyText">没有读到内容</div>
          <div className="receiverView-emptyHint">让对方重新生成分享链接再发一次吧～</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container receiverView"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="receiverView-header">
        <div className="receiverView-catIcon">
          <img src={catLogo} alt="道歉喵" />
        </div>
        <h1 className="receiverView-title">你收到一封道歉信</h1>
        <p className="receiverView-subtitle">咪替人来送一封道歉信</p>
      </div>

      <div className="receiverView-hero">
        <div className="receiverView-videoWrap">
          <video
            ref={videoRef}
            className="receiverView-video"
            src={receiverVideo}
            autoPlay
            muted={muted}
            playsInline
            onEnded={() => setEnded(true)}
          />

          {muted && (
            <button
              type="button"
              className="receiverView-audioBtn"
              onClick={async () => {
                setMuted(false);
                try {
                  if (videoRef.current) {
                    videoRef.current.muted = false;
                    // 需要一次用户手势触发播放，确保有声音
                    await videoRef.current.play();
                  }
                } catch (e) {
                  // ignore
                }
              }}
            >
              🔊 开启声音（推荐）
            </button>
          )}

          {ended && (
            <div className="receiverView-videoOverlay">
              <motion.button
                type="button"
                className="receiverView-pawBtn receiverView-pawBtnOverlay"
                onClick={() => navigate('/cat-show-received', { state: { apology: finalApology, shareId: id } })}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <img src={pawImg} alt="查看道歉信" className="receiverView-pawImg" />
              </motion.button>
              <motion.div
                className="receiverView-pawHint receiverView-pawHintOverlay"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
              >
                点击查看道歉信
              </motion.div>
            </div>
          )}
        </div>
        <div className="receiverView-heroHint">咪替人来送一封道歉信</div>
      </div>
    </motion.div>
  );
}

export default ReceiverView;
