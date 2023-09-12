const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/cp/hearmeout/messages', // O caminho da sua API
    createProxyMiddleware({
      target: 'http://localhost:8080', // O endereço do servidor da sua API
      changeOrigin: true,
    })
  );
};
