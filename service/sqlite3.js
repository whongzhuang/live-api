
/**
 * CREATE TABLE "api_content" (
  "api_id" INTEGER NOT NULL,
  "in_json" blob,
  "out_json" blob,
  PRIMARY KEY ("api_id")
);

CREATE TABLE "api_info" (
  "api_id" integer NOT NULL,
  "url" TEXT,
  "create_time" DATE,
  "desc" TEXT,
  "last_update_time" DATE,
  "post_num" INTEGER,
  "success_num" INTEGER,
  PRIMARY KEY ("api_id"),
  CONSTRAINT "url" UNIQUE ("url", "desc")
);
CREATE INDEX "content"
ON "api_info" (
  "api_id",
  "url",
  "desc"
);
CREATE UNIQUE INDEX "id"
ON "api_info" (
  "api_id"
);


 */


const connectsqlite3 = require('sqlite3').verbose();
const configjson = require('./config.json');

const connect = () => {
    return new connectsqlite3.Database(configjson.dbpath, connectsqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Database connection error:', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    }
    );
}

const dbclose = () => {
    connect.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

const serachapiinfo = (searchTerm) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT * FROM api_info WHERE url LIKE '%${searchTerm}%' OR desc LIKE '%${searchTerm}%'`;
        console.log(sqlQuery);
        connect().all(sqlQuery, [], (err, row) => {
            console.log(row);
            console.log(err);
            if (err) {
                console.log(err.message);
                reject(err.message);
            }
            resolve(row);
        });
    });
}

const insertData = async (url, desc, inJson, outJson) => {
    const insertApiInfoQuery = `INSERT INTO api_info (url, create_time, "desc", last_update_time, post_num, success_num, type) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const insertApiContentQuery = `INSERT INTO api_content (api_id, in_json, out_json) VALUES (?, ?, ?)`;

    const currentTime = new Date().toISOString();
    const postNum = 0; // Initial value
    const successNum = 0; // Initial value

    const dbConnection = connect(); // Assuming you have the connect function defined

    // Start a transaction
    await dbConnection.run("BEGIN TRANSACTION");

    try {
        const infoResult = await dbConnection.run(
            insertApiInfoQuery,
            [url, currentTime, desc, currentTime, postNum, successNum, "some_type"]
        );

        const apiId = infoResult.lastID; // Get the auto-generated id from the insert

        await dbConnection.run(
            insertApiContentQuery,
            [apiId, inJson, outJson]
        );

        await dbConnection.run("COMMIT");
        return apiId; // Return the inserted api_id
    } catch (error) {
        await dbConnection.run("ROLLBACK");
        throw error;
    } finally {
        dbConnection.close();
    }
};


//导出connect和dbclose
module.exports = {
    connect,
    dbclose,
    insertData,
    serachapiinfo
}
