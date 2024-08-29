const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // ganti dengan user MySQL Anda
  password: '', // ganti dengan password MySQL Anda
  database: 'db_booklist',
  port: 3306
});

module.exports = pool.promise();
