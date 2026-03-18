require('dotenv').config();
// 开发环境下忽略 SSL 证书校验（仅本地调试用）
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');

const PORT = 4000;
const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const API_KEY = process.env.REACT_APP_SILICONFLOW_API_KEY;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/polish', async (req, res) => {
  if (!API_KEY) {
    return res
      .status(500)
      .json({ error: '缺少 REACT_APP_SILICONFLOW_API_KEY，请在 .env 中配置后重新启动。' });
  }

  try {
    const response = await fetch(SILICONFLOW_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const raw = await response.text();

    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (e) {
      return res
        .status(response.status || 500)
        .json({ error: `上游返回非 JSON：${raw.slice(0, 200)}` });
    }

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data?.error?.message || data?.message || '调用模型失败' });
    }

    return res.json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('代理调用失败', err);
    return res.status(500).json({ error: err.message || '代理调用失败' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AI 代理服务器已启动：http://localhost:${PORT}`);
});

