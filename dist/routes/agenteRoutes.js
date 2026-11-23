"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agenteController_1 = require("../controllers/agenteController");
const autenticacaoMiddleware_1 = require("../middlewares/autenticacaoMiddleware");
const router = (0, express_1.Router)();
router.post("/agente", autenticacaoMiddleware_1.authenticate, agenteController_1.conversarComAgente);
exports.default = router;
