require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { initWebSocket } = require('./services/websocket');
const { startAlertChecker } = require('./services/alertChecker');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/stocks',    require('./routes/stocks'));
app.use('/api/alerts',    require('./routes/alerts'));
app.use('/api/ai',        require('./routes/ai'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'SQLite' }));

initWebSocket(server);
startAlertChecker();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server → http://localhost:${PORT}`);
  console.log(`📦 Database → stocktracker.db`);
});