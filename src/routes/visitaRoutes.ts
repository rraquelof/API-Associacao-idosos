import express from "express";
import { createVisita, deleteVisita, getVisitas, updateVisita} from "../controllers/visitaController";

const router = express.Router();

router.post("/visita", createVisita);
router.get("/visitas", getVisitas);
router.put("/visita/:id", updateVisita);
router.delete("/visita/:id", deleteVisita);

export default router;