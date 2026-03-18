// src/utils/deepseekAPI.js

const SILICONFLOW_API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/api/polish'
    : 'https://api.siliconflow.cn/v1/chat/completions';
const API_KEY = process.env.REACT_APP_SILICONFLOW_API_KEY;

const SYSTEM_PROMPT = `你是一个专业的道歉信润色助手。你的任务是将用户提供的道歉信息润色成真诚、简洁、打动人心的道歉信。

要求：
1. 控制在 200 字以内（不含标点和空格）
2. 如果提供了“称呼”，请以“称呼 + 逗号 + 对不起”开头（如：宝宝，对不起）；如果没提供称呼，就直接以“对不起”开头
3. 包含：理解对方感受 + 承认错误 + 补偿方案 + 承诺改进
4. 语气真诚但不啰嗦
5. 每句话独立成段，适合逐句展示（5-8 句话）
6. 每句话尽量以自然的句末标点结尾（。/！/？），不要整封信都没有标点
7. 不要写落款

输出格式：
每句话单独一行，用换行符分隔。`;

/**
 * 调用 DeepSeek 润色道歉信
 * @param {Object} apologyData - 道歉信原始数据
 * @param {string} apologyData.event - 事件
 * @param {string} apologyData.feeling - 对方感受
 * @param {string} apologyData.mistake - 我的错误
 * @param {string} apologyData.compensation - 补偿方案
 * @param {string} apologyData.promise - 承诺改进
 * @returns {Promise<string>} 润色后的道歉信
 */
export async function polishApologyWithDeepSeek(apologyData) {
  const { salutation, event, feeling, mistake, compensation, promise } = apologyData;
  
  // 构建用户提示词
  const userPrompt = `请根据以下信息润色一封道歉信：

称呼：${salutation || '（未提供）'}
事件：${event}
对方感受：${feeling}
我的错误：${mistake}
补偿方案：${compensation}
承诺改进：${promise}

请直接输出润色后的道歉信内容，每句话单独一行。`;

  try {
    console.log('🚀 开始调用 DeepSeek API...');
    console.log('📝 输入数据:', apologyData);

    if (!API_KEY && SILICONFLOW_API_URL.startsWith('http')) {
      throw new Error(
        '未检测到 REACT_APP_SILICONFLOW_API_KEY。请在项目根目录 .env 中配置，并重启 npm start。'
      );
    }

    const response = await fetch(SILICONFLOW_API_URL, {
      method: 'POST',
      headers: {
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        stream: false
      })
    });

    const raw = await response.text();
    let data = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (parseErr) {
      // 非 JSON 响应，多半是网关或服务器文本错误，直接抛出前 200 字符
      if (!response.ok) {
        console.error('❌ API 文本错误响应:', raw);
        throw new Error(`API 请求失败: ${response.status} ${raw.slice(0, 200)}`);
      }
      console.error('❌ 无法解析 API 响应为 JSON:', raw);
      throw new Error(`无法解析 AI 响应，请稍后重试。原始返回: ${raw.slice(0, 200)}`);
    }

    if (!response.ok) {
      console.error('❌ API 错误:', data);
      throw new Error(
        data?.error?.message ||
          data?.message ||
          `API 请求失败: ${response.status} ${raw.slice(0, 200)}`
      );
    }

    console.log('✅ API 响应:', data);
    
    // 提取润色后的内容
    const polishedContent = data.choices[0].message.content;

    const withPunctuation = String(polishedContent || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        if (/[。！？…!?]$/.test(line)) return line;
        return `${line}。`;
      })
      .join('\n');
    
    // 验证字数（不含标点和空格）
    const wordCount = withPunctuation.replace(/[\s\n，。！？、；：""''（）《》【】…—]/g, '').length;
    console.log(`📊 润色后字数: ${wordCount} 字`);
    
    if (wordCount > 200) {
      console.warn(`⚠️ 警告：内容超过 200 字（${wordCount} 字）`);
    }
    
    return withPunctuation;
    
  } catch (error) {
    console.error('💥 DeepSeek API 调用失败:', error);
    throw new Error(`道歉信润色失败: ${error.message}`);
  }
}

/**
 * 将润色后的文本转换为句子数组
 * @param {string} polishedText - 润色后的文本
 * @returns {Array<string>} 句子数组
 */
export function convertToSentences(polishedText) {
  return polishedText
    .split(/\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}
