const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stockRoutes = require('./routes/stock');
const analysisRoutes = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Stock Dashboard API is running' });
});

// Routes
app.use('/api/stock', stockRoutes);
app.use('/api/analysis', analysisRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
