import express from 'express';
import bodyParser from 'body-parser';
import { createConnection, getConnection } from 'typeorm';
import axios, { AxiosRequestConfig } from 'axios';
const qs = require('qs');


const app = express();
const port = 5000;

let connection: any = null;
// createConnection().then(connection1 => {
//   connection = getConnection();
// }).catch(error => {
//   console.error('Database connection error:', error);
// });

app.all('*', function (req: { method: string; }, res: { header: (arg0: string, arg1: string) => void; send: (arg0: number) => void; }, next: () => void) {
  res.header('Access-Control-Allow-Origin', '*'); //项目上线后改成页面的地址
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Authorization,Accept');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', ' 3.2.1');
  if (req.method == 'OPTIONS') res.send(200); //让options请求快速返回
  else next();
});

// 使用 body-parser 解析 JSON 数据
app.use(bodyParser.json());


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('Hello, Express!');
});


app.post('/postapi', async (req, res) => {
  const { url, injson } = req.body;
  //发起post请求
  const data = qs.stringify({ 'injson': injson });
  const config: AxiosRequestConfig = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };
  axios(config)
    .then(function (response: { data: any; }) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    }
    )
    .catch(function (error: any) {
      console.log(error);
    }
    );
});


app.post('/test', (req: any, res: { send: (arg0: {}) => void; }) => {
  res.send({ 'Hello, Express!': 'ddd' });
});

