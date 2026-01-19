"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvento = exports.updateEvento = exports.getEventoById = exports.getEvento = exports.addIdososEmEvento = exports.createEvento = void 0;
const evento_1 = __importDefault(require("../models/evento"));
const eventoValidations_1 = require("../validations/eventoValidations");
const createEvento = async (req, res) => {
    // Copia o body e faz parse de objetos/arrays vindos do form-data
    let body = { ...req.body };
    // Parse do local (se veio como string JSON)
    if (body.local && typeof body.local === "string") {
        body.local = JSON.parse(body.local);
    }
    if (body.idosos && typeof body.idosos === "string") {
        body.idosos = JSON.parse(body.idosos);
    }
    // Adiciona o caminho da imagem
    if (req.file) {
        body.imagem = `/uploads/${req.file.filename}`;
    }
    // Valida com Zod usando o objeto já processado
    const data = eventoValidations_1.createEventoSchema.parse(body);
    // Criação no MongoDB
    const newEvento = await evento_1.default.create(data);
    res.status(201).json({ message: "Evento criado com sucesso", newEvento });
};
exports.createEvento = createEvento;
const addIdososEmEvento = async (req, res) => {
    const { id } = req.params;
    const { idosos } = req.body; //arrays de id dos idosos
    const evento = await evento_1.default.findByIdAndUpdate(id, { $addToSet: { idosos: { $each: idosos } } }, //evitar duplicidade
    { new: true }).populate("idosos");
    if (!evento) {
        res.status(404).json({ message: "Nenhum evento encontrado" });
    }
    res.status(200).json({ message: "Idoso adicionado com sucesso", evento });
};
exports.addIdososEmEvento = addIdososEmEvento;
const getEvento = async (req, res) => {
    const evento = await evento_1.default.find();
    if (!evento) {
        return res.status(404).json({ message: "Nenhum evento encontrado" });
    }
    const host = req.protocol + '://' + req.get('host'); // http://localhost:3000
    const eventosComLink = evento.map((e) => ({
        ...e.toObject(), // converte de mongoose document para objeto JS
        imagem: e.imagem ? `${host}${e.imagem}` : null
    }));
    res.status(200).json(eventosComLink);
};
exports.getEvento = getEvento;
const getEventoById = async (req, res) => {
    const evento = await evento_1.default.findById(req.params.id);
    if (!evento) {
        return res.status(404).json({ message: "Nenhum evento encontrado" });
    }
    res.status(200).json(evento);
};
exports.getEventoById = getEventoById;
const updateEvento = async (req, res) => {
    const evento = await evento_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evento) {
        res.status(404).json("Evento não encontrado.");
    }
    res.status(200).json({ message: "Evento atualizado com sucesso!", evento });
};
exports.updateEvento = updateEvento;
const deleteEvento = async (req, res) => {
    const evento = await evento_1.default.findByIdAndDelete(req.params.id);
    if (!evento) {
        res.status(404).json("Evento não encontrado.");
    }
    res.status(200).json({ message: "Evento deletado com sucesso!", evento });
};
exports.deleteEvento = deleteEvento;
