"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventoSchema = new mongoose_1.default.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
    },
    data: {
        type: Date,
        default: Date.now,
    },
    local: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    imagem: {
        type: String
    },
    idosos: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Idoso", // referencia o model Idoso
        }]
});
exports.default = mongoose_1.default.model('Evento', eventoSchema);
