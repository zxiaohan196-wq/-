import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import catLogo from '../assets/home-logo.png';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';
import { polishApologyWithDeepSeek, convertToSentences } from '../utils/deepseekAPI';

const MAX_WORDS = 200;

function countWords(text) {
  return text.replace(/[\s\n，。！？、；："'（）《》【】…—\s]/g, '').length;
}

function splitToParagraphs(text) {
  if (!text) return [];
  const lines = text.split('\n').filter((l) => l.trim());
  return lines;
}

function PreviewApology() {
  const location = useLocation();
  const navigate = useNavigate();
  let hydratedState = location.state;
  if (!hydratedState) {
    try {
      hydratedState = JSON.parse(localStorage.getItem('apologyDraft') || 'null');
    } catch (err) {
      hydratedState = null;
    }
  }

  const { apology = '', what = '', salutation = '' } = hydratedState || {};

  const initialText = useMemo(() => {
    const parts = [];
    if (salutation && salutation.trim()) parts.push(`${salutation.trim()}，对不起。`);
    if (what) parts.push(what);
    if (apology) parts.push(apology);
    return parts.join('\n\n') || '对不起，忘记你的重要时刻让你很难过。';
  }, [salutation, what, apology]);

  const [content, setContent] = useState(initialText);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState(initialText);
  const [isPolishing, setIsPolishing] = useState(false);
  const [hasPolished, setHasPolished] = useState(false);

  const totalWords = countWords(content);
  const modalWords = countWords(modalText);

  // 调用 DeepSeek 进行润色
  async function callPolish() {
    const { salutation: toName, event, feeling, mistake, compensation, promise } = hydratedState || {};
    if (!event && !mistake && !promise) return;

    try {
      setIsPolishing(true);
      setHasPolished(false);
      const polished = await polishApologyWithDeepSeek({
        salutation: toName || '',
        event: event || '',
        feeling: feeling || '',
        mistake: mistake || '',
        compensation: compensation || '',
        promise: promise || '',
      });
      const text = polished.trim();
      setContent(text);
      setModalText(text);
      setHasPolished(true);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('AI 润色失败: ', e);
      // eslint-disable-next-line no-alert
      alert(`AI 润色失败：${e?.message || '可以稍后再试一次～'}`);
    } finally {
      setIsPolishing(false);
    }
  }

  useEffect(() => {
    setContent(initialText);
    setModalText(initialText);
    // 初次进入时自动润色一次
    callPolish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialText]);

  const paragraphs = splitToParagraphs(content);

  const openModal = () => {
    setModalText(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (modalWords > MAX_WORDS) {
      // eslint-disable-next-line no-alert
      alert(`内容超过 ${MAX_WORDS} 字限制，请精简后再保存。`);
      return;
    }
    setContent(modalText);
    setIsModalOpen(false);
  };

  const handleRegenerate = () => {
    callPolish();
  };

  const handleCatPreview = () => {
    if (totalWords > MAX_WORDS) {
      // eslint-disable-next-line no-alert
      alert(`内容超过 ${MAX_WORDS} 字，小猫展示不了这么多，请先精简哦～`);
      return;
    }

    const sentences = convertToSentences(content);

    navigate('/cat-show', {
      state: {
        ...(hydratedState || {}),
        apology: content,
        sentences,
      },
    });
  };

  return (
    <motion.div
      className="container previewApology"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="previewApology-header">
        <div className="previewApology-catIcon">
          <img src={catLogo} alt="道歉喵" />
        </div>
        <h1 className="previewApology-title">道歉信预览</h1>
        <p className="previewApology-subtitle">
          {isPolishing ? '正在努力润色中…' : 'AI 已经帮你润色好啦～'}
        </p>
      </div>

      {isPolishing && !hasPolished ? (
        <div className="previewApology-card previewApology-loadingCard">
          <div className="previewApology-aiBadge">AI 润色</div>
          <div className="previewApology-loadingInner">
            <div className="previewApology-loadingLottie" aria-label="正在润色">
              <Lottie animationData={loadingAnimation} loop />
            </div>
            <div className="previewApology-loadingText">正在润色中，请稍等一下～</div>
            <div className="previewApology-loadingHint">润色完成后会自动替换为最终版本</div>
          </div>
        </div>
      ) : (
        <div className="previewApology-card">
          <div className="previewApology-aiBadge">AI 润色</div>

          <div className="previewApology-content">
            {paragraphs.map((p, idx) => (
              <p key={idx} className={idx === 0 ? 'first' : ''}>
                {p}
              </p>
            ))}
          </div>

          <div
            className={
              totalWords > MAX_WORDS
                ? 'previewApology-wordCount error'
                : totalWords > MAX_WORDS - 20
                ? 'previewApology-wordCount warning'
                : 'previewApology-wordCount'
            }
          >
            {totalWords} / {MAX_WORDS} 字
          </div>

          <button type="button" className="previewApology-editBtn" onClick={openModal}>
            ✏️ 手动修改内容
          </button>
        </div>
      )}

      <div className="previewApology-actions">
        <button
          type="button"
          className="previewApology-primaryBtn previewApology-btnRegenerate"
          onClick={handleRegenerate}
          disabled={isPolishing}
        >
          {isPolishing ? '正在润色...' : '🔄 重新生成'}
        </button>
        <button
          type="button"
          className="previewApology-primaryBtn previewApology-btnPreview"
          onClick={handleCatPreview}
        >
          🐱 查看小猫展示
        </button>
      </div>

      {isModalOpen && (
        <div className="previewApology-modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="previewApology-modalContent">
            <button type="button" className="previewApology-closeBtn" onClick={closeModal}>
              ×
            </button>
            <h2 className="previewApology-modalTitle">✏️ 编辑道歉信</h2>
            <p className="previewApology-modalHint">
              小猫只能展示简短的内容，请控制在 <strong>{MAX_WORDS} 字以内</strong>
            </p>
            <textarea
              className={`previewApology-editArea${
                modalWords > MAX_WORDS ? ' error' : ''
              }`}
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder="对不起，..."
            />
            <div
              className={
                modalWords > MAX_WORDS
                  ? 'previewApology-modalCount error'
                  : modalWords > MAX_WORDS - 20
                  ? 'previewApology-modalCount warning'
                  : 'previewApology-modalCount'
              }
            >
              {modalWords} / {MAX_WORDS} 字
            </div>
            <div className="previewApology-modalButtons">
              <button
                type="button"
                className="previewApology-modalBtn previewApology-modalCancel"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                type="button"
                className="previewApology-modalBtn previewApology-modalSave"
                onClick={handleSave}
                disabled={modalWords > MAX_WORDS}
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default PreviewApology;

