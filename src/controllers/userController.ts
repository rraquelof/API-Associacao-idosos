import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ZodError } from "zod";
import Usuario from "../models/Usuario";
import { createUserSchema, loginSchema } from "../validations/userValidations";

export const createUser = async (req: Request, res: Response) => {
    try {
        const data = createUserSchema.parse(req.body);

        const userExists = await Usuario.findOne({ email: data.email });
        if (userExists) return res.status(400).json({ message: 'Email já cadastrado' });

        const cpfExists = await Usuario.findOne({ cpf: data.cpf });
        if (cpfExists) return res.status(400).json({ message: 'CPF já cadastrado' });

        const passwordHash = await bcrypt.hash(data.senha, 10);
        const newUser = new Usuario({ ...data, senha: passwordHash });
        await newUser.save();

        res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: "Dados inválidos", errors: error.issues });
        }
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);

        const user = await Usuario.findOne({ email: data.email });
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        const validPassword = await bcrypt.compare(data.senha, user.senha);
        if (!validPassword) return res.status(401).json({ message: "Senha inválida" });

        const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo
            }
        });
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: "Dados inválidos", errors: error.issues });
        }
        res.status(500).json({ message: "Erro ao fazer login" });
    }
}