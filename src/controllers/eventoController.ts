import { Request, Response } from "express";
import Evento from "../models/Evento";
import { ZodError } from "zod";
import { createEventoSchema } from "../validations/eventoValidations";
import idoso from "../models/idoso";

export const createEvento = async (req: Request, res: Response) => {
    try{ 
        if (!req.user || req.user.tipo !== "coordenador") return res.status(401).json({ message: "Você não pode cadastrar um evento. Deve ser o coordenador." });
    // Copia o body e faz parse de objetos/arrays vindos do form-data
    let body: any = { ...req.body };

    // Parse do local (se veio como string JSON)
    if (body.local && typeof body.local === "string") {
      body.local = JSON.parse(body.local);
    }
    // Adiciona o caminho da imagem
    if (req.file) {
      body.imagem = `/uploads/${req.file.filename}`;
    }

    // Valida com Zod usando o objeto já processado
    const data = createEventoSchema.parse(body);

    // Criação no MongoDB
    const newEvento = await Evento.create(data);

    res.status(201).json({message: "Evento criado com sucesso", newEvento});

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