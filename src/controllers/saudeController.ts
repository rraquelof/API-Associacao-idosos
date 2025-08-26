import { Request, Response } from "express";
import Idoso from "../models/idoso";
import Saude from "../models/Saude";
import { createSaudeSchema } from "../validations/saudeValidations";
import Usuario from "../models/usuario";

export const createSaude = async (req: Request, res: Response) => {
    const { usuarioId, idosoId } = req.body;
  
    const idosoExistente = await Idoso.findById(idosoId);
    if (!idosoExistente) { 
        return res.status(404).json({ message: "Idoso não encontrado" });
    }

    const data = createSaudeSchema.parse(req.body);
 
    const saude = await Saude.create({
      ...data,
      usuario: usuarioId,
      idoso: idosoId
    });

    return res.status(201).json({ message: "Acompanhamento de saúde registrado com sucesso!", saude });
}

export const getSaude = async (req: Request, res: Response) => {
  const consultas = await Saude.find().sort({ dataConsulta: -1 });

  if (consultas.length === 0) {
    return res.status(404).json({ message: "Nenhum registro de consulta encontrado." });
  }

  return res.status(200).json(consultas);
};

export const getSaudeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const consulta = await Saude.findById(id);

  if (!consulta) {
    return res
      .status(404)
      .json({ message: "Nenhum registro de consulta encontrado." });
  }

  return res.status(200).json(consulta);
};

export const putSaude = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = createSaudeSchema.parse(req.body);
  
  const consulta = await Saude.findByIdAndUpdate(id, data, { new: true });

  if (!consulta) {
    return res.status(404).json({ message: "Nenhum registro de consulta encontrado." });
  }

  return res.status(200).json({ message: "Atualizado com sucesso!", consulta });
}

// Essa função irá excluir apenas a consulta em específico
export const deleteSaude = async (req: Request, res: Response) => {
  const { id } = req.params;
  const consulta = await Saude.findByIdAndDelete(id);

  if (!consulta) {
    return res.status(404).json({ message: "Nenhum registro de consulta encontrado." });
  }

  return res.status(200).json({ message: "Deletado com sucesso!", consulta });
}
