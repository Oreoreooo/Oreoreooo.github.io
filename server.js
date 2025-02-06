const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Store the current video state
let currentVideoState = {
  videoId: 'dQw4w9WgXcQ', // Default video ID (e.g., YouTube)
  currentTime: 0,
  isPlaying: false,
};

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send the current video state to the new user
  socket.emit('videoState', currentVideoState);

  // Handle play/pause events
  socket.on('play', (time) => {
    currentVideoState.isPlaying = true;
    currentVideoState.currentTime = time;
    io.emit('videoState', currentVideoState); // Broadcast to all users
  });

  socket.on('pause', (time) => {
    currentVideoState.isPlaying = false;
    currentVideoState.currentTime = time;
    io.emit('videoState', currentVideoState); // Broadcast to all users
  });

  // Handle video change
  socket.on('changeVideo', (videoId) => {
    currentVideoState.videoId = videoId;
    currentVideoState.currentTime = 0;
    currentVideoState.isPlaying = true;
    io.emit('videoState', currentVideoState); // Broadcast to all users
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});