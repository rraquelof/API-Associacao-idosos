import { z } from "zod";

export const createEventoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional(),
  data: z.coerce.date(), 
  imagem: z.string().optional(), 
  local: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([
      z.coerce.number(), // longitude
      z.coerce.number()  // latitude
    ])
  }),
  idosos: z.array(z.string()).optional()
});

export type CreateEventoDTO = z.infer<typeof createEventoSchema>;