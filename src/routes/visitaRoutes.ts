import express from "express";
import { createVisita, deleteVisita, getVisitas, updateVisita, getVisitaById} from "../controllers/visitaController";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { verifyCoordenador, verifyPodeAgendarVisita } from "../middlewares/verificarUser";

const router = express.Router();

router.get("/visitas", authenticate, getVisitas);
router.get("/visita/:id", authenticate, verifyCoordenador, getVisitaById);
router.post("/visita", authenticate, verifyPodeAgendarVisita, createVisita);
router.put("/visita/:id", authenticate, verifyCoordenador, updateVisita);
router.delete("/visita/:id", authenticate, verifyCoordenador, deleteVisita);

export default router;