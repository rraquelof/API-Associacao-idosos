import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createSaude, getSaude, getSaudeById, putSaude, deleteSaude } from "../controllers/saudeController";
import { verifyEnfermeiro } from "../middlewares/verificarUser";

const routerSaude = Router();

routerSaude.post('/cadastrarConsulta', authenticate, verifyEnfermeiro, createSaude);
routerSaude.get('/saudeIdoso', authenticate, getSaude);
routerSaude.get('/saudeIdoso/:Id', authenticate, getSaudeById);
routerSaude.put('/saudeIdoso/:id', authenticate, verifyEnfermeiro, putSaude);
routerSaude.delete('/saudeIdoso/:id', authenticate, verifyEnfermeiro, deleteSaude); 

export default routerSaude;