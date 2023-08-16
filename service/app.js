const express = require('express');
const app = express();
const port = 5000;

//允许跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //项目上线后改成页面的地址
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Authorization,Accept');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', ' 3.2.1');
  if (req.method == 'OPTIONS') res.send(200); //让options请求快速返回
  else next();
});


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
