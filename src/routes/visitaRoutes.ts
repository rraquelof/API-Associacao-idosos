import express from "express";
import { createVisita, deleteVisita, getVisitas, updateVisita} from "../controllers/visitaController";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { verifyCoordenador, verifyPodeAgendarVisita } from "../middlewares/verificarUser";

const router = express.Router();

// Qualquer usuário autenticado com acesso à área de Visitas pode ver a lista.
router.get("/visitas", authenticate, getVisitas);
// Coordenador, voluntário e familiar podem agendar uma visita.
router.post("/visita", authenticate, verifyPodeAgendarVisita, createVisita);
// Editar/excluir continua restrito a coordenador.
router.put("/visita/:id", authenticate, verifyCoordenador, updateVisita);
router.delete("/visita/:id", authenticate, verifyCoordenador, deleteVisita);

export default router;