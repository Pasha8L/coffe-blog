require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/comments', require('./routes/comments'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
