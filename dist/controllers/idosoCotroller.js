"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIdoso = exports.updateIdoso = exports.getIdosoById = exports.getIdosos = exports.createIdoso = void 0;
const idoso_1 = __importDefault(require("../models/idoso"));
const idosoValidations_1 = require("../validations/idosoValidations");
const createIdoso = async (req, res) => {
    const data = idosoValidations_1.createIdosoSchema.parse(req.body);
    const cpfExists = await idoso_1.default.findOne({ cpf: data.cpf });
    if (cpfExists)
        return res.status(400).json({ message: "CPF já está cadastrado" });
    const rgExists = await idoso_1.default.findOne({ rg: data.rg });
    if (rgExists)
        return res.status(400).json({ message: "RG já está cadastrado" });
    const susExists = await idoso_1.default.findOne({ sus: data.sus });
    if (susExists)
        return res.status(400).json({ message: "SUS já está cadastrado" });
    const newIdoso = await idoso_1.default.create(data);
    res.status(201).json({ message: "Idoso cadastrado com sucesso", newIdoso });
};
exports.createIdoso = createIdoso;
const getIdosos = async (req, res) => {
    const idosos = await idoso_1.default.find({}, "nome");
    res.json(idosos);
};
exports.getIdosos = getIdosos;
const getIdosoById = async (req, res) => {
    const { id } = req.params;
    const idoso = await idoso_1.default.findById(id);
    if (!idoso) {
        return res.status(404).json({ message: "Idoso não encontrado" });
    }
    res.status(200).json(idoso);
};
exports.getIdosoById = getIdosoById;
const updateIdoso = async (req, res) => {
    const { id } = req.params;
    const data = idosoValidations_1.createIdosoSchema.partial().parse(req.body);
    const idosoUpdate = await idoso_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!idosoUpdate) {
        return res.status(404).json({ message: "Idoso não encontrado" });
    }
    res.status(200).json({
        message: "Idoso atualizado com sucesso",
        idoso: idosoUpdate
    });
};
exports.updateIdoso = updateIdoso;
const deleteIdoso = async (req, res) => {
    const { id } = req.params;
    const idosoDeleted = await idoso_1.default.findByIdAndDelete(id);
    if (!idosoDeleted) {
        return res.status(404).json({ message: "Idoso não encontrado" });
    }
    res.status(200).json({ message: "Idoso deletado com sucesso" });
};
exports.deleteIdoso = deleteIdoso;
