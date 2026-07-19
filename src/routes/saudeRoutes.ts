import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createSaude, getSaude, getSaudeById, putSaude, deleteSaude } from "../controllers/saudeController";
import { verifyPodeRegistrarSaude } from "../middlewares/verificarUser";

const routerSaude = Router();

routerSaude.post('/cadastrarConsulta', authenticate, verifyPodeRegistrarSaude, createSaude);
routerSaude.get('/saudeIdoso', authenticate, getSaude);
routerSaude.get('/saudeIdoso/:id', authenticate, getSaudeById);
routerSaude.put('/saudeIdoso/:id', authenticate, verifyPodeRegistrarSaude, putSaude);
routerSaude.delete('/saudeIdoso/:id', authenticate, verifyPodeRegistrarSaude, deleteSaude);

export default routerSaude;