import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import catSticker2 from '../assets/cat-sticker-2.png';

function EditApology() {
  const location = useLocation();
  const navigate = useNavigate();
  const { avatar, action } = location.state || {};

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [form, setForm] = useState({
    salutation: '',
    event: '',
    emotion: '',
    mistake: '',
    reason: '',
    coax: '',
    promise: '',
  });

  const emotionOptions = [
    { id: 'angry', icon: '😠', label: '生气' },
    { id: 'sad', icon: '😢', label: '难过' },
    { id: 'down', icon: '😞', label: '失望' },
    { id: 'wronged', icon: '😔', label: '委屈' },
  ];

  const coaxOptions = [
    { id: 'dinner', icon: '🍽️', label: '请吃大餐' },
    { id: 'gift', icon: '🎁', label: '送个小礼物' },
    { id: 'day', icon: '💕', label: '陪TA一整天' },
    { id: 'housework', icon: '🧹', label: '包一周家务' },
    { id: 'massage', icon: '💆', label: '给TA按摩' },
    { id: 'movie', icon: '🎬', label: '看TA想看的电影' },
  ];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const setEmotion = (value) => {
    setForm((prev) => ({ ...prev, emotion: value }));
  };

  const toggleCoax = (label) => {
    setForm((prev) => {
      const list = prev.coax ? prev.coax.split('、') : [];
      const exists = list.includes(label);
      const next = exists ? list.filter((x) => x !== label) : [...list, label];
      return { ...prev, coax: next.join('、') };
    });
  };

  const validateStep = (current) => {
    if (current === 1 && !form.event.trim()) {
      alert('请先描述发生了什么事情哦～ 🐱');
      return false;
    }
    if (current === 2 && !form.mistake.trim()) {
      alert('请写一写你觉得自己错在哪里～ 🐱');
      return false;
    }
    if (current === 4 && !form.promise.trim()) {
      alert('最后写下你的承诺吧～ 🐱');
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step < totalSteps) {
      setStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const what = `${form.event}\nTA 的感受：${form.emotion || '（未填写）'}`;

    const parts = [
      form.mistake && `我知道我错在：${form.mistake}`,
      form.reason && `之所以会这样，是因为：${form.reason}`,
      form.coax && `为了补偿你，我想：${form.coax}`,
      form.promise && `我保证：${form.promise}`,
    ].filter(Boolean);

    const apology = parts.join('\n\n');

    const payload = {
      avatar,
      action,
      salutation: form.salutation,
      what,
      apology,
      compensation: form.coax,
      event: form.event,
      feeling: form.emotion,
      mistake: form.mistake,
      promise: form.promise,
    };

    try {
      localStorage.setItem('apologyDraft', JSON.stringify(payload));
    } catch (err) {
      // ignore storage failures (private mode, quota, etc.)
    }

    navigate('/preview-apology', {
      state: payload,
    });
  };

  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <motion.div
      className="container editApology"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img src={catSticker2} alt="" className="editApology-catSticker catSticker-2" />
      <div className="editApology-header">
        <div className="editApology-title">编辑道歉内容</div>
        <div className="editApology-subtitle">真诚地表达你的歉意</div>
      </div>

      <div className="editApology-stepper">
        <div className="editApology-stepperTrack" />
        <div
          className="editApology-stepperFill"
          style={{ width: `${progress}%` }}
        />
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const n = idx + 1;
          const state =
            n < step ? 'isDone' : n === step ? 'isActive' : 'isTodo';
          return (
            <div key={n} className={`editApology-step ${state}`}>
              {n}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="editApology-section">
            <div className="editApology-sectionTitle">📝 发生了什么？</div>
            <div className="editApology-sectionDesc">
              描述事件，并表示你理解TA的感受
            </div>

            <div className="input-group">
              <label className="input-label">你怎么称呼TA（选填）</label>
              <input
                className="input-field"
                placeholder="比如：宝宝 / 宝贝 / 亲爱的 / 小X..."
                value={form.salutation}
                onChange={handleChange('salutation')}
              />
              <div className="editApology-hint">💡 AI 会把称呼自然地放进道歉信开头</div>
            </div>

            <div className="input-group">
              <label className="input-label">
                事件描述 <span className="editApology-required">*</span>
              </label>
              <textarea
                className="input-field"
                placeholder="比如：昨天我忘记了你的生日..."
                value={form.event}
                onChange={handleChange('event')}
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                TA 的感受 <span className="editApology-required">*</span>
              </label>
              <div className="editApology-emotions">
                {emotionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`editApology-emotionBtn ${
                      form.emotion === opt.label ? 'selected' : ''
                    }`}
                    onClick={() => setEmotion(opt.label)}
                  >
                    <span className="editApology-emotionIcon">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              <input
                className="input-field"
                placeholder="或者自定义TA的感受..."
                value={form.emotion}
                onChange={(e) => setEmotion(e.target.value)}
              />
              <div className="editApology-hint">
                💡 表示你理解TA为什么会有这样的感受
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="editApology-section">
            <div className="editApology-sectionTitle">🙇 我错在哪里？</div>
            <div className="editApology-sectionDesc">
              承认错误，并简单说明原因（不是借口）
            </div>

            <div className="input-group">
              <label className="input-label">
                我的错误 <span className="editApology-required">*</span>
              </label>
              <textarea
                className="input-field"
                placeholder="比如：我没有把你的重要时刻放在第一位，也没有及时向你道歉……"
                value={form.mistake}
                onChange={handleChange('mistake')}
              />
            </div>

            <div className="input-group">
              <label className="input-label">为什么会这样（选填）</label>
              <textarea
                className="input-field"
                placeholder="比如：最近事情很多，我顾着忙，却忽略了你的感受，这不是理由，但想让你知道我的真实情况……"
                value={form.reason}
                onChange={handleChange('reason')}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="editApology-section">
            <div className="editApology-sectionTitle">💝 怎么哄TA开心？</div>
            <div className="editApology-sectionDesc">
              选择或自定义你的哄人方式（可选）
            </div>

            <div className="input-group">
              <label className="input-label">哄人方式</label>
              <div className="editApology-coaxList">
                {coaxOptions.map((opt) => {
                  const selected =
                    form.coax && form.coax.split('、').includes(opt.label);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`editApology-coaxBtn ${
                        selected ? 'selected' : ''
                      }`}
                      onClick={() => toggleCoax(opt.label)}
                    >
                      <span className="editApology-coaxIcon">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <textarea
                className="input-field editApology-smallInput"
                placeholder="或者自定义哄人方式..."
                value={form.coax}
                onChange={handleChange('coax')}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="editApology-section">
            <div className="editApology-sectionTitle">🤝 我的承诺</div>
            <div className="editApology-sectionDesc">
              保证以后不会再犯同样的错误
            </div>

            <div className="input-group">
              <label className="input-label">
                我保证 <span className="editApology-required">*</span>
              </label>
              <textarea
                className="input-field"
                placeholder="比如：以后有任何重要的日子我都会记在日历里，提前准备，不再让你觉得被忽视……"
                value={form.promise}
                onChange={handleChange('promise')}
              />
              <div className="editApology-hint">💡 具体说明你会怎么改进</div>
            </div>
          </div>
        )}

        <div
          className="button-group"
          style={{ display: 'flex', gap: 12, marginTop: 24 }}
        >
          {step > 1 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={goPrev}
            >
              上一步
            </button>
          )}
          {step < totalSteps && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={goNext}
            >
              下一步
            </button>
          )}
          {step === totalSteps && (
            <button type="submit" className="btn btn-primary">
              ✨ 生成道歉信
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}

export default EditApology;