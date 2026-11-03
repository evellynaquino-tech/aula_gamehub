// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const conexao = require("./db.js");
import "dotenv/config";
import express from "express";
import cors from "cors";
import conexao from "./db.js";
import { textoValido, inteiroPositivo } from "./src/utils/validacoes.js";
import { validarId } from "./src/middlewares/validarId.js";
import { tratarErro } from "./src/middlewares/tratarErro.js";

const app = express();
const PORTA = Number(process.env.PORTA || 3000);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ mensagem: "API do GameHub funcionando" });
});

// #region estudios

app.get("/estudios", (req, res, next) => {
  conexao.query("SELECT * FROM estudios ORDER BY id", (erro, resultado) => {
    if (erro) return next(erro);
    return res.status(200).json(resultado);
  });
});

app.get("/estudios/:id", validarId, (req, res, next) => {
  conexao.query(
    "SELECT * FROM estudios WHERE id = ?",
    [req.id],
    (erro, resultado) => {
      if (erro) return next(erro);
      if (resultado.length === 0) {
        return res.status(404).json({ erro: "Estúdio não encontrado" });
      }
      return res.status(200).json(resultado[0]);
    },
  );
});

app.post("/estudios", (req, res, next) => {
  const { nome, pais } = req.body ?? {};
  if (!textoValido(nome, 100) || !textoValido(pais, 60)) {
    return res
      .status(400)
      .json({ erro: "Informe nome (até 100 caracteres) e pais (até 60)" });
  }
  const dados = { nome: nome.trim(), pais: pais.trim() };

  conexao.query(
    "INSERT INTO estudios (nome, pais) VALUES (?, ?)",
    [dados.nome, dados.pais],
    (erro, resultado) => {
      if (erro) return next(erro);
      return res.status(201).json({
        mensagem: "Estúdio cadastrado com sucesso",
        id: resultado.insertId,
      });
    },
  );
});

app.put("/estudios/:id", validarId, (req, res, next) => {
  const { nome, pais } = req.body ?? {};
  if (!textoValido(nome, 100) || !textoValido(pais, 60)) {
    return res
      .status(400)
      .json({ erro: "Informe nome (até 100 caracteres) e pais (até 60)" });
  }
  const dados = { nome: nome.trim(), pais: pais.trim() };

  // Consulta didática para confirmar que o registro existe antes de editar.
  conexao.query(
    "SELECT * FROM estudios WHERE id = ?",
    [req.id],
    (erro, registros) => {
      if (erro) return next(erro);
      if (registros.length === 0) {
        return res.status(404).json({ erro: "Estúdio não encontrado" });
      }
      conexao.query(
        "UPDATE estudios SET nome = ?, pais = ? WHERE id = ?",
        [dados.nome, dados.pais, req.id],
        (erro, resultado) => {
          if (erro) return next(erro);
          return res
            .status(200)
            .json({ mensagem: "Estúdio atualizado com sucesso" });
        },
      );
    },
  );
});

app.delete("/estudios/:id", validarId, (req, res, next) => {
  conexao.query(
    "DELETE FROM estudios WHERE id = ?",
    [req.id],
    (erro, resultado) => {
      if (erro) return next(erro);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: "Estúdio não encontrado" });
      }
      return res.status(200).json({ mensagem: "Estúdio excluído com sucesso" });
    },
  );
});

// #endregion estudios
// #region jogos

app.get("/jogos", (req, res, next) => {
  conexao.query("SELECT * FROM jogos ORDER BY id", (erro, resultado) => {
    if (erro) return next(erro);
    return res.status(200).json(resultado);
  });
});

app.get("/jogos/:id", validarId, (req, res, next) => {
  conexao.query(
    "SELECT * FROM jogos WHERE id = ?",
    [req.id],
    (erro, resultado) => {
      if (erro) return next(erro);
      if (resultado.length === 0) {
        return res.status(404).json({ erro: "Jogo não encontrado" });
      }
      return res.status(200).json(resultado[0]);
    },
  );
});

app.post("/jogos", (req, res, next) => {
  const { titulo, ano_lancamento, estudio_id } = req.body ?? {};
  if (
    !textoValido(titulo, 150) ||
    !inteiroPositivo(ano_lancamento) ||
    ano_lancamento > 9999 ||
    !inteiroPositivo(estudio_id)
  ) {
    return res.status(400).json({
      erro: "Informe titulo (até 150 caracteres), ano_lancamento de 1 a 9999 e estudio_id inteiro positivo",
    });
  }
  const dados = { titulo: titulo.trim(), ano_lancamento, estudio_id };

  conexao.query(
    "INSERT INTO jogos (titulo, ano_lancamento, estudio_id) VALUES (?, ?, ?)",
    [dados.titulo, dados.ano_lancamento, dados.estudio_id],
    (erro, resultado) => {
      if (erro) return next(erro);
      return res.status(201).json({
        mensagem: "Jogo cadastrado com sucesso",
        id: resultado.insertId,
      });
    },
  );
});

