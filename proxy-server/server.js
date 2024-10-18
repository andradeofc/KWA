const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// Proxy para a lista de criativos
app.use('/api/creatives', createProxyMiddleware({
    target: 'https://creative.kwai.com/rest/i18n/web/hot/ad/list?__redirectURL=https:%2F%2Fcreative.kwai.com%2Fportal%23%2Finspiration%2Fpopularads',
    changeOrigin: true,
    pathRewrite: {
        '^/api/creatives': '',
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Content-Type', 'application/json');
    },
}));

// Proxy para os detalhes dos criativos
app.use('/api/creative-details', createProxyMiddleware({
    target: 'https://creative.kwai.com/rest/i18n/web/hot/ad/detail',
    changeOrigin: true,
    pathRewrite: {
        '^/api/creative-details': '',
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Content-Type', 'application/json');
    },
}));

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
