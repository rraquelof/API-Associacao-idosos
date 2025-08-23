import { Router } from "express";
import { createIdoso, getIdosos, getIdosoById, updateIdoso, deleteIdoso } from "../controllers/idosoCotroller";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { verifyCoordenador } from "../middlewares/verificarUser";

const routerIdoso = Router();

routerIdoso.post('/cadastrarIdoso', authenticate, verifyCoordenador, createIdoso);
routerIdoso.get('/idosos', authenticate, verifyCoordenador, getIdosos);
routerIdoso.get('/idoso/:id', authenticate, verifyCoordenador, getIdosoById);
routerIdoso.put('/idoso/:id', authenticate, verifyCoordenador, updateIdoso);
routerIdoso.delete('/idoso/:id', authenticate, verifyCoordenador, deleteIdoso);

export default routerIdoso;