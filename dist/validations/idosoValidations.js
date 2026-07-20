"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIdosoSchema = void 0;
const zod_1 = require("zod");
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const rgRegex = /^\d{1}\.\d{3}\.\d{3}$/;
const susRegex = /^\d{15}$/;
exports.createIdosoSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cpf: zod_1.z.string().regex(cpfRegex, "Formato CPF inválido. Formato esperado: xxx.xxx.xxx-xx"),
    rg: zod_1.z.string().regex(rgRegex, "Formato RG inválido. Formato esperado: x.xxx.xxx"),
    sus: zod_1.z.string().regex(susRegex, "Formato SUS inválido. Cartão SUS deve conter 15 dígitos"),
    dataNascimento: zod_1.z.string(),
    sexo: zod_1.z.enum(["masculino", "feminino"]),
    nacionalidade: zod_1.z.string().min(3, "A nacionalidade deve ter pelo menos 3 caracteres"),
    naturalidade: zod_1.z.string().min(3, "A naturalidade deve ter pelo menos 3 caracteres"),
    // Campos opcionais
    foto: zod_1.z.string().optional(),
    nomePai: zod_1.z.string().optional(),
    nomeMae: zod_1.z.string().optional(),
    responsavel: zod_1.z.string().optional(),
    ultimoEnderecoDoAcolhido: zod_1.z.string().optional(),
    cidade: zod_1.z.string().optional(),
    contato: zod_1.z.string().optional(),
    numCertidaoNascimento: zod_1.z.string().optional(),
    folha: zod_1.z.string().optional(),
    livro: zod_1.z.string().optional(),
    cartorio: zod_1.z.string().optional(),
    dataEmissaoRg: zod_1.z
        .string()
        .optional()
        .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Data de emissão inválida",
    }),
    orgaoEmissorRg: zod_1.z.string().optional(),
    ctps: zod_1.z.string().optional(),
    serie: zod_1.z.string().optional(),
    pis: zod_1.z.string().optional(),
    tituloEleitor: zod_1.z.string().optional(),
    observacoes: zod_1.z.string().optional(),
    dataAcolhimento: zod_1.z
        .string()
        .optional()
        .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Data de acolhimento inválida",
    }),
    localAcolhimento: zod_1.z.string().optional(),
    encaminhadoPor: zod_1.z.string().optional(),
    motivoDoAcolhimentoConformeOrgaoEmissor: zod_1.z.string().optional(),
    documentacaoRecebida: zod_1.z.string().optional(),
    condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia: zod_1.z.string().optional(),
    condicoesDeHigieneNoMomentoDoAcolhimento: zod_1.z.string().optional(),
    reacoesEComportamentos: zod_1.z.string().optional(),
    sinasDeViolencia: zod_1.z.string().optional(),
    instituicaoAcolhimentoAnterior: zod_1.z.string().optional(),
    dataEntradaAcolhimentoAnterior: zod_1.z
        .string()
        .optional()
        .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Data de entrada inválida",
    }),
    dataSaidaAcolhimentoAnterior: zod_1.z
        .string()
        .optional()
        .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Data de saída inválida",
    }),
    motivoAcolhimentoAnterior: zod_1.z.string().optional(),
    motivoDesacolhimentoAnterior: zod_1.z.string().optional(),
    encaminhamentosFamiliaAnteriormenteAoAcolhimento: zod_1.z.string().optional(),
    arranjoFamiliar: zod_1.z.string().optional(),
    familiaAmpliada: zod_1.z.string().optional(),
    interessadosNoIdoso: zod_1.z.string().optional(),
    programaSocialDaFamilia: zod_1.z.string().optional(),
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia: zod_1.z
        .string()
        .optional(),
    infraestutura: zod_1.z.string().optional(),
    condicoesDeHabilidade: zod_1.z.string().optional(),
    infraestruturaDeComunidade: zod_1.z.string().optional(),
    familiaAtendidaPorServicosDeSaude: zod_1.z.string().optional(),
    relacaoComFamilia: zod_1.z.string().optional(),
    percepcaoDaFamiliaSobreIdoso: zod_1.z.string().optional(),
    percepcaoIdosoSobreFamilia: zod_1.z.string().optional(),
    percepcaoEquipeTecnicaSobreRelacaoFamiliar: zod_1.z.string().optional(),
    IdosoRecebeVisita: zod_1.z
        .union([zod_1.z.string(), zod_1.z.boolean()])
        .optional()
        .transform((v) => {
        if (typeof v === "boolean")
            return v ? "sim" : "não";
        return v;
    }),
    comportamentosIdosoDuranteVisita: zod_1.z.string().optional(),
    comportamentosFamiliaresDuranteVisita: zod_1.z.string().optional(),
    nomeIrmaos: zod_1.z.string().optional(),
    idadeIrmaos: zod_1.z.string().optional(),
    localIrmaos: zod_1.z.string().optional(),
    parecerEquipeTecnica: zod_1.z.string().optional(),
});
