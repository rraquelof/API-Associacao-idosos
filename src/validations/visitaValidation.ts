import { z } from "zod";

export const createVisitaSchema = z.object({
    nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
    data: z.coerce.date().optional(),
    telefone: z.string().optional()
});

export type CreateVisitaDTO = z.infer<typeof createVisitaSchema>;