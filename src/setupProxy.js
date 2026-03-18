const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const apiKey = process.env.REACT_APP_SILICONFLOW_API_KEY;

  app.use(
    '/api/siliconflow',
    createProxyMiddleware({
      target: 'https://api.siliconflow.cn',
      changeOrigin: true,
      pathRewrite: { '^/api/siliconflow': '' },
      secure: true,
      onProxyReq(proxyReq) {
        if (apiKey) proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
      },
    })
  );
};

