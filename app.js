require("dotenv").config();
const express = require("express");
const conexao = require("./db.js");
const { error } = require("node:console");
const PORT = Number(process.env.PORTA || 3000);
const app = express();

function validarId(req, res, next) {
  const id = Number(req.params.id);
  if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 0) {
    return res
      .status(400)
      .json({ erro: "O id deve ser um numero inteiro possitivo" });
  }
  req.id = id;
  next();
}

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API rodando" });
});

//#region Estudios
// GET - Lista os estudios
app.get("/estudios", (req, res, next) => {
  conexao.query("SELECT * FROM estudios ORDER BY id", (error, resultado) => {
    if (error) return next(error);
    if (resultado.length === 0) {
      res.status(404).json({ erro: "Estudio não encontrado" });
    }
    return res.status(200).json(resultado);
  });
});

// GET - Lista os estudios por id
app.get("/estudios/:id", validarId, (req, res, next) => {
  conexao.query(
    "SELECT * FROM estudios WHERE id = ?",
    [req.id],
    (error, resultado) => {
      if (error) return next(error);
      return res.status(200).json(resultado);
    },
  );
});

// POST - Adiciona mais estudios
app.post("/estudios", (req, res, next) => {});

// PUT - Atualiza o estudio selecionado
app.put("/estudios/:id", (req, res, next) => {});

// DELETE - Deleta o estudio selecionado
app.delete("/estudios/:id", (req, res, next) => {});

//#endregion
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
    console.error("Eroo ao iniciar servidor", error.code || error.message);
    process.exit(1);
  });
});
