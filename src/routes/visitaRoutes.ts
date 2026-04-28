import express from "express";
import { createVisita, deleteVisita, getVisitas, updateVisita} from "../controllers/visitaController";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { verifyCoordenador } from "../middlewares/verificarUser";

const router = express.Router();

router.post("/visita", authenticate, verifyCoordenador, createVisita);
router.get("/visitas", authenticate, verifyCoordenador, getVisitas);
router.put("/visita/:id", authenticate, verifyCoordenador, updateVisita);
router.delete("/visita/:id", authenticate, verifyCoordenador, deleteVisita);

export default router;