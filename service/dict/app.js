"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const typeorm_1 = require("typeorm");
const app = (0, express_1.default)();
const port = 5000;
let connection = null;
(0, typeorm_1.createConnection)().then(connection1 => {
    connection = (0, typeorm_1.getConnection)();
}).catch(error => {
    console.error('Database connection error:', error);
});
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //项目上线后改成页面的地址
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Authorization,Accept');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    // res.header('Access-Control-Allow-Credentials', true);
    res.header('X-Powered-By', ' 3.2.1');
    if (req.method == 'OPTIONS')
        res.send(200); //让options请求快速返回
    else
        next();
});
// 使用 body-parser 解析 JSON 数据
app.use(body_parser_1.default.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});
app.post('/test', (req, res) => {
    res.send({ 'Hello, Express!': 'ddd' });
});
app.get('/apiinfo/:api_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const api_id = req.params.api_id;
    try {
        const apiinfo = {
            api_info: {},
            api_content: {},
            api_label_info: []
        };
        const queryResult = yield connection.query(`SELECT * FROM api_info where api_id=${api_id}`);
        const api_content = yield connection.query(`SELECT * FROM api_content where api_id=${api_id}`);
        const api_label_infos = yield connection.query(`select *  from api_label_info a , api_label_dict b where a.label_id=b.label_id and a.api_id=${api_id}`);
        apiinfo.api_info = queryResult[0];
        apiinfo.api_content = api_content[0];
        apiinfo.api_label_info = api_label_infos;
        res.send(apiinfo);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
    }
}));
app.get('/getApiListsByPage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryResult = yield connection.query("SELECT * FROM api_info where url like '%" + req.query.searchTerm + "%'");
        console.log("Query result:", queryResult);
        res.send(queryResult);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
    }
}));
app.get('/getApiContentByApiId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryResult = yield connection.query("SELECT * FROM api_info where url like '%" + req.query.searchTerm + "%'");
        console.log("Query result:", queryResult);
        res.send(queryResult);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
    }
}));
app.get('/deleteApiInfoByApiId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryResult = yield connection.query("SELECT * FROM api_info where url like '%" + req.query.searchTerm + "%'");
        console.log("Query result:", queryResult);
        res.send(queryResult);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
    }
}));
app.get('/getApiByLike', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryResult = yield connection.query("SELECT * FROM api_info where url like '%" + req.query.searchTerm + "%'");
        console.log("Query result:", queryResult);
        res.send(queryResult);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
    }
}));
app.get('/getlabeldict', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryResult = yield connection.query("SELECT * FROM api_label_dict");
        console.log("Query result:", queryResult);
        res.send(queryResult);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
        // 关闭连接
        yield connection.close();
    }
}));
app.post('/insertdata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { api_id, url, desc, in_json, out_json, labels } = req.body;
    const queryRunner = connection.createQueryRunner();
    const currentTime = new Date().toISOString();
    const postNum = 0; // Initial value
    const successNum = 0; // Initial value
    yield queryRunner.startTransaction();
    try {
        if (api_id != null) {
            const queryResult0 = yield connection.query(`SELECT max(api_id) as api_id FROM api_info where api_id=${api_id}}`);
            console.log("Query result:", queryResult0);
            if (queryResult0.length == 0) {
                res.send({ status: 400, msg: "api_id doesn't exist!" });
                return;
            }
            const updateApiInfoQuery = yield queryRunner.query(`UPDATE api_info SET url='${url}', desc='${desc}', last_update_time='${currentTime}' WHERE api_id=${api_id}`);
            const updateApiContentQuery = yield queryRunner.query(`UPDATE api_content SET in_json='${in_json}', out_json='${out_json}', last_update_time='${currentTime}' WHERE api_id=${api_id}`);
            const deleteApiLabelQuery = yield queryRunner.query(`DELETE FROM api_label_info WHERE api_id=${api_id}`);
            for (let i = 0; i < labels.length; i++) {
                //先查询app_label_dict中是否有该label，如果有则直接使用，如果没有则取该表最大id+1作为新的label_id
                const queryResult = yield connection.query(`SELECT label_id FROM api_label_dict WHERE label_name='${labels[i]}'`);
                console.log("Query result:", queryResult);
                let nextLabelId = 0;
                if (queryResult.length == 0) {
                    const queryResult = yield connection.query("SELECT max(label_id) as label_id FROM api_label_dict");
                    console.log("Query result:", queryResult);
                    nextLabelId = queryResult[0].label_id + 1;
                    const insertlabeldictquery = yield queryRunner.query(`INSERT INTO api_label_dict (label_id, label_name,create_time) 
          VALUES (${nextLabelId}, '${labels[i]}','${currentTime}')`);
                    const insertLabelDictQuery = yield queryRunner.query(`INSERT INTO api_label_info (api_id, label_id) VALUES (${api_id}, ${nextLabelId})`);
                }
                else {
                    nextLabelId = queryResult[0].label_id;
                    const insertLabelDictQuery = yield queryRunner.query(`INSERT INTO api_label_info (api_id, label_id) VALUES (${api_id}, ${nextLabelId})`);
                }
            }
        }
        else {
            const queryResult = yield connection.query("SELECT max(api_id) as api_id FROM api_info");
            console.log("Query result:", queryResult);
            const nextapiId = queryResult[0].api_id + 1;
            const insertApiInfoQuery = yield queryRunner.query(`INSERT INTO api_info (api_id,url, create_time, desc, last_update_time, post_num, 
      success_num) VALUES (${nextapiId},'${url}', '${currentTime}', '${desc}', '${currentTime}', ${postNum}, ${successNum})`);
            const insertApiContentQuery = yield queryRunner.query(`INSERT INTO api_content (api_id, in_json, out_json,last_update_time) VALUES (${nextapiId}, 
        '${in_json}', '${out_json}','${currentTime}')`);
            for (let i = 0; i < labels.length; i++) {
                //先查询app_label_dict中是否有该label，如果有则直接使用，如果没有则取该表最大id+1作为新的label_id
                const queryResult = yield connection.query(`SELECT label_id FROM api_label_dict WHERE label_name='${labels[i]}'`);
                console.log("Query result:", queryResult);
                let nextLabelId = 0;
                if (queryResult.length == 0) {
                    const queryResult = yield connection.query("SELECT max(label_id) as label_id FROM api_label_dict");
                    console.log("Query result:", queryResult);
                    nextLabelId = queryResult[0].label_id + 1;
                    const insertlabeldictquery = yield queryRunner.query(`INSERT INTO api_label_dict (label_id, label_name,create_time) 
          VALUES (${nextLabelId}, '${labels[i]}','${currentTime}')`);
                    const insertLabelDictQuery = yield queryRunner.query(`INSERT INTO api_label_info (api_id, label_id) VALUES (${nextapiId}, ${nextLabelId})`);
                }
                else {
                    nextLabelId = queryResult[0].label_id;
                    const insertLabelDictQuery = yield queryRunner.query(`INSERT INTO api_label_info (api_id, label_id) VALUES (${nextapiId}, ${nextLabelId})`);
                }
            }
        }
        // 提交事务
        yield queryRunner.commitTransaction();
        res.send({ status: 200, msg: "Insert successfully!" });
    }
    catch (error) {
        console.log("Error:", error);
        yield queryRunner.rollbackTransaction();
    }
    finally {
        yield queryRunner.release();
        yield connection.close();
    }
}));
