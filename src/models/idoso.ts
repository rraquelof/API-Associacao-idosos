import mongoose from '../database/mongo';

export interface IIdoso {
    nome: string,
    cpf: string,
    rg: string,
    sus: string,
    data_nascimento: Date,
    sexo: string,
    nacionalidade: string,
    naturalidade: string
}

const idosoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    cpf: {type: String, required: true, unique: true},
    rg: {type: String, required: true, unique: true},
    sus: {type: String, required: true, unique: true},
    data_nascimeento: {type: Date, required: true},
    sexo: {type: String, required: true},
    nacionalidade: {type: String, required: true},
    naturalidade: {type: String, required: true}
}, {timestamps: true});

export default mongoose.model<IIdoso>('Idoso', idosoSchema);