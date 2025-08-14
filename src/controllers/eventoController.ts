import { Request, Response } from "express";
import Evento from "../models/Evento";
import { ZodError } from "zod";
import { createEventoSchema } from "../validations/eventoValidations";

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