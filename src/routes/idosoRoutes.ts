import { Router } from "express";
import { createIdoso, getIdosos, getIdosoById, updateIdoso, deleteIdoso } from "../controllers/idosoCotroller";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { verifyCoordenador } from "../middlewares/verificarUser";
import upload from "../middlewares/multer"; 

const routerIdoso = Router();

routerIdoso.post('/cadastrarIdoso', authenticate, verifyCoordenador, upload.single("foto"), createIdoso);
routerIdoso.get('/idosos', authenticate, getIdosos);
routerIdoso.get('/idoso/:id', authenticate, getIdosoById);
routerIdoso.put('/idoso/:id', authenticate, verifyCoordenador, upload.single("foto"), updateIdoso);
routerIdoso.delete('/idoso/:id', authenticate, verifyCoordenador, deleteIdoso);

export default routerIdoso;