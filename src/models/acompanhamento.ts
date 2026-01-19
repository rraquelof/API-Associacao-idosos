import { Schema, Document, model } from 'mongoose';

export interface IAcompanhamento extends Document {
    usuario: Schema.Types.ObjectId;
    idoso: Schema.Types.ObjectId;
    data: Date;
}

const acompanhamentoSchema: Schema = new Schema<IAcompanhamento>({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    idoso: { type: Schema.Types.ObjectId, ref: 'Idoso', required: true },
    data: { type: Date, default: Date.now },
}, { timestamps: true });

export default model<IAcompanhamento>('Acompanhamento', acompanhamentoSchema);