import { Request, Response } from "express";
import Idoso from "../models/idoso";
import Usuario from "../models/usuario";
import Acompanhamento from "../models/acompanhamento";

export const createAcompanhamento = async (req: Request, res: Response) => {
        const { usuarioId, idosoId } = req.body;

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario || usuario.tipo !== "familiar") return res.status(404).json({ message: "Usuário não encontrado ou não é um familiar" });

        const idoso = await Idoso.findById(idosoId);
        if (!idoso) return res.status(404).json({ message: "Idoso não encontrado" });

        const acompanhamento = await Acompanhamento.create({usuario: usuarioId, idoso: idosoId});
        return res.status(201).json(acompanhamento);
};

export const getAllAcompanhamentos = async (req:Request, res: Response) => {
        const acompanhamentos = await Acompanhamento.find().populate("usuario").populate("idoso");

        if (acompanhamentos.length === 0) {
            return res.status(404).json({ message: "Nenhum acompanhamento encontrado" });
        }

        return res.status(200).json(acompanhamentos);
};

// Acompanhamentos do familiar logado
export const getAcompanhamentosByFamiliar = async (req: Request, res: Response) => {
        if (req.user?.tipo !== "familiar") {
            return res.status(403).json({ message: "Acesso negado" });
        }

       const acompanhamentos = await Acompanhamento.find({ usuario: req.user.id }).populate("idoso");
       return res.json(acompanhamentos);
};

export const deleteAcompanhamento = async (req: Request, res: Response) => {
    const id = req.params.id;
    await Acompanhamento.findByIdAndDelete(id);
    return res.status(200).json({ message: "Acompanhamento deletado com sucesso" });
};

export const updateAcompanhamento = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { usuarioId, idosoId } = req.body;

        const acompanhamento = await Acompanhamento.findByIdAndUpdate(id, { usuario: usuarioId, idoso: idosoId }, { new: true });
        if (!acompanhamento) return res.status(404).json({ message: "Acompanhamento não encontrado" });

        return res.status(200).json(acompanhamento);
};
