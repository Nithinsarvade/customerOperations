const mysql = require("mysql2");
var mysqlconnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "data",
});

module.exports = mysqlconnect;
