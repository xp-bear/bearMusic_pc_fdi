const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bear_music",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

pool
  .getConnection()
  .then((connection) => {
    console.log("数据库链接成功");
    connection.release();
  })
  .catch((err) => {
    console.error("数据库链接失败", err);
  });

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = {
  pool,
  query,
};
