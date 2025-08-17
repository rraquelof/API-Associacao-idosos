import { Request, Response } from "express";
import Evento from "../models/Evento";
import { ZodError } from "zod";
import { createEventoSchema } from "../validations/eventoValidations";
import idoso from "../models/idoso";

export const createEvento = async (req: Request, res: Response) => {
    try{ 
        if (!req.user || req.user.tipo !== "coordenador") return res.status(401).json({ message: "Você não pode cadastrar um evento. Deve ser o coordenador." });
        const data = createEventoSchema.parse(req.body);

        const newEvento = await Evento.create(data);

        res.status(201).json({ message: "Evento criado com sucesso", newEvento });

    } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.issues });
    }
    res.status(500).json({ message: "Erro no servidor ao criar evento" });
  }
}

export const addIdososEmEvento = async (req: Request, res: Response) => {
  try{
    if (!req.user || req.user.tipo !== "coordenador"){
      return res.status(401).json({ message: "Somente um coordenador pode adicionar um idoso ao evento" });
    } 

    const { id } = req.params;
    const { idosos } = req.body; //arrays de id dos idosos

    const evento = await Evento.findByIdAndUpdate(
      id,
      { $addToSet: {idosos: { $each: idosos} } }, //evitar duplicidade
      { new: true}
    ).populate("idosos");
    
    if(!evento){
      res.status(500).json({ message: "Erro ao achar o evento" });
    }
    res.status(200).json({ message: "Idoso adicionado com sucesso", evento});

  }catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar idosos", error: error.message });
  }
}