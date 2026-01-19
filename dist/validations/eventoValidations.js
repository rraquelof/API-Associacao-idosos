"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventoSchema = void 0;
const zod_1 = require("zod");
exports.createEventoSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    descricao: zod_1.z.string().optional(),
    data: zod_1.z.coerce.date(),
    imagem: zod_1.z.string().optional(),
    local: zod_1.z.object({
        type: zod_1.z.literal("Point"),
        coordinates: zod_1.z.tuple([
            zod_1.z.coerce.number(), // longitude
            zod_1.z.coerce.number() // latitude
        ])
    }),
    idosos: zod_1.z.array(zod_1.z.string()).optional()
});
