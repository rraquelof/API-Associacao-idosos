import { Router } from "express";
import { createEvento } from "../controllers/eventoController";
import { authenticate } from "../middlewares/autenticacaoMiddleware";

const routerEvento = Router();

routerEvento.post('/cadastroEvento', authenticate, createEvento);

export default routerEvento;