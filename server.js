const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 存储所有连接的客户端
const clients = new Set();

// WebSocket 连接处理
wss.on('connection', (ws) => {
  clients.add(ws);

  // 接收客户端消息
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // 广播消息给所有客户端
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  // 客户端断开连接
  ws.on('close', () => {
    clients.delete(ws);
  });
});

// 提供静态文件（前端页面）
app.use(express.static('client'));

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});