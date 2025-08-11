import { z } from 'zod';

export const createUserSchema = z.object({
    nome: z.string().min(3),
    email: z.string(),
    cpf: z.string().min(11),
    senha: z.string().min(6),
    tipo: z.enum(['coordenador', 'voluntario', 'familiar', 'enfermeiro']),
    sexo: z.enum(['masculino', 'feminino']),
    endereco: z.string().min(5),
    telefone: z.string().min(10),
});

export const loginSchema = z.object({
    email: z.string(),
    senha: z.string().min(6),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>
export type LoginDTO = z.infer<typeof loginSchema>