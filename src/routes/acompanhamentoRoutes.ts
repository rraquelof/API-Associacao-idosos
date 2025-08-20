import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createAcompanhamento, getAllAcompanhamentos, getAcompanhamentosByFamiliar, deleteAcompanhamento } from "../controllers/acompanhamentoController";

const router = Router();

router.use(authenticate);

router.post("/cadastrarAcompanhamento", createAcompanhamento);
router.get("/acompanhamentos", getAllAcompanhamentos);
router.get("/acompanhamento/familiar", getAcompanhamentosByFamiliar);
router.delete("/acompanhamento/:id", deleteAcompanhamento);

export default router;