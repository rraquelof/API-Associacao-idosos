import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const createUserSchema = z.object({
    nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
    email: z.string(),
    cpf: z.string().regex(cpfRegex, "Formato CPF inválido. Formato esperado: xxx.xxx.xxx-xx"),
    senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
    tipo: z.enum(['coordenador', 'voluntario', 'familiar', 'enfermeiro']),
    sexo: z.enum(['masculino', 'feminino']),
    endereco: z.string().min(5, "Endereço deve ter ao menos 5 caracteres"),
    telefone: z.string().min(10, "Telefone deve ter ao menos 10 caracteres"),
});

export const loginSchema = z.object({
    email: z.string(),
    senha: z.string().min(6),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>
export type LoginDTO = z.infer<typeof loginSchema>