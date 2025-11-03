import mongoose, { Schema, Document } from "mongoose";
import { required } from "zod/v4/core/util.cjs";

export interface IIdoso extends Document {
    nome: string;
    cpf: string;
    rg: string;
    dataEmissaoRg: Date;
    orgaoEmissorRg: string;
    sus: string;
    data_nascimento: Date;
    sexo: string;
    nacionalidade: string;
    naturalidade: string;
    foto?: string;
    nomePai?: string;
    nomeMae?: string;
    responsavel?: string;
    ultimoEnderecoDoAcolhido?: string;
    cidade?: string;
    contato?: string;
    numCertidaoNascimento?: string;
    folha?: string;
    livro?: string;
    cartorio?: string;
    ctps?: string;
    serie?: string;
    pis?: string;
    tituloEleitor?: string;
    zonaTituloEleitor?: string;
    secaoTituloEleitor?: string;
    observacoes?: string;
    dataAcolhimento: Date;
    localAcolhimento: string;
    encaminhadoPor?: string;
    motivoDoAcolhimentoConformeOrgaoEmissor: string;
    documentacaoRecebida?: string;
    condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia: string;
    condicoesDeHigieneNoMomentoDoAcolhimento: string;
    reacoesEComportamentos: string;
    sinasDeViolencia: string;
    instituicaoAcolhimentoAnterior?: string;
    dataEntradaAcolhimentoAnterior?: Date;
    dataSaidaAcolhimentoAnterior?: Date;
    motivoAcolhimentoAnterior?: string;
    motivoDesacolhimentoAnterior?: string;
    encaminhamentosFamiliaAnteriormenteAoAcolhimento?: string;
    arranjoFamiliar?: string;
    familiaAmpliada?: string;
    interessadosNoIdoso?: string;
    programaSocialDaFamilia?: string;
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia?: string;
    infraestutura?: string;
    condicoesDeHabilidade?: string;
    infraestruturaDeComunidade?: string;
    familiaAtendidaPorServicosDeSaude?: string;
    relacaoComFamilia?: string;
    percepcaoDaFamiliaSobreIdoso?: string;
    percepcaoIdosoSobreFamilia?: string;
    percepcaoEquipeTecnicaSobreRelacaoFamiliar?: string;
    IdosoRecebeVisita?: boolean;
    comportamentosIdosoDuranteVisita?: string;
    comportamentosFamiliaresDuranteVisita?: string;
    nomeIrmaos?: string;
    idadeIrmaos?: string;
    localIrmaos?: string;
    parecerEquipeTecnica?: string;
}

const idosoSchema: Schema = new Schema({
    // Dados básicos
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    rg: { type: String, required: true, unique: true },
    dataEmissaoRg: { type: Date, required: true },
    orgaoEmissorRg: { type: String, required: true },
    sus: { type: String, required: true, unique: true },
    data_nascimento: { type: Date, required: true },
    sexo: { type: String, required: true },
    nacionalidade: { type: String, required: true },
    naturalidade: { type: String, required: true },

    // Dados complementares
    foto: { type: String },
    nomePai: { type: String },
    nomeMae: { type: String },
    responsavel: { type: String },
    ultimoEnderecoDoAcolhido: { type: String },
    cidade: { type: String },
    contato: { type: String },
    numCertidaoNascimento: { type: String },
    folha: { type: String },
    livro: { type: String },
    cartorio: { type: String },
    ctps: { type: String },
    serie: { type: String },
    pis: { type: String },
    tituloEleitor: { type: String },
    zonaTituloEleitor: { type: String },
    secaoTituloEleitor: { type: String },
    observacoes: { type: String },

    // Dados do acolhimento
    dataAcolhimento: { type: Date, required: true },
    localAcolhimento: { type: String, required: true },
    encaminhadoPor: { type: String, required: true },
    motivoDoAcolhimentoConformeOrgaoEmissor: { type: String, required: true },
    documentacaoRecebida: { type: String },
    condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia: { type: String, required: true },
    condicoesDeHigieneNoMomentoDoAcolhimento: { type: String, required: true },
    reacoesEComportamentos: { type: String, requeired: true },
    sinasDeViolencia: { type: String, required: true },

    // Histórico de acolhimento anterior
    instituicaoAcolhimentoAnterior: { type: String },
    dataEntradaAcolhimentoAnterior: { type: Date },
    dataSaidaAcolhimentoAnterior: { type: Date },
    motivoAcolhimentoAnterior: { type: String },
    motivoDesacolhimentoAnterior: { type: String },
    encaminhamentosFamiliaAnteriormenteAoAcolhimento: { type: String },

    // Família e condições sociais
    arranjoFamiliar: { type: String },
    familiaAmpliada: { type: String },
    interessadosNoIdoso: { type: String },
    programaSocialDaFamilia: { type: String },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia: { type: String },
    infraestutura: { type: String },
    condicoesDeHabilidade: { type: String },
    infraestruturaDeComunidade: { type: String },
    familiaAtendidaPorServicosDeSaude: { type: String },
    relacaoComFamilia: { type: String },
    percepcaoDaFamiliaSobreIdoso: { type: String },
    percepcaoIdosoSobreFamilia: { type: String },
    percepcaoEquipeTecnicaSobreRelacaoFamiliar: { type: String },

    // Visitas e comportamentos
    IdosoRecebeVisita: { type: Boolean },
    comportamentosIdosoDuranteVisita: { type: String },
    comportamentosFamiliaresDuranteVisita: { type: String },

    // Irmãos
    nomeIrmaos: { type: String },
    idadeIrmaos: { type: String },
    localIrmaos: { type: String },

    // Avaliação técnica
    parecerEquipeTecnica: { type: String },

}, { timestamps: true });

export default mongoose.model<IIdoso>('Idoso', idosoSchema);
