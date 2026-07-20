"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
exports.createUserSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
    email: zod_1.z.string(),
    cpf: zod_1.z.string().regex(cpfRegex, "Formato CPF inválido. Formato esperado: xxx.xxx.xxx-xx"),
    senha: zod_1.z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
    tipo: zod_1.z.enum(['coordenador', 'voluntario', 'familiar', 'enfermeiro']),
    sexo: zod_1.z.enum(['masculino', 'feminino']),
    endereco: zod_1.z.string().min(5, "Endereço deve ter ao menos 5 caracteres"),
    telefone: zod_1.z.string().min(10, "Telefone deve ter ao menos 10 caracteres"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    senha: zod_1.z.string().min(6),
});