app.get('/apiinfo/:api_id', async (req: any, res: { send: (arg0: any) => void; }) => {
  const api_id = req.params.api_id;
  try {
    const apiinfo: { api_info: {}, api_content: {}, api_label_info: [] } = {
      api_info: {},
      api_content: {},
      api_label_info: []
    };
    const queryResult = await connection.query(`SELECT * FROM api_info where api_id=${api_id}`);
    const api_content = await connection.query(`SELECT * FROM api_content where api_id=${api_id}`);
    const api_label_infos = await connection.query(`select *  from api_label_info a , api_label_dict b where a.label_id=b.label_id and a.api_id=${api_id}`);
    apiinfo.api_info = queryResult[0];
    apiinfo.api_content = api_content[0];
    apiinfo.api_label_info = api_label_infos
    res.send(apiinfo);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
});

app.get('/getApiListsByPage', async (req: any, res: { send: (arg0: any) => void; }) => {
  try {
    const queryResult = await connection.query("SELECT * FROM api_info where url like '%" + req.query.searchTerm + "%'");
    console.log("Query result:", queryResult);
    res.send(queryResult);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
});

app.get('/getApiContentByApiId', async (req: any, res: { send: (arg0: any) => void; }) => {
  try {
    const queryResult = await connection.query("SELECT * FROM api_info where url like '%" + req.query.searchTerm + "%'");
    console.log("Query result:", queryResult);
    res.send(queryResult);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
});

app.get('/deleteApiInfoByApiId', async (req: any, res: { send: (arg0: any) => void; }) => {
  try {
    const queryResult = await connection.query("SELECT * FROM api_info where url like '%" + req.query.searchTerm + "%'");
    console.log("Query result:", queryResult);
    res.send(queryResult);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
});



app.get('/getApiByLike', async (req: any, res: { send: (arg0: any) => void; }) => {
  try {
    const queryResult = await connection.query("SELECT * FROM api_info where url like '%" + req.query.searchTerm + "%'");
    console.log("Query result:", queryResult);
    res.send(queryResult);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
});


app.get('/getlabeldict', async (req: any, res: { send: (arg0: any) => void; }) => {
  try {
    const queryResult = await connection.query("SELECT * FROM api_label_dict");
    console.log("Query result:", queryResult);
    res.send(queryResult);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // 关闭连接
    await connection.close();
  }
});

app.post('/insertdata', async (req, res) => {
  const { api_id, url, desc, in_json, out_json, labels } = req.body;
  const queryRunner = connection.createQueryRunner();

  const currentTime = new Date().toISOString();
  const postNum = 0; // Initial value
  const successNum = 0; // Initial value
  await queryRunner.startTransaction();

  try {
    if (api_id != null) {
      const queryResult0 = await connection.query(`SELECT max(api_id) as api_id FROM api_info where api_id=${api_id}}`);
      console.log("Query result:", queryResult0);
      if (queryResult0.length == 0) {
        res.send({ status: 400, msg: "api_id doesn't exist!" });
        return;
      }
      const updateApiInfoQuery = await queryRunner.query(`UPDATE api_info SET url='${url}', desc='${desc}', last_update_time='${currentTime}' WHERE api_id=${api_id}`);
      const updateApiContentQuery = await queryRunner.query(`UPDATE api_content SET in_json='${in_json}', out_json='${out_json}', last_update_time='${currentTime}' WHERE api_id=${api_id}`);
      const deleteApiLabelQuery = await queryRunner.query(`DELETE FROM api_label_info WHERE api_id=${api_id}`);
      for (let i = 0; i < labels.length; i++) {
        //先查询app_label_dict中是否有该label，如果有则直接使用，如果没有则取该表最大id+1作为新的label_id
        const queryResult = await connection.query(`SELECT label_id FROM api_label_dict WHERE label_name='${labels[i]}'`);
        console.log("Query result:", queryResult);
        let nextLabelId = 0;
        if (queryResult.length == 0) {
          const queryResult = await connection.query("SELECT max(label_id) as label_id FROM api_label_dict");
          console.log("Query result:", queryResult);
          nextLabelId = queryResult[0].label_id + 1;
          const insertlabeldictquery = await queryRunner.query(`INSERT INTO api_label_dict (label_id, label_name,create_time) 
          VALUES (${nextLabelId}, '${labels[i]}','${currentTime}')`);
          const insertLabelDictQuery = await queryRunner.query(`INSERT INTO api_label_info (api_id, label_id) VALUES (${api_id}, ${nextLabelId})`);
        } else {
          nextLabelId = queryResult[0].label_id;
          const insertLabelDictQuery = await queryRunner.query(`INSERT INTO api_label_info (api_id, label_id) VALUES (${api_id}, ${nextLabelId})`);
        }
      }
    } else {

      const queryResult = await connection.query("SELECT max(api_id) as api_id FROM api_info");
      console.log("Query result:", queryResult);
      const nextapiId = queryResult[0].api_id + 1;

      const insertApiInfoQuery = await queryRunner.query(`INSERT INTO api_info (api_id,url, create_time, desc, last_update_time, post_num, 
      success_num) VALUES (${nextapiId},'${url}', '${currentTime}', '${desc}', '${currentTime}', ${postNum}, ${successNum})`);

      const insertApiContentQuery = await queryRunner.query(`INSERT INTO api_content (api_id, in_json, out_json,last_update_time) VALUES (${nextapiId}, 
        '${in_json}', '${out_json}','${currentTime}')`);

      for (let i = 0; i < labels.length; i++) {
        //先查询app_label_dict中是否有该label，如果有则直接使用，如果没有则取该表最大id+1作为新的label_id
        const queryResult = await connection.query(`SELECT label_id FROM api_label_dict WHERE label_name='${labels[i]}'`);
        console.log("Query result:", queryResult);
        let nextLabelId = 0;
        if (queryResult.length == 0) {
          const queryResult = await connection.query("SELECT max(label_id) as label_id FROM api_label_dict");
          console.log("Query result:", queryResult);
          nextLabelId = queryResult[0].label_id + 1;
          const insertlabeldictquery = await queryRunner.query(`INSERT INTO api_label_dict (label_id, label_name,create_time) 
          VALUES (${nextLabelId}, '${labels[i]}','${currentTime}')`);
          const insertLabelDictQuery = await queryRunner.query(`INSERT INTO api_label_info (api_id, label_id) VALUES (${nextapiId}, ${nextLabelId})`);
        } else {
          nextLabelId = queryResult[0].label_id;
          const insertLabelDictQuery = await queryRunner.query(`INSERT INTO api_label_info (api_id, label_id) VALUES (${nextapiId}, ${nextLabelId})`);
        }
      }
    }

    // 提交事务
    await queryRunner.commitTransaction();
    res.send({ status: 200, msg: "Insert successfully!" });

  } catch (error) {
    console.log("Error:", error);
    await queryRunner.rollbackTransaction();
  }
  finally {
    await queryRunner.release();
    await connection.close();
  }
});



