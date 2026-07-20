import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) =>{
    if (error instanceof ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.issues });
    }

    res.status(500).json({ message: "Erro no servidor", error: error.message || error});
};