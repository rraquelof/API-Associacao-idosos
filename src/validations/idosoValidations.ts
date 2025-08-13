import { z } from 'zod'

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const rgRegex = /^\d{1}\.\d{3}\.\d{3}$/;
const susRegex = /^\d{15}$/;

export const createIdosoSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cpf: z.string().regex(cpfRegex, "Formato CPF inválido. Formato esperado: xxx.xxx.xxx-xx"),
    rg: z.string().regex(rgRegex, "Formato RG inválido. Formato esperado: x.xxx.xxx"),
    sus: z.string().regex(susRegex, "Formato SUS inválido. Cartão SUS deve conter 15 dígitos"),
    data_nascimento: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Data de nascimento inválida" }),
    sexo: z.enum(['masculino', 'feminino'], "Sexo deve ser 'masculino' ou 'feminino'"),
    nacionalidade: z.string().min(3, "Nacionalidade deve ter pelo menos 3 caracteres"),
    naturalidade: z.string().min(3, "Naturalidade deve ter pelo menos 3 caracteres")
}); 

export type CreateIdosoDTO = z.infer <typeof createIdosoSchema>