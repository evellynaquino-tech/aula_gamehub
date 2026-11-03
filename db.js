// require("dotenv").config();
// const mysql =  require("mysql2");

import "dotenv/config";
import mysql from "mysql2";

const conexao = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  // Alterado para DB_PORT para não usar a porta do servidor Express (como 3000)
  port: Number(process.env.DB_PORT) || 3306, 
  user: process.env.DB_USER || process.env.USER || "root", // Garante o usuário correto
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "gamehub_db",
});

export default conexao;
