import { Router } from "express";
import { creaateIdoso } from "../controllers/idosoCotroller";
import { authenticate } from "../middlewares/autenticacaoMiddleware";

const routerIdoso = Router();

routerIdoso.post('/cadastrar', authenticate, creaateIdoso);

export default routerIdoso;