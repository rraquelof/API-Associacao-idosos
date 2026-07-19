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

// Coordenador, voluntário e familiar podem agendar/gerenciar visitas
// (o familiar precisa poder agendar a visita ao próprio idoso).
export const verifyPodeAgendarVisita = (req: Request, res: Response, next: NextFunction) => {
  const tiposPermitidos = ["coordenador", "voluntario", "familiar"];
  if (!req.user || !tiposPermitidos.includes(req.user.tipo)) {
    return res.status(403).json({
      message: "Acesso negado: você não tem permissão para gerenciar visitas."
    });
  }
  next();
};

// Enfermeiro e coordenador podem registrar/editar/excluir acompanhamento de saúde.
export const verifyPodeRegistrarSaude = (req: Request, res: Response, next: NextFunction) => {
  const tiposPermitidos = ["enfermeiro", "coordenador"];
  if (!req.user || !tiposPermitidos.includes(req.user.tipo)) {
    return res.status(403).json({
      message: "Somente enfermeiros ou coordenadores podem realizar esta ação."
    });
  }
  next();
};
