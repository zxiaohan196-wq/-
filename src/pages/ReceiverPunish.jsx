import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import punishVideo from '../assets/punish.mp4';

function ReceiverPunish() {
  const navigate = useNavigate();
  const location = useLocation();
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.3;
    }

    const wantsSound = Boolean(location.state && location.state.autoplaySound);
    if (!wantsSound) return;

    const run = async () => {
      try {
        setMuted(false);
        if (videoRef.current) {
          videoRef.current.muted = false;
          await videoRef.current.play();
        }
      } catch (e) {
        // ignore, user can tap audio button
      }
    };

    run();
  }, [location.state]);

  return (
    <motion.div
      className="container receiverView"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="receiverView-header">
        <h1 className="receiverView-title">再哄哄我嘛</h1>
        <p className="receiverView-subtitle">再哄哄我嘛，我才能消气</p>
      </div>

      <div className="receiverView-hero">
        <div className="receiverView-videoWrap">
          <video
            ref={videoRef}
            className="receiverView-video"
            src={punishVideo}
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
                    videoRef.current.volume = 0.3;
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
            <div className="receiverView-videoOverlay receiverView-certOverlay">
              <button
                type="button"
                className="receiverView-certBtn"
                onClick={() => navigate('/apology-certificate', { state: { apology: location.state?.apology || '' } })}
              >
                生成道歉凭证
              </button>
            </div>
          )}
        </div>
      </div>

      <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
        返回上一页
      </button>
    </motion.div>
  );
}

export default ReceiverPunish;

