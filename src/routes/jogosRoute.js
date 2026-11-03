import { Router } from "express";
import * as jogosController from "../controllers/jogosControllers.js";
import validarId from "../middlewares/validarId";

const Router = Router();

router.get("/jogos", jogosController.listar);
router.get("/jogos/:id", validarId, jogosController.buscarPorId);
router.post("/jogos", jogosController.criar);
router.put("/jogos/:id", validarId, jogosController.atualizar);
router.delete("/jogos/:id", validarId, jogosController.excluir);

export default router;
