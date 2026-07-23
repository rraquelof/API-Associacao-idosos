import { Request, Response } from "express";
import Evento from "../models/evento";
import { createEventoSchema } from "../validations/eventoValidations";

export const createEvento = async (req: Request, res: Response) => {
    let body: any = { ...req.body };

    if (body.local && typeof body.local === "string") {
      body.local = JSON.parse(body.local);
    }
    if (body.idosos && typeof body.idosos === "string") {
  body.idosos = JSON.parse(body.idosos);
}
    if (req.file) {
      body.imagem = `/uploads/${req.file.filename}`;
    }

    const data = createEventoSchema.parse(body);
    const newEvento = await Evento.create(data);

    res.status(201).json({message: "Evento criado com sucesso", newEvento});
}

export const addIdososEmEvento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { idosos } = req.body; 

  const evento = await Evento.findByIdAndUpdate(
    id,
    { $set: { idosos: idosos } }, 
    { new: true }
  ).populate("idosos");
    
  if(!evento){
    return res.status(404).json({ message: "Nenhum evento encontrado" }); 
  }
  
  res.status(200).json({ message: "Lista de participantes atualizada com sucesso", evento });
}

export const getEvento = async (req: Request, res: Response) => {
  const evento = await Evento.find();
  
  if(!evento){
    return res.status(404).json({ message: "Nenhum evento encontrado"});
  }
    const host = req.protocol + '://' + req.get('host'); 
  const eventosComLink = evento.map((e: any) => ({
    ...e.toObject(), 
    imagem: e.imagem ? `${host}${e.imagem}` : null
  }));

  res.status(200).json(eventosComLink);
}

export const getEventoById = async (req: Request, res: Response) =>{
  const evento = await Evento.findById(req.params.id); 
  if(!evento){
    return res.status(404).json({ message: "Nenhum evento encontrado"});
  }
  res.status(200).json(evento);
}

export const updateEvento = async (req: Request, res: Response) => {
  let body: any = { ...req.body };

  if (body.local && typeof body.local === "string") {
    body.local = JSON.parse(body.local);
  }

  if (req.file) {
    body.imagem = `/uploads/${req.file.filename}`;
  }

  const evento = await Evento.findByIdAndUpdate(
    req.params.id, 
    body,
    { new: true }
  );

  if (!evento) {
    return res.status(404).json("Evento não encontrado.");
  }
  
  res.status(200).json({ message: "Evento atualizado com sucesso!", evento });
}

export const deleteEvento = async(req: Request, res: Response) => {
  const evento = await Evento.findByIdAndDelete(req.params.id);
  if(!evento){
    res.status(404).json("Evento não encontrado.");
  }
  res.status(200).json({message: "Evento deletado com sucesso!", evento});
}