import { Router } from "express";
import { authenticate } from "../middlewares/autenticacaoMiddleware";
import { createSaude, getSaude, getSaudeById, putSaude, deleteSaude } from "../controllers/saudeController";

const routerSaude = Router();

routerSaude.post('/cadastrarConsulta', authenticate, createSaude);
routerSaude.get('/saudeIdoso', authenticate, getSaude);
routerSaude.get('/saudeIdoso/:idosoId', authenticate, getSaudeById);
routerSaude.put('/saudeIdoso/:id', authenticate, putSaude); //id da consulta
routerSaude.delete('/saudeIdoso/:id', authenticate, deleteSaude); //id da consulta

export default routerSaude;