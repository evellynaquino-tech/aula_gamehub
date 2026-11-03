// require("dotenv").config();
// const mysql =  require("mysql2");

import "dotenv/config";
import mysql from "mysql2";

const conexao = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.PORT) || 3306,
  user: process.env.USER || "root",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "gamehub_db",
});

// module.exports = conexao;
export default conexao;