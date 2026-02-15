const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;
const sessions = {};

app.get('/session/:id', (req, res) => {
  const sessionId = req.params.id;
  const data = sessions[sessionId];
  if (!data) return res.status(404).json({ error: 'Session not found' });

  const totalPoints = data.metrics.length;
  const avgAttention = totalPoints ? data.metrics.reduce((a,m)=>a+m.attention,0)/totalPoints : 0;
  const avgCognitive = totalPoints ? data.metrics.reduce((a,m)=>a+m.cognitive,0)/totalPoints : 0;

  res.json({ sessionId, points: totalPoints, avgAttention, avgCognitive, metrics: data.metrics });
});

const server = app.listen(PORT, () => console.log(`HTTP server running on http://localhost:${PORT}`));

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const urlParts = req.url.split('/');
  const sessionId = urlParts[urlParts.length - 1];
  if (!sessions[sessionId]) sessions[sessionId] = { metrics: [] };

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      sessions[sessionId].metrics.push({
        attention: data.attention,
        cognitive: data.cognitive,
        mouseRate: data.mouse_rate,
        tabSwitches: data.tab_switches,
        timestamp: Date.now(),
      });
    } catch (e) { console.error('Invalid message', e); }
  });

  ws.on('close', () => console.log('WS closed for session:', sessionId));
});
