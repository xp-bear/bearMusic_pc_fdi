const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// 数据库配置
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
};

/**
 * 初始化数据库和表
 */
async function initDatabase() {
  let connection;
  try {
    // 先连接MySQL服务器（不指定数据库）
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log("已连接到MySQL服务器");

    // 读取SQL文件
    const sqlFilePath = path.join(__dirname, "schema.mysql.sql");
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    // 将SQL文件分割成单个语句并执行
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.match(/^\s*$/));

    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (error) {
        console.error("执行SQL出错:", statement.substring(0, 50) + "...");
        throw error;
      }
    }

    console.log("✓ 数据库和表初始化成功");
  } catch (error) {
    console.error("数据库初始化失败:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { initDatabase };
