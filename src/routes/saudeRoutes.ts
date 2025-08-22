import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createSaude, getSaude} from "../controllers/saudeController";

const routerSaude = Router();

routerSaude.post('/cadastrarSaude', authenticate, createSaude);
routerSaude.get('/saudeIdoso', authenticate, getSaude);

export default routerSaude;