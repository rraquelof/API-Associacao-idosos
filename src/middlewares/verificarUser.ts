import { verify } from "crypto";
import { Request, Response, NextFunction } from "express";

export const verifyCoordenador = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.tipo !== "coordenador") {
    return res.status(403).json({
      message: "Acesso negado: apenas coordenadores podem realizar está ação."
    });
  }
  next();
};

export const verifyEnfermeiro = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.tipo !== "enfermeiro") {
    return res.status(403).json({
      message: "Somente enfermeiros podem realizar esta ação."
    });
  }
  next();
};
export const verifyFamiliar = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.tipo !== "familiar") {
    return res.status(403).json({ message: "Somente familiares podem realizar esta ação."
    });
  }
  next();
};
