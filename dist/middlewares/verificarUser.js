"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFamiliar = exports.verifyEnfermeiro = exports.verifyCoordenador = void 0;
const verifyCoordenador = (req, res, next) => {
    if (!req.user || req.user.tipo !== "coordenador") {
        return res.status(403).json({
            message: "Acesso negado: apenas coordenadores podem realizar está ação."
        });
    }
    next();
};
exports.verifyCoordenador = verifyCoordenador;
const verifyEnfermeiro = (req, res, next) => {
    if (!req.user || req.user.tipo !== "enfermeiro") {
        return res.status(403).json({
            message: "Somente enfermeiros podem realizar esta ação."
        });
    }
    next();
};
exports.verifyEnfermeiro = verifyEnfermeiro;
const verifyFamiliar = (req, res, next) => {
    if (!req.user || req.user.tipo !== "familiar") {
        return res.status(403).json({ message: "Somente familiares podem realizar esta ação."
        });
    }
    next();
};
exports.verifyFamiliar = verifyFamiliar;
