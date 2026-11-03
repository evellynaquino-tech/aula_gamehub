import { Router } from "express";
import * as jogadoresControllers from "../controllers/jogadoresControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", jogadoresControllers.listar);
router.get("/:id", validarId, jogadoresControllers.buscarPorId);
router.post("/", jogadoresControllers.criar);
router.put("/:id", validarId, jogadoresControllers.atualizar);
router.delete("/:id", validarId, jogadoresControllers.excluir);

export default router;
