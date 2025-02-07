const video = document.getElementById('video');
const ws = new WebSocket('ws://localhost:3000');

// 为了避免频繁发送，我们在用户 `seek` 操作后添加延迟
let lastSeekTime = 0;
const seekInterval = 500; // 每500ms只发送一次数据

// 监听视频播放事件
video.addEventListener('play', () => {
  sendSyncData({ action: 'play', time: video.currentTime });
});

video.addEventListener('pause', () => {
  sendSyncData({ action: 'pause', time: video.currentTime });
});

// 监听 `seek` 事件时，使用延迟来避免频繁发送
video.addEventListener('seeked', () => {
  const currentTime = video.currentTime;
  if (Math.abs(currentTime - lastSeekTime) > 0.1) { // 只有 `currentTime` 变化足够大时才发送
    lastSeekTime = currentTime;
    sendSyncData({ action: 'seek', time: currentTime });
  }
});

// 发送同步数据到服务器
function sendSyncData(data) {
  if (ws.readyState === WebSocket.OPEN) {
    console.log('Sending sync data:', data);
    ws.send(JSON.stringify(data));
  }
}

// 接收服务器的同步数据
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received data from server:', data);

  switch (data.action) {
    case 'play':
      video.currentTime = data.time;
      video.play();
      break;
    case 'pause':
      video.currentTime = data.time;
      video.pause();
      break;
    case 'seek':
      video.currentTime = data.time;
      break;
    default:
      console.log('Unknown action:', data.action);
  }
};

// 处理 WebSocket 错误
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};