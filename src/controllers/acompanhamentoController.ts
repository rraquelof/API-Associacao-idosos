import { Request, Response } from "express";
import Idoso from "../models/idoso";
import Usuario from "../models/Usuario";
import Acompanhamento from "../models/Acompanhamento";

export const createAcompanhamento = async (req: Request, res: Response) => {
    try {
        const { usuarioId, idosoId } = req.body;

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario || usuario.tipo !== "familiar") return res.status(404).json({ message: "Usuário não encontrado ou não é um familiar" });

        const idoso = await Idoso.findById(idosoId);
        if (!idoso) return res.status(404).json({ message: "Idoso não encontrado" });

        const acompanhamento = await Acompanhamento.create({usuario: usuarioId, idoso: idosoId});
        return res.status(201).json(acompanhamento);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar acompanhamento", error });
    }
};

export const getAllAcompanhamentos = async (req:Request, res: Response) => {
    try {
        const acompanhamentos = await Acompanhamento.find().populate("usuario").populate("idoso");
        return res.status(200).json(acompanhamentos);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar acompanhamentos", error });
    }
};

// Acompanhamentos do familiar logado
export const getAcompanhamentosByFamiliar = async (req: Request, res: Response) => {
    try {
        if (req.user?.tipo !== "familiar") {
            return res.status(403).json({ message: "Acesso negado" });
        }

       const acompanhamentos = await Acompanhamento.find({ usuario: req.user.id }).populate("idoso");
       return res.json(acompanhamentos);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar acompanhamentos", error });
    }
};

export const deleteAcompanhamento = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await Acompanhamento.findByIdAndDelete(id);
        return res.status(200).json({ message: "Acompanhamento deletado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao deletar acompanhamento", error });
    }
};

//criar rota put
export const updateAcompanhamento = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { usuarioId, idosoId } = req.body;

        const acompanhamento = await Acompanhamento.findByIdAndUpdate(id, { usuario: usuarioId, idoso: idosoId }, { new: true });
        if (!acompanhamento) return res.status(404).json({ message: "Acompanhamento não encontrado" });

        return res.status(200).json(acompanhamento);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar acompanhamento", error });
    }
};
