import mongoose, {Document} from "mongoose";

export interface IVisita extends Document {
    nome: string,
    data: Date,
    telefone?: string
}

const visitaSchema = new mongoose.Schema({
    nome:{
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

export default mongoose.model<IVisita>('Visita', visitaSchema);