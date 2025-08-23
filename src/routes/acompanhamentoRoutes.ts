import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createAcompanhamento, getAllAcompanhamentos, getAcompanhamentosByFamiliar, deleteAcompanhamento, updateAcompanhamento } from "../controllers/acompanhamentoController";
import { verifyCoordenador } from "../middlewares/verificarUser";

const router = Router();

router.use(authenticate);

router.post("/cadastrarAcompanhamento", verifyCoordenador, createAcompanhamento);
router.get("/acompanhamentos", verifyCoordenador, getAllAcompanhamentos, verifyCoordenador);
router.get("/acompanhamento/familiar", verifyCoordenador, getAcompanhamentosByFamiliar);
router.delete("/acompanhamento/:id", verifyCoordenador, deleteAcompanhamento);
router.put("/acompanhamento/:id", verifyCoordenador, updateAcompanhamento,);

export default router;