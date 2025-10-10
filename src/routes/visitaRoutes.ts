import express from "express";
import { createVisita} from "../controllers/visitaController";

const router = express.Router();

router.post("/visita", createVisita);

export default router;