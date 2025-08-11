import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  tipo: string;
  iat: number;
  exp: number;
}

// estendendo a interface Request do Express para incluir 'user'
// Isso permite que o middleware autenticaçãoMiddleware.ts adicione o usuário decodificado ao objeto
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const tokenHeader = req.headers.authorization;

    if(!tokenHeader || !tokenHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: "Token não fornecido" });
    }
    const token = tokenHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }

}