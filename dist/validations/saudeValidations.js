"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSaudeSchema = void 0;
const zod_1 = require("zod");
exports.createSaudeSchema = zod_1.z.object({
    usuarioId: zod_1.z.string(),
    idosoId: zod_1.z.string(),
    dataConsulta: zod_1.z.string().optional(), // geralmente vem default
    altura: zod_1.z.number().positive("Altura deve ser maior que zero").optional(),
    peso: zod_1.z.number().positive("Peso deve ser maior que zero").optional(),
    pressao: zod_1.z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Pressão deve estar no formato xxx/xx"),
    alergias: zod_1.z.string().optional(),
    glicemia: zod_1.z.number().nonnegative("Glicemia não pode ser negativa").optional(),
    doencasCronicas: zod_1.z.string().optional(),
    estadoNutricional: zod_1.z.string().optional(),
});
