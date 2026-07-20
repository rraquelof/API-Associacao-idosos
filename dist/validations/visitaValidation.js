"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVisitaSchema = void 0;
const zod_1 = require("zod");
exports.createVisitaSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
    data: zod_1.z.date().optional(),
    telefone: zod_1.z.string().optional()
});
