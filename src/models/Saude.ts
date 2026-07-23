import mongoose, { Schema, Document, model } from "mongoose";

export interface ISaude extends Document {     
  idosoId: Schema.Types.ObjectId;        
  dataConsulta: Date;                    
  altura: number;                       
  peso: number;                          
  pressao: string;                       
  glicemia: number;                     
  estadoNutricional: "normal" | "baixo peso" | "sobrepeso"; 
  alergias?: string[];                   
  doencasCronicas?: string[];           
}

const saudeSchema = new Schema<ISaude>(
  {
    idosoId: { type: Schema.Types.ObjectId, ref: "Idoso", required: true },
    dataConsulta: { type: Date, default: Date.now }, 
    altura: { type: Number, required: true },
    peso: { type: Number, required: true },
    pressao: { type: String, required: true },
    glicemia: { type: Number, required: true },
    estadoNutricional: { type: String, enum: ['normal', 'baixo peso', 'sobrepeso'], required: true },
    alergias: { type: [String], default: [] },          
    doencasCronicas: { type: [String], default: [] }, 
  },
  { timestamps: true }
);

export default model<ISaude>("Saude", saudeSchema);