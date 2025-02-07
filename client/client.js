const video = document.getElementById('video');
const ws = new WebSocket('ws://localhost:3000');

// 监听视频播放事件
video.addEventListener('play', () => {
  sendSyncData({ action: 'play', time: video.currentTime });
});

video.addEventListener('pause', () => {
  sendSyncData({ action: 'pause', time: video.currentTime });
});

video.addEventListener('seeked', () => {
  sendSyncData({ action: 'seek', time: video.currentTime });
});

// 发送同步数据到服务器
function sendSyncData(data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// 接收服务器的同步数据
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

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