app.put("/jogos/:id", validarId, (req, res, next) => {
  const { titulo, ano_lancamento, estudio_id } = req.body ?? {};
  if (
    !textoValido(titulo, 150) ||
    !inteiroPositivo(ano_lancamento) ||
    ano_lancamento > 9999 ||
    !inteiroPositivo(estudio_id)
  ) {
    return res.status(400).json({
      erro: "Informe titulo (até 150 caracteres), ano_lancamento de 1 a 9999 e estudio_id inteiro positivo",
    });
  }
  const dados = { titulo: titulo.trim(), ano_lancamento, estudio_id };

  // Consulta didática para confirmar que o registro existe antes de editar.
  conexao.query(
    "SELECT * FROM jogos WHERE id = ?",
    [req.id],
    (erro, registros) => {
      if (erro) return next(erro);
      if (registros.length === 0) {
        return res.status(404).json({ erro: "Jogo não encontrado" });
      }
      conexao.query(
        "UPDATE jogos SET titulo = ?, ano_lancamento = ?, estudio_id = ? WHERE id = ?",
        [dados.titulo, dados.ano_lancamento, dados.estudio_id, req.id],
        (erro, resultado) => {
          if (erro) return next(erro);
          return res
            .status(200)
            .json({ mensagem: "Jogo atualizado com sucesso" });
        },
      );
    },
  );
});

app.delete("/jogos/:id", validarId, (req, res, next) => {
  conexao.query(
    "DELETE FROM jogos WHERE id = ?",
    [req.id],
    (erro, resultado) => {
      if (erro) return next(erro);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: "Jogo não encontrado" });
      }
      return res.status(200).json({ mensagem: "Jogo excluído com sucesso" });
    },
  );
});

// #endregion jogos
// #region jogadores

app.get("/jogadores", (req, res, next) => {
  conexao.query("SELECT * FROM jogadores ORDER BY id", (erro, resultado) => {
    if (erro) return next(erro);
    return res.status(200).json(resultado);
  });
});

app.get("/jogadores/:id", validarId, (req, res, next) => {
  conexao.query(
    "SELECT * FROM jogadores WHERE id = ?",
    [req.id],
    (erro, resultado) => {
      if (erro) return next(erro);
      if (resultado.length === 0) {
        return res.status(404).json({ erro: "Jogador não encontrado" });
      }
      return res.status(200).json(resultado[0]);
    },
  );
});

app.post("/jogadores", (req, res, next) => {
  const { nome, email, nickname } = req.body ?? {};
  if (
    !textoValido(nome, 100) ||
    !textoValido(email, 150) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !textoValido(nickname, 20) ||
    !/^[A-Za-z0-9_]{3,20}$/.test(nickname.trim())
  ) {
    return res.status(400).json({
      erro: "Informe nome (até 100 caracteres), email válido (até 150) e nickname com 3 a 20 letras, números ou sublinhado",
    });
  }
  const dados = {
    nome: nome.trim(),
    email: email.trim(),
    nickname: nickname.trim(),
  };

  conexao.query(
    "INSERT INTO jogadores (nome, email, nickname) VALUES (?, ?, ?)",
    [dados.nome, dados.email, dados.nickname],
    (erro, resultado) => {
      if (erro) return next(erro);
      return res.status(201).json({
        mensagem: "Jogador cadastrado com sucesso",
        id: resultado.insertId,
      });
    },
  );
});

app.put("/jogadores/:id", validarId, (req, res, next) => {
  const { nome, email, nickname } = req.body ?? {};
  if (
    !textoValido(nome, 100) ||
    !textoValido(email, 150) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !textoValido(nickname, 20) ||
    !/^[A-Za-z0-9_]{3,20}$/.test(nickname.trim())
  ) {
    return res.status(400).json({
      erro: "Informe nome (até 100 caracteres), email válido (até 150) e nickname com 3 a 20 letras, números ou sublinhado",
    });
  }
  const dados = {
    nome: nome.trim(),
    email: email.trim(),
    nickname: nickname.trim(),
  };

  // Consulta didática para confirmar que o registro existe antes de editar.
  conexao.query(
    "SELECT * FROM jogadores WHERE id = ?",
    [req.id],
    (erro, registros) => {
      if (erro) return next(erro);
      if (registros.length === 0) {
        return res.status(404).json({ erro: "Jogador não encontrado" });
      }
      conexao.query(
        "UPDATE jogadores SET nome = ?, email = ?, nickname = ? WHERE id = ?",
        [dados.nome, dados.email, dados.nickname, req.id],
        (erro, resultado) => {
          if (erro) return next(erro);
          return res
            .status(200)
            .json({ mensagem: "Jogador atualizado com sucesso" });
        },
      );
    },
  );
});

app.delete("/jogadores/:id", validarId, (req, res, next) => {
  conexao.query(
    "DELETE FROM jogadores WHERE id = ?",
    [req.id],
    (erro, resultado) => {
      if (erro) return next(erro);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: "Jogador não encontrado" });
      }
      return res.status(200).json({ mensagem: "Jogador excluído com sucesso" });
    },
  );
});

// #endregion jogadores

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});
app.use(tratarErro);

conexao.connect((erro) => {
  if (erro) {
    console.error("Erro ao conectar ao banco:", erro.code || erro.message);
    process.exit(1);
  }
  console.log("Conectado ao banco gamehub_db");
  const servidor = app.listen(PORTA, () => {
    console.log(`Servidor iniciado em http://localhost:${PORTA}`);
  });
  servidor.on("error", (erro) => {
    console.error("Erro ao iniciar servidor:", erro.code || erro.message);
    conexao.end(() => process.exit(1));
  });
});
