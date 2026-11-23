import { Router } from "express";
import { conversarComAgente } from "../controllers/agenteController";
import { authenticate } from "../middlewares/autenticacaoMiddleware";

const router = Router();

router.post("/agente", authenticate, conversarComAgente);

export default router;
