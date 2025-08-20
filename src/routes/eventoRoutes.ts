import { Router } from "express";
import { addIdososEmEvento, createEvento } from "../controllers/eventoController";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { upload } from "../config/multer";

const routerEvento = Router();

routerEvento.post('/cadastroEvento', authenticate, upload.single("imagem"), createEvento);
routerEvento.post('/eventos/:id/idosos', authenticate, addIdososEmEvento);

export default routerEvento;