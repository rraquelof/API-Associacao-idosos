"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const saudeSchema = new mongoose_1.Schema({
    usuarioId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Usuario", required: true },
    idosoId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Idoso", required: true },
    dataConsulta: { type: Date, default: Date.now },
    altura: { type: Number, required: true },
    peso: { type: Number, required: true },
    pressao: { type: String, required: true },
    alergias: { type: [String], default: [] },
    glicemia: { type: Number },
    doencasCronicas: { type: [String], default: [] },
    estadoNutricional: { type: String, enum: ['normal', 'baixo peso', 'sobrepeso'], required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Saude", saudeSchema);
