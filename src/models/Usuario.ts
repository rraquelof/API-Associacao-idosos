import mongoose, { Schema, Document } from "mongoose";

export interface IUsuario extends Document {
    nome: string
    email: string
    cpf: string
    senha: string
    tipo: 'coordenador' | 'voluntario' | 'familiar' | 'enfermeiro'
    sexo: string
    endereco: string
    telefone: string
    // Vincula um usuário do tipo "familiar" a um idoso específico, para que
    // ele só tenha acesso aos dados desse idoso (e não do abrigo inteiro).
    idosoVinculado?: Schema.Types.ObjectId
}

const usuarioSchema: Schema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: { type: String, enum: ['coordenador', 'voluntario', 'familiar', 'enfermeiro'], required: true },
    sexo: { type: String, required: true },
    endereco: { type: String, required: true },
    telefone: { type: String, required: true },
    idosoVinculado: { type: Schema.Types.ObjectId, ref: 'Idoso', required: false },
}, { timestamps: true });

export default mongoose.model<IUsuario>('Usuario', usuarioSchema);