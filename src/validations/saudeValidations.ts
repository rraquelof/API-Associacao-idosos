import { z } from "zod";

export const createSaudeSchema = z.object({
  usuarioId: z.string(),
  idosoId: z.string(),
  dataConsulta: z.string().optional(), // geralmente vem default
  altura: z.number().positive("Altura deve ser maior que zero").optional(),
  peso: z.number().positive("Peso deve ser maior que zero").optional(),
  pressao: z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Pressão deve estar no formato 120/80"),
  alergias: z.string().optional(),
  glicemia: z.number().nonnegative("Glicemia não pode ser negativa").optional(),
  doencasCronicas: z.string().optional(),
  estadoNutricional: z.string().optional(),
});