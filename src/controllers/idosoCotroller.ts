import { Request, Response } from "express";
import { ZodError } from "zod";
import Idoso from "../models/idoso";
import { createIdosoSchema } from "../validations/idosoValidations";


export const creaateIdoso = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.tipo !== "coordenador") return res.status(401).json({ message: "Você não pode cadastrar um idoso. Deve ser o coordenador." });

    const data = createIdosoSchema.parse(req.body);

    const cpfExists = await Idoso.findOne({ cpf: data.cpf });
    if (cpfExists) return res.status(400).json({ message: "CPF já está cadastrado" });

    const rgExists = await Idoso.findOne({ rg: data.rg });
    if (rgExists) return res.status(400).json({ message: "RG já está cadastrado" });

    const susExists = await Idoso.findOne({ sus: data.sus });
    if (susExists) return res.status(400).json({ message: "SUS já está cadastrado" });

    const newIdoso = await Idoso.create(data);

    res.status(201).json({ message: "Idoso cadastrado com sucesso", newIdoso });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.issues });
    }
    res.status(500).json({ message: "Erro no servidor ao criar idoso" });
  }
}