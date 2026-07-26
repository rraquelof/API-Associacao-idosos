import { Request, Response } from "express";
import Visita from "../models/Visita";
import { createVisitaSchema } from "../validations/visitaValidation";

export const createVisita = async (req: Request, res: Response) => {
     const data = createVisitaSchema.parse(req.body);

    const newVisita = new Visita(data);
    await newVisita.save();

    res.status(201).json(newVisita);

}

export const getVisitas = async (req: Request, res: Response) => {
    const { data } = req.query;
    const filtro = data ? { data } : {};
    const visitas = await Visita.find(filtro);
    res.status(200).json(visitas);
}

export const getVisitaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const visita = await Visita.findById(id)
   
  if (!visita) {
    return res
      .status(404)
      .json({ message: "Nenhum registro de visita encontrado." });
  }

  return res.status(200).json(visita);
};

export const updateVisita = async (req: Request, res: Response) => {
    const visita = await Visita.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!visita) return res.status(404).json({ message: "Visita não encontrada" });
    res.status(200).json({ message: "Visita atualizada com sucesso" });
}

export const deleteVisita = async (req: Request, res: Response) => {
    const visita = await Visita.findByIdAndDelete(req.params.id);
    if (!visita) return res.status(404).json({ message: "Visita não encontrada" });
    res.status(200).json({ message: "Visita removida" });
}