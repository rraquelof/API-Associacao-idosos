import { Request, Response } from "express";
import idoso from "../models/idoso";
import Saude from "../models/Saude";
import { createSaudeSchema } from "../validations/saudeValidations";
import Usuario from "../models/Usuario";

export const createSaude = async (req: Request, res: Response) => {
    const { usuarioId, idosoId } = (req.body);
    
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario || usuario.tipo !== "enfermeiro") {
      return res.status(401).json({ message: "Somente enfermeiros podem registrar acompanhamento de saúde" });
    }

    const idosos = await idoso.findById(idosoId);
    if(!idosos){ 
        return res.status(401).json({ message: "Idoso não encontrado"});
    }

    const data = createSaudeSchema.parse(req.body);
    // Cria o acompanhamento
    const saude = await Saude.create({
      ...data,
      usuario: usuarioId,
      idosos: idosoId
    });

    return res.status(201).json({ message: "Acompanhamento de saúde registrado com sucesso!", saude });
}

export const getSaude = async (req: Request, res: Response) => {
    const { idosoId } = req.params; // pegar idoso específico 

    // Busca todos os registros do idoso
    const saude = await Saude.find({ idoso: idosoId }).sort({ dataConsulta: -1 });//retorna os registros de todos os idosos

    if (!saude) {
      return res.status(404).json({ message: "Nenhum registro de consulta encontrado" });
    }

    return res.status(200).json(saude);
}

