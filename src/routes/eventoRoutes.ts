import { Router } from "express";
import { addIdososEmEvento, createEvento } from "../controllers/eventoController";
import { authenticate } from "../middlewares/autenticacaoMiddleware";

const routerEvento = Router();

routerEvento.post('/cadastroEvento', authenticate, createEvento);
routerEvento.post('/eventos/:id/idosos', authenticate, addIdososEmEvento);

export default routerEvento;