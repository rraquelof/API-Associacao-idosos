"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const visitaSchema = new mongoose_1.default.Schema({
    nome: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now,
    },
    telefone: {
        type: String,
        required: false,
    }
});
exports.default = mongoose_1.default.model('Visita', visitaSchema);
