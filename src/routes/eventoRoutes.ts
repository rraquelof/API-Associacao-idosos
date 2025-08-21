import { Router } from "express";
import { addIdososEmEvento, createEvento, getEvento, getEventoById, updateEvento, deleteEvento } from "../controllers/eventoController";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { upload } from "../config/multer";
import { verifyCoordenador } from "../middlewares/verificarCoordenador";

const routerEvento = Router();

routerEvento.post('/cadastroEvento', authenticate, verifyCoordenador, upload.single("imagem"), createEvento);
routerEvento.post('/eventos/:id/idosos', authenticate, verifyCoordenador, addIdososEmEvento);
routerEvento.get('/eventos', authenticate, verifyCoordenador, getEvento);
routerEvento.get('/eventos/:id',authenticate, verifyCoordenador, getEventoById );
routerEvento.put('/eventos/:id', authenticate, verifyCoordenador, updateEvento);
routerEvento.delete('/eventos/:id',authenticate, verifyCoordenador, deleteEvento);

export default routerEvento;