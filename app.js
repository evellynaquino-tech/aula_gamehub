require("dotenv").config();
const express = require("express");
const conexao = require("./db.js");
const { error } = require("node:console");

const PORT = Number(process.env.PORTA || 3000);
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API rodando" });
});

conexao.connect((error) => {
  if (error) {
    console.error("Erro ao conectar ao banco.", error.code || error.message);
    process.exit(1);
  }
  console.log("Conectado com sucesso.");

  const servidor = app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
  });

  servidor.on("error", (error) => {
    console.error("Eroo ao iniciar servidor", error.code || error.message)
    process.exit(1);
  })
});
