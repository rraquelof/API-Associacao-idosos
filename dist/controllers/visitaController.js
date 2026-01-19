"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisita = exports.updateVisita = exports.getVisitas = exports.createVisita = void 0;
const Visita_1 = __importDefault(require("../models/Visita"));
const visitaValidation_1 = require("../validations/visitaValidation");
const createVisita = async (req, res) => {
    const data = visitaValidation_1.createVisitaSchema.parse(req.body);
    const newVisita = new Visita_1.default(data);
    await newVisita.save();
    res.status(201).json(newVisita);
};
exports.createVisita = createVisita;
const getVisitas = async (req, res) => {
    const { data } = req.query;
    const filtro = data ? { data } : {};
    const visitas = await Visita_1.default.find(filtro);
    res.status(200).json(visitas);
};
exports.getVisitas = getVisitas;
const updateVisita = async (req, res) => {
    const visita = await Visita_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!visita)
        return res.status(404).json({ message: "Visita não encontrada" });
    res.status(200).json({ message: "Visita atualizada com sucesso" });
};
exports.updateVisita = updateVisita;
const deleteVisita = async (req, res) => {
    const visita = await Visita_1.default.findByIdAndDelete(req.params.id);
    if (!visita)
        return res.status(404).json({ message: "Visita não encontrada" });
    res.status(200).json({ message: "Visita removida" });
};
exports.deleteVisita = deleteVisita;
