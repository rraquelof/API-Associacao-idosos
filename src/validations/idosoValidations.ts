import { z } from 'zod'

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const rgRegex = /^\d{1}\.\d{3}\.\d{3}$/;
const susRegex = /^\d{15}$/;

export const createIdosoSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cpf: z.string().regex(cpfRegex, "Formato CPF inválido. Formato esperado: xxx.xxx.xxx-xx"),
    rg: z.string().regex(rgRegex, "Formato RG inválido. Formato esperado: x.xxx.xxx"),
    sus: z.string().regex(susRegex, "Formato SUS inválido. Cartão SUS deve conter 15 dígitos"),
    dataNascimento: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Data de nascimento inválida" }),
    sexo: z.enum(['masculino', 'feminino'], "Sexo deve ser 'masculino' ou 'feminino'"),
    nacionalidade: z.string().min(3, "Nacionalidade deve ter pelo menos 3 caracteres"),
    naturalidade: z.string().min(3, "Naturalidade deve ter pelo menos 3 caracteres"),
    
    // Campos opcionais
    foto: z.string().optional(),
    nomePai: z.string().optional(),
    nomeMae: z.string().optional(),
    responsavel: z.string().optional(),
    ultimoEnderecoDoAcolhido: z.string().optional(),
    cidade: z.string().optional(),
    contato: z.string().optional(),
    numCertidaoNascimento: z.string().optional(),
    folha: z.string().optional(),
    livro: z.string().optional(),
    cartorio: z.string().optional(),
    dataEmissao: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Data de emissão inválida" }),
    orgaoEmissor: z.string().optional(),
    ctps: z.string().optional(),
    serie: z.string().optional(),
    pis: z.string().optional(),
    tituloEleitor: z.string().optional(),
    observacoes: z.string().optional(),

    dataAcolhimento: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Data de acolhimento inválida" }),
    localAcolhimento: z.string().optional(),
    encaminhadoPor: z.string().optional(),
    motivoDoAcolhimentoConformeOrgaoEmissor: z.string().optional(),
    documentacaoRecebida: z.string().optional(),
    condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia: z.string().optional(),
    condicoesDeHigieneNoMomentoDoAcolhimento: z.string().optional(),
    reacoesEComportamentos: z.string().optional(),
    sinasDeViolencia: z.string().optional(),

    instituicaoAcolhimentoAnterior: z.string().optional(),
    dataEntradaAcolhimentoAnterior: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Data de entrada inválida" }),
    dataSaidaAcolhimentoAnterior: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Data de saída inválida" }),
    motivoAcolhimentoAnterior: z.string().optional(),
    motivoDesacolhimentoAnterior: z.string().optional(),
    encaminhamentosFamiliaAnteriormenteAoAcolhimento: z.string().optional(),

    arranjoFamiliar: z.string().optional(),
    familiaAmpliada: z.string().optional(),
    interessadosNoIdoso: z.string().optional(),
    programaSocialDaFamilia: z.string().optional(),
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia: z.string().optional(),
    infraestutura: z.string().optional(),
    condicoesDeHabilidade: z.string().optional(),
    infraestruturaDeComunidade: z.string().optional(),
    familiaAtendidaPorServicosDeSaude: z.string().optional(),
    relacaoComFamilia: z.string().optional(),
    percepcaoDaFamiliaSobreIdoso: z.string().optional(),
    percepcaoIdosoSobreFamilia: z.string().optional(),
    percepcaoEquipeTecnicaSobreRelacaoFamiliar: z.string().optional(),

    IdosoRecebeVisita: z.string().optional(),
    comportamentosIdosoDuranteVisita: z.string().optional(),
    comportamentosFamiliaresDuranteVisita: z.string().optional(),

    nomeIrmaos: z.string().optional(),
    idadeIrmaos: z.string().optional(),
    localIrmaos: z.string().optional(),

    parecerEquipeTecnica: z.string().optional(),
});

export type CreateIdosoDTO = z.infer<typeof createIdosoSchema>;