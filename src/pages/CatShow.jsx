import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import catShowVideo from '../assets/cat-show.mp4';

const START_DELAY_MS = 2200;
const DISPLAY_MS = 4200;
const FADE_MS = 700;
const GAP_MS = 1200;
const WRAP_CHARS = 9;

function CatShow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sentences = [], apology = '' } = location.state || {};

  const lines = useMemo(() => {
    const base =
      sentences && sentences.length
        ? sentences
        : (apology || '对不起，让你难过了。')
            .split(/[\n。！？]/)
            .map((s) => s.trim())
            .filter(Boolean);
    return base.length ? base : ['对不起，让你难过了。'];
  }, [sentences, apology]);

  const sentenceGroups = useMemo(() => {
    const ensureSentencePunc = (s) => {
      const text = String(s || '').trim();
      if (!text) return '';
      if (/[。！？…!?]$/.test(text)) return text;
      return `${text}。`;
    };

    const wrap = (sentence) => {
      const s = ensureSentencePunc(sentence);
      const chars = Array.from(s);
      const out = [];
      for (let i = 0; i < chars.length; i += WRAP_CHARS) {
        out.push(chars.slice(i, i + WRAP_CHARS).join(''));
      }
      return out.filter(Boolean);
    };

    return lines.map((l) => wrap(l)).filter((g) => g.length);
  }, [lines]);

  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!sentenceGroups.length) return;

    let cancelled = false;

    const run = async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      await sleep(START_DELAY_MS);

      let current = 0;
      while (!cancelled && current < sentenceGroups.length) {
        setSentenceIndex(current);
        setVisible(true);
        await sleep(DISPLAY_MS);
        setVisible(false);
        await sleep(FADE_MS + GAP_MS);
        current += 1;
      }
      // 文字展示完之后再停止小猫动画
      if (!cancelled && videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (e) {
          // ignore
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [sentenceGroups]);

  const group = sentenceGroups[sentenceIndex] || [];

  return (
    <motion.div
      className="container catShow"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="catShow-title">小猫展示中</h1>
      <p className="catShow-subtitle">小猫送上最真诚的歉意</p>

      <div className="catShow-videoWrap">
        <video
          ref={videoRef}
          className="catShow-video"
          src={catShowVideo}
          autoPlay
          muted
          playsInline
        />
        <div className={`catShow-board ${visible ? 'show' : 'hide'}`}>
          {group.slice(0, 4).map((line, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={idx}>{line}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          返回上一页
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate('/preview-share', {
              state: {
                ...location.state,
                apology,
              },
            })
          }
        >
          生成分享链接
        </button>
      </div>
    </motion.div>
  );
}

export default CatShow;

