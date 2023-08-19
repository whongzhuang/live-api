const express = require('express');
const app = express();
const port = 5000;
const config = require('./config.json');
const sqlite3db = require('./sqlite3.js');

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //项目上线后改成页面的地址
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Authorization,Accept');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', ' 3.2.1');
  if (req.method == 'OPTIONS') res.send(200); //让options请求快速返回
  else next();
});


sqlite3db.connect();


app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.post('/postapi', (req, res) => {
  sqlite3db.insertapiinfo(req.query.url, req.query.desc).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});


app.get('/searchapi', (req, res) => {
  sqlite3db.serachapiinfo(req.query.searchTerm).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});

router.post('/insertdata', async (req, res) => {
  const { url, desc, in_json, out_json } = req.body;
  try {
    const apiId = await sqlite3db.insertData(url, desc, in_json, out_json);
    res.status(201).json({ message: 'Data inserted successfully', apiId });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
