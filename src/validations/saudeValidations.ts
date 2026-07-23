import { z } from "zod";

export const createSaudeSchema = z.object({
  usuarioId: z.string(),
  idosoId: z.string(),
  dataConsulta: z.string().optional(),

  altura: z.number().positive("Altura deve ser maior que zero"),
  peso: z.number().positive("Peso deve ser maior que zero"),

  pressao: z.string().regex(
    /^\d{2,3}\/\d{2,3}$/,
    "Pressão deve estar no formato xxx/xx"
  ),

  alergias: z.array(z.string()).optional(),
  glicemia: z.number().nonnegative("Glicemia não pode ser negativa"),
  doencasCronicas: z.array(z.string()).optional(),

  estadoNutricional: z.enum([
    "normal",
    "baixo peso",
    "sobrepeso"
  ]),
});

export type CreateIdosoDTO = z.infer <typeof createSaudeSchema>