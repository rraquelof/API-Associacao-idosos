import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createAcompanhamento, getAllAcompanhamentos, getAcompanhamentosByFamiliar, deleteAcompanhamento } from "../controllers/acompanhamentoController";

const router = Router();

router.use(authenticate);

router.post("/", createAcompanhamento);
router.get("/", getAllAcompanhamentos);
router.get("/familiar", getAcompanhamentosByFamiliar);
router.delete("/:id", deleteAcompanhamento);

export default router;