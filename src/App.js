import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditApology from './pages/EditApology';
import PreviewApology from './pages/PreviewApology';
import CatShow from './pages/CatShow';
import CatShowReceived from './pages/CatShowReceived';
import PreviewShare from './pages/PreviewShare';
import ReceiverView from './pages/ReceiverView';
import ReceiverForgive from './pages/ReceiverForgive';
import ReceiverPunish from './pages/ReceiverPunish';
import ApologyCertificate from './pages/ApologyCertificate';
import bgmMp3 from './assets/bgm.mp3';
import './App.css';

function GlobalBgm() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem('bgmEnabled') !== '0';
    } catch (e) {
      return true;
    }
  });

  const [started, setStarted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('bgmEnabled', enabled ? '1' : '0');
    } catch (e) {
      // ignore
    }
  }, [enabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.loop = true;
    audio.volume = 0.25;

    if (!enabled) {
      audio.pause();
      return undefined;
    }

    // 浏览器会拦截无手势自动播放：用第一次用户点击/触摸来启动
    const tryStart = async () => {
      try {
        await audio.play();
        setStarted(true);
      } catch (e) {
        // ignore
      }
    };

    const onFirstGesture = () => {
      tryStart();
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };

    window.addEventListener('pointerdown', onFirstGesture, { passive: true });
    window.addEventListener('keydown', onFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, [enabled]);

  const label = useMemo(() => {
    if (!enabled) return '🔇 BGM 已关闭';
    if (!started) return '🔊 开启 BGM';
    return '🎵 BGM 播放中';
  }, [enabled, started]);

  return (
    <>
      <audio ref={audioRef} src={bgmMp3} preload="auto" />
      <button type="button" className="bgmToggle" onClick={() => setEnabled((v) => !v)}>
        {label}
      </button>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <GlobalBgm />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-apology" element={<EditApology />} />
          <Route path="/preview-apology" element={<PreviewApology />} />
          <Route path="/cat-show" element={<CatShow />} />
          <Route path="/cat-show-received" element={<CatShowReceived />} />
          <Route path="/preview-share" element={<PreviewShare />} />
          <Route path="/view/:id" element={<ReceiverView />} />
          <Route path="/receiver-forgive" element={<ReceiverForgive />} />
          <Route path="/receiver-punish" element={<ReceiverPunish />} />
          <Route path="/apology-certificate" element={<ApologyCertificate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
