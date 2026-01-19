"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const idosoSchema = new mongoose_1.Schema({
    // Dados básicos
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    rg: { type: String, unique: true, required: true },
    dataEmissaoRg: { type: Date },
    orgaoEmissorRg: { type: String },
    sus: { type: String, unique: true, required: true },
    dataNascimento: { type: Date, required: true },
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
    observacoesDadosPessoais: { type: String },
    // Dados do acolhimento
    dataAcolhimento: { type: Date },
    localAcolhimento: { type: String },
    encaminhadoPor: { type: String },
    motivoDoAcolhimentoConformeOrgaoEmissor: { type: String },
    documentacaoRecebida: { type: String },
    condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia: {
        type: String,
    },
    condicoesDeHigieneNoMomentoDoAcolhimento: { type: String },
    reacoesEComportamentos: { type: String },
    sinasDeViolencia: { type: String },
    // Histórico de acolhimento anterior
    instituicaoAcolhimentoAnterior: { type: String },
    dataEntradaAcolhimentoAnterior: { type: Date },
    dataSaidaAcolhimentoAnterior: { type: Date },
    motivoAcolhimentoAnterior: { type: String },
    motivoDesacolhimentoAnterior: { type: String },
    encaminhamentosFamiliaAnteriormenteAoAcolhimento: { type: String },
    observacoesAcolhimento: { type: String },
    // Família e condições sociais
    arranjoFamiliar: { type: String },
    familiaAmpliada: { type: String },
    interessadosNoIdoso: { type: String },
    familiaAtendidaPorProgramaSocial: { type: String },
    programaSocialDaFamilia: { type: String },
    quemEAtendidoNoProgramaSocialDaFamilia: { type: String },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia: {
        type: String,
    },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaNome: {
        type: String,
    },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaIdade: {
        type: String,
    },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaParentesco: {
        type: String,
    },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaProfisao: {
        type: String,
    },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaReligiao: {
        type: String,
    },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaEscolaridade: {
        type: String,
    },
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaContato: {
        type: String,
    },
    infraestutura: { type: String },
    familiaAtendidaPorProgramaSaude: { type: String },
    servicoDeSaudeQueAtendeAFamilia: { type: String },
    localServicoDeSaudeQueAtendeAFamilia: { type: String },
    quemServicoDeSaudeQueAtendeAFamilia: { type: String },
    observacoesServicoDeSaude: { type: String },
    condicoesDeHabilidade: { type: String },
    infraestruturaDeComunidade: { type: String },
    familiaAtendidaPorServicosDeSaude: { type: String },
    relacaoComFamilia: { type: String },
    percepcaoDaFamiliaSobreIdoso: { type: String },
    percepcaoIdosoSobreFamilia: { type: String },
    percepcaoEquipeTecnicaSobreRelacaoFamiliar: { type: String },
    observacoesRelacaoFamiliar: { type: String },
    // Visitas e comportamentos
    IdosoRecebeVisita: { type: String },
    comportamentosIdosoDuranteVisita: { type: String },
    comportamentosFamiliaresDuranteVisita: { type: String },
    // Irmãos
    idosoTemIrmaos: { type: String },
    nomeIrmaos: { type: String },
    idadeIrmaos: { type: String },
    localIrmaos: { type: String },
    // Avaliação técnica
    parecerEquipeTecnica: { type: String },
    reavaliacao: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Idoso", idosoSchema);
