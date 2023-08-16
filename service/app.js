const express = require('express');
const app = express();
const port = 3000;

// 处理 GET 请求
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// 处理 POST 请求
app.post('/post-route', (req, res) => {
  res.send('This is a POST request.');
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
