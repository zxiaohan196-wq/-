/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import forgiveVideo from '../assets/forgive.mp4';

function ReceiverForgive() {
  const navigate = useNavigate();
  const location = useLocation();
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const wantsSound = Boolean(location.state && location.state.autoplaySound);
    if (!wantsSound) return;

    // 由“选择动作按钮”触发跳转，通常允许直接有声播放
    const run = async () => {
      try {
        setMuted(false);
        if (videoRef.current) {
          videoRef.current.muted = false;
          await videoRef.current.play();
        }
      } catch (e) {
        setNeedsTap(true);
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
        <h1 className="receiverView-title">你选择了原谅</h1>
        <p className="receiverView-subtitle">小猫开心地蹭蹭你～</p>
      </div>

      <div className="receiverView-hero">
        <div className="receiverView-videoWrap">
          <video
            ref={videoRef}
            className="receiverView-video"
            src={forgiveVideo}
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
                setNeedsTap(false);
                try {
                  if (videoRef.current) {
                    videoRef.current.muted = false;
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

export default ReceiverForgive;

