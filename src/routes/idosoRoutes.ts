import { Router } from "express";
import { createIdoso, getIdosos, getIdosoByCpf, updateIdoso, deleteIdoso } from "../controllers/idosoCotroller";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { verifyCoordenador } from "../middlewares/verificarCoordenador";

const routerIdoso = Router();

routerIdoso.post('/cadastrarIdoso', authenticate, verifyCoordenador, createIdoso);
routerIdoso.get('/idosos', authenticate, verifyCoordenador, getIdosos);
routerIdoso.get('/idoso/:cpf', authenticate, verifyCoordenador, getIdosoByCpf);
routerIdoso.put('/idoso/:cpf', authenticate, verifyCoordenador, updateIdoso);
routerIdoso.delete('/idoso/:cpf', authenticate, verifyCoordenador, deleteIdoso);

export default routerIdoso;