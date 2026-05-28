import mongoose, { Schema, Document, model } from "mongoose";

export interface ISaude extends Document {
  usuarioId: Schema.Types.ObjectId; // enfermeiro que registrou
  idosoId: Schema.Types.ObjectId;   // referência ao idoso
  dataConsulta: Date;             // data da consulta
  altura?: number;                // em cm
  peso?: number;                  // em kg
  pressao?: string;               // formato livre: "120/80 mmHg"
  alergias?: string[];            // lista de alergias
  glicemia?: number;              // em mg/dL
  doencasCronicas?: string[];     // ex: ["diabetes", "hipertensão"]
  estadoNutricional: "normal" | "baixo peso" | "sobrepeso";
}

const saudeSchema = new Schema<ISaude>(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
    idosoId: { type: Schema.Types.ObjectId, ref: "Idoso", required: true },
    dataConsulta: { type: Date, default: Date.now },
    altura: { type: Number, required: true},
    peso: { type: Number, required: true },
    pressao: { type: String, required: true },
    alergias: { type: [String], default: [] },
    glicemia: { type: Number, required: true },
    doencasCronicas: { type: [String], default: [] },
    estadoNutricional: { type: String, enum: ['normal', 'baixo peso', 'sobrepeso'], required: true},
  },
  { timestamps: true }
);

export default model<ISaude>("Saude", saudeSchema);