"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAcompanhamento = exports.deleteAcompanhamento = exports.getAcompanhamentosById = exports.getAllAcompanhamentos = exports.createAcompanhamento = void 0;
const idoso_1 = __importDefault(require("../models/idoso"));
const usuario_1 = __importDefault(require("../models/usuario"));
const acompanhamento_1 = __importDefault(require("../models/acompanhamento"));
const createAcompanhamento = async (req, res) => {
    const { usuarioId, idosoId } = req.body;
    const usuario = await usuario_1.default.findById(usuarioId);
    if (!usuario || usuario.tipo !== "familiar")
        return res.status(404).json({ message: "Usuário não encontrado ou não é um familiar" });
    const idoso = await idoso_1.default.findById(idosoId);
    if (!idoso)
        return res.status(404).json({ message: "Idoso não encontrado" });
    const acompanhamento = await acompanhamento_1.default.create({ usuario: usuarioId, idoso: idosoId });
    return res.status(201).json(acompanhamento);
};
exports.createAcompanhamento = createAcompanhamento;
const getAllAcompanhamentos = async (req, res) => {
    const acompanhamentos = await acompanhamento_1.default.find().populate("usuario").populate("idoso");
    if (acompanhamentos.length === 0) {
        return res.status(404).json({ message: "Nenhum acompanhamento encontrado" });
    }
    return res.status(200).json(acompanhamentos);
};
exports.getAllAcompanhamentos = getAllAcompanhamentos;
const getAcompanhamentosById = async (req, res) => {
    const { id } = req.params;
    const acompanhamento = await acompanhamento_1.default.findById(id)
        .populate("usuario")
        .populate("idoso");
    if (!acompanhamento) {
        return res.status(404).json({ message: "Acompanhamento não encontrado" });
    }
    return res.status(200).json(acompanhamento);
};
exports.getAcompanhamentosById = getAcompanhamentosById;
const deleteAcompanhamento = async (req, res) => {
    const id = req.params.id;
    await acompanhamento_1.default.findByIdAndDelete(id);
    return res.status(200).json({ message: "Acompanhamento deletado com sucesso" });
};
exports.deleteAcompanhamento = deleteAcompanhamento;
const updateAcompanhamento = async (req, res) => {
    const id = req.params.id;
    const { usuarioId, idosoId } = req.body;
    const acompanhamento = await acompanhamento_1.default.findByIdAndUpdate(id, { usuario: usuarioId, idoso: idosoId }, { new: true });
    if (!acompanhamento)
        return res.status(404).json({ message: "Acompanhamento não encontrado" });
    return res.status(200).json(acompanhamento);
};
exports.updateAcompanhamento = updateAcompanhamento;
