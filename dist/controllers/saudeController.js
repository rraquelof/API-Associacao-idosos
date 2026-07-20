"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSaude = exports.putSaude = exports.getSaudeById = exports.getSaude = exports.createSaude = void 0;
const idoso_1 = __importDefault(require("../models/idoso"));
const Saude_1 = __importDefault(require("../models/Saude"));
const saudeValidations_1 = require("../validations/saudeValidations");
const createSaude = async (req, res) => {
    const { usuarioId, idosoId } = req.body;
    const idosoExistente = await idoso_1.default.findById(idosoId);
    if (!idosoExistente) {
        return res.status(404).json({ message: "Idoso não encontrado" });
    }
    const data = saudeValidations_1.createSaudeSchema.parse(req.body);
    const saude = await Saude_1.default.create({
        ...data,
        usuario: usuarioId,
        idoso: idosoId
    });
    return res.status(201).json({ message: "Acompanhamento de saúde registrado com sucesso!", saude });
};
exports.createSaude = createSaude;
const getSaude = async (req, res) => {
    const consultas = await Saude_1.default.find().sort({ dataConsulta: -1 });
    if (consultas.length === 0) {
        return res.status(404).json({ message: "Nenhum registro de consulta encontrado." });
    }
    return res.status(200).json(consultas);
};
exports.getSaude = getSaude;
const getSaudeById = async (req, res) => {
    const { id } = req.params;
    const consulta = await Saude_1.default.findById(id);
    if (!consulta) {
        return res
            .status(404)
            .json({ message: "Nenhum registro de consulta encontrado." });
    }
    return res.status(200).json(consulta);
};
exports.getSaudeById = getSaudeById;
const putSaude = async (req, res) => {
    const { id } = req.params;
    const data = saudeValidations_1.createSaudeSchema.parse(req.body);
    const consulta = await Saude_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!consulta) {
        return res.status(404).json({ message: "Nenhum registro de consulta encontrado." });
    }
    return res.status(200).json({ message: "Atualizado com sucesso!", consulta });
};
exports.putSaude = putSaude;
// Essa função irá excluir apenas a consulta em específico
const deleteSaude = async (req, res) => {
    const { id } = req.params;
    const consulta = await Saude_1.default.findByIdAndDelete(id);
    if (!consulta) {
        return res.status(404).json({ message: "Nenhum registro de consulta encontrado." });
    }
    return res.status(200).json({ message: "Deletado com sucesso!", consulta });
};
exports.deleteSaude = deleteSaude;
