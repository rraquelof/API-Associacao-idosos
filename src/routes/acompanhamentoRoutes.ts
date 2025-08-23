import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createAcompanhamento, getAllAcompanhamentos, getAcompanhamentosByFamiliar, deleteAcompanhamento, updateAcompanhamento } from "../controllers/acompanhamentoController";
import { verifyCoordenador } from "../middlewares/verificarUser";

const router = Router();

router.use(authenticate);

router.post("/cadastrarAcompanhamento", createAcompanhamento, verifyCoordenador);
router.get("/acompanhamentos", getAllAcompanhamentos, verifyCoordenador);
router.get("/acompanhamento/familiar", getAcompanhamentosByFamiliar, verifyCoordenador);
router.delete("/acompanhamento/:id", deleteAcompanhamento, verifyCoordenador);
router.put("/acompanhamento/:id", updateAcompanhamento, verifyCoordenador);

export default router;