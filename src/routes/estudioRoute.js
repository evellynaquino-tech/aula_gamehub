import { Router } from "express";
import * as estudioController from "../controllers/estudioControllers.js";
import validarId from "../middlewares/validarId";

const Router = Router();

router.get("/estudios", estudioController.listar);
router.get("/estudios/:id", validarId, estudioController.buscarPorId);
router.post("/estudios", estudioController.criar);
router.put("/estudios/:id", validarId, estudioController.atualizar);
router.delete("/estudios/:id", validarId, estudioController.excluir);

export default router;
