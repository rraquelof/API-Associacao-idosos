import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createAcompanhamento, getAllAcompanhamentos, getAcompanhamentosById, deleteAcompanhamento, updateAcompanhamento } from "../controllers/acompanhamentoController";
import { verifyCoordenador, verifyFamiliar } from "../middlewares/verificarUser";

const router = Router();

router.use(authenticate);

router.post("/cadastrarAcompanhamento", authenticate, verifyCoordenador, createAcompanhamento);
router.get("/acompanhamentos", authenticate, verifyCoordenador, getAllAcompanhamentos);
router.get("/acompanhamento/:id", authenticate, verifyCoordenador, getAcompanhamentosById);
router.delete("/acompanhamento/:id", authenticate, verifyCoordenador, deleteAcompanhamento);
router.put("/acompanhamento/:id", authenticate, verifyCoordenador, updateAcompanhamento,);

export default router;