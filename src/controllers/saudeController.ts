import { Request, Response } from "express";
import idoso from "../models/idoso";
import Saude from "../models/Saude";
import { createSaudeSchema } from "../validations/saudeValidations";
import Usuario from "../models/Usuario";
import { id } from "zod/v4/locales/index.cjs";

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
    const consulta = await Saude.find({ idoso: idosoId }).sort({ dataConsulta: -1 });//retorna os registros de todos os idosos

    if (!consulta) {
      return res.status(404).json({ message: "Nenhum registro de consulta encontrado" });
    }

    return res.status(200).json(consulta);
}
export const getSaudeById = async (req: Request, res: Response) => {
  const consultas = await Saude.find({ idosoId: req.params.idosoId }).sort({ dataConsulta: -1 });
  if(consultas.length === 0){
    res.status(404).json({ message: "Nenhum registro de consulta encontrado."})
  }
  res.status(200).json(consultas);
}

export const putSaude = async (req: Request, res: Response) =>{
  const usuarioTipo = req.user?.tipo;
  if (usuarioTipo !== "enfermeiro") {
    return res.status(401).json({ message: "Somente enfermeiros podem registrar acompanhamento de saúde" });
  }
  const consulta = await Saude.findByIdAndUpdate(
    req.params.id, 
    req.body,
    { new:true }
    );

    if(!consulta){
      return res.status(404).json({ message:"Nenhum registro de consulta encontrado. "})
    }
    res.status(200).json({message: "Atualizado com sucesso!", consulta});
}

//essa função irá excluir apenas a consulta em específico.
export const deleteSaude = async (req: Request, res: Response) => {
  const usuarioTipo = req.user?.tipo;
  if (usuarioTipo !== "enfermeiro") {
    return res.status(401).json({ message: "Somente enfermeiros podem registrar acompanhamento de saúde" });
  }

  const consulta = await Saude.findByIdAndDelete(req.params.id);
  if(!consulta){
    return res.status(404).json({message:"Nenhum registro de consulta encontrado."})
  }
  res.status(200).json({message:"Deletado com sucesso!", consulta});
}

