import mongoose, { Schema, Document } from "mongoose";

export interface IEvento extends Document {
    nome: string,
    descricao: string,
    data: Date,
    local: {
        type: "Point";
        coordinates: [number, number];
    }
    imagem: string;
    idosos: mongoose.Types.ObjectId[]; 
}

const eventoSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    descricao:{
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idoso", // referencia o model Idoso
    }]
    
});

export default mongoose.model<IEvento>('Evento', eventoSchema);
