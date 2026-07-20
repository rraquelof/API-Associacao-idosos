"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const acompanhamentoSchema = new mongoose_1.Schema({
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    idoso: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Idoso', required: true },
    data: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Acompanhamento', acompanhamentoSchema);
