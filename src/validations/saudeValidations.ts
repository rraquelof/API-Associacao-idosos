import { z } from "zod";

export const createSaudeSchema = z.object({
  idosoId: z.string(),
  dataConsulta: z.string().optional(), 
  altura: z.number().positive("Altura deve ser maior que zero"),
  peso: z.number().positive("Peso deve ser maior que zero"),
  pressao: z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Pressão deve estar no formato xxx/xx"),
  alergias: z.string().optional(),
  glicemia: z.number().nonnegative("Glicemia não pode ser negativa"),
  doencasCronicas: z.string().optional(),
  estadoNutricional: z.string(),
});

export type CreateIdosoDTO = z.infer <typeof createSaudeSchema>