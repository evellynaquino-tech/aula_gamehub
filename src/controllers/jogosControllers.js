import * as jogosModel from "./models/jogosModel.js";
import { textoValido } from "../utils/validacoes.js";

export function listar(req, res, next) {
  jogosModel.listar("SELECT * FROM jogos ORDER BY id", (erro, resultado) => {
    if (erro) return next(erro);
    return res.status(200).json(resultado);
  });
}

export function buscarPorId(req, res, next) {
  jogosModel.buscarPorId(
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
}

export function criar(req, res, next) {
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

  jogosModel.criar(
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
}

export function atualizar(req, res, next) {
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
  jogosModel.buscarPorId(
    "SELECT * FROM jogos WHERE id = ?",
    [req.id],
    (erro, registros) => {
      if (erro) return next(erro);
      if (registros.length === 0) {
        return res.status(404).json({ erro: "Jogo não encontrado" });
      }
      jogosModel.atualizar(
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
}

export function excluir(req, res, next) {
  jogosModel.excluir(
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
}
