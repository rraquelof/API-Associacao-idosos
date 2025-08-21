import mongoose, { Schema, Document, model } from "mongoose";

export interface ISaude extends Document {
  usuario: Schema.Types.ObjectId; // enfermeiro que registrou
  idoso: Schema.Types.ObjectId;   // referência ao idoso
  dataConsulta: Date;             // data da consulta
  estadoNutricional: "normal" | "baixo peso" | "sobrepeso"   
  altura?: number;                // em cm
  peso?: number;                  // em kg
  pressao?: string;               // formato livre: "120/80 mmHg"
  alergias?: string[];            // lista de alergias
  glicemia?: number;              // em mg/dL
  doencasCronicas?: string[];     // ex: ["diabetes", "hipertensão"]
}

const saudeSchema = new Schema<ISaude>(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
    idoso: { type: Schema.Types.ObjectId, ref: "Idoso", required: true },
    dataConsulta: { type: Date, default: Date.now },

    estadoNutricional: { type: String, enum: ['normal', 'baixo peso', 'sobrepeso'], required: true},
    altura: { type: Number, required: true},
    peso: { type: Number, required: true },
    pressao: { type: String, required: true },
    alergias: [{ type: String }],
    glicemia: { type: Number },
    doencasCronicas: [{ type: String }],
  },
  { timestamps: true }
);

export default model<ISaude>("Saude", saudeSchema);