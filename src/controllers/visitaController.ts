import { Request, Response } from "express";
import Visita from "../models/Visita";
import { createVisitaSchema } from "../validations/visitaValidation";

export const createVisita = async (req: Request, res: Response) => {
     const data = createVisitaSchema.parse(req.body);

    const newVisita = new Visita(data);
    await newVisita.save();

    res.status(201).json(newVisita);

}