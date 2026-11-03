import { Router } from "express";
import * as jogadoresControllers from "../controllers/jogadoresControllers.js";
import validarId from "../middlewares/validarId";

const Router = Router();

router.get("/jogadores", jogadoresControllers.listar);
router.get("/jogadores/:id", validarId, jogadoresControllers.buscarPorId);
router.post("/jogadores", jogadoresControllers.criar);
router.put("/jogadores/:id", validarId, jogadoresControllers.atualizar);
router.delete("/jogadores/:id", validarId, jogadoresControllers.excluir);

export default router;
