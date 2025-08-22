import { Request, Response } from "express";
import Evento from "../models/Evento";
import { any, ZodError } from "zod";
import { createEventoSchema } from "../validations/eventoValidations";

export const createEvento = async (req: Request, res: Response) => {
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
}

export const addIdososEmEvento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { idosos } = req.body; //arrays de id dos idosos

  const evento = await Evento.findByIdAndUpdate(
    id,
    { $addToSet: {idosos: { $each: idosos} } }, //evitar duplicidade
    { new: true}
  ).populate("idosos");
    
  if(!evento){
    res.status(404).json({ message: "Nenhum evento encontrado" });
  }
  res.status(200).json({ message: "Idoso adicionado com sucesso", evento});
}

export const getEvento = async (req: Request, res: Response) => {
  const evento = await Evento.find();
  
  if(!evento){
    return res.status(404).json({ message: "Nenhum evento encontrado"});
  }
  res.status(200).json(evento);
}

export const getEventoById = async (req: Request, res: Response) =>{
  const evento = await Evento.findById(req.params.id); 
  if(!evento){
    return res.status(404).json({ message: "Nenhum evento encontrado"});
  }
  res.status(200).json(evento);
}

export const updateEvento = async (req: Request, res: Response) => {
  const evento = await Evento.findByIdAndUpdate(
    req.params.id, 
    req.body,
    { new:true }
  );

  if(!evento){
    res.status(404).json("Evento não encontrado.");
  }
  res.status(200).json({message: "Evento atualizado com sucesso!", evento});
}

export const deleteEvento = async(req: Request, res: Response) => {
  const evento = await Evento.findByIdAndDelete(req.params.id);
  if(!evento){
    res.status(404).json("Evento não encontrado.");
  }
  res.status(200).json({message: "Evento deletado com sucesso!", evento});
}