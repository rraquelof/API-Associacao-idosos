"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (error, req, res, next) => {
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.issues });
    }
    res.status(500).json({ message: "Erro no servidor", error: error.message || error });
};
exports.errorHandler = errorHandler;
