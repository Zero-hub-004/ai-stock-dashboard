const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stockRoutes = require('./routes/stock');
const analysisRoutes = require('./routes/analysis');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Stock Dashboard API is running' });
});

// Routes
app.use('/api/stock', stockRoutes);
app.use('/api/analysis', analysisRoutes);

// 导出 app 给 Vercel 用，本地开发用 server.js 启动
module.exports = app;
