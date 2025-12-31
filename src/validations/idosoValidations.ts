import { z } from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const rgRegex = /^\d{1}\.\d{3}\.\d{3}$/;
const susRegex = /^\d{15}$/;

// String opcional que transforma "" em undefined
const optionalString = () =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional()
  );

// Data opcional que transforma "" em undefined e valida apenas se houver valor
const optionalDateString = () =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional().refine(
      (date) => date === undefined || !isNaN(Date.parse(date)),
      { message: "Data inválida" }
    )
  );

export const createIdosoSchema = z.object({
  // Campos Obrigatórios
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().regex(cpfRegex, "Formato CPF inválido"),

  // Campos Opcionais
  rg: optionalString().refine(
    (v) => v === undefined || rgRegex.test(v),
    "Formato RG inválido"
  ),
  sus: optionalString().refine(
    (v) => v === undefined || susRegex.test(v),
    "Formato SUS inválido"
  ),
  dataNascimento: optionalDateString(),
  sexo: z
    .preprocess((v) => (v === "" ? undefined : v), z.enum(["masculino", "feminino"]).optional()),
  nacionalidade: optionalString(),
  naturalidade: optionalString(),
  foto: optionalString(),
  nomePai: optionalString(),
  nomeMae: optionalString(),
  responsavel: optionalString(),
  ultimoEnderecoDoAcolhido: optionalString(),
  cidade: optionalString(),
  contato: optionalString(),
  numCertidaoNascimento: optionalString(),
  folha: optionalString(),
  livro: optionalString(),
  cartorio: optionalString(),
  dataEmissaoRg: optionalDateString(),
  orgaoEmissorRg: optionalString(),
  ctps: optionalString(),
  serie: optionalString(),
  pis: optionalString(),
  tituloEleitor: optionalString(),
  observacoes: optionalString(),
  dataAcolhimento: optionalDateString(),
  localAcolhimento: optionalString(),
  encaminhadoPor: optionalString(),
  motivoDoAcolhimentoConformeOrgaoEmissor: optionalString(),
  documentacaoRecebida: optionalString(),
  condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia: optionalString(),
  condicoesDeHigieneNoMomentoDoAcolhimento: optionalString(),
  reacoesEComportamentos: optionalString(),
  sinasDeViolencia: optionalString(),
  instituicaoAcolhimentoAnterior: optionalString(),
  dataEntradaAcolhimentoAnterior: optionalDateString(),
  dataSaidaAcolhimentoAnterior: optionalDateString(),
  motivoAcolhimentoAnterior: optionalString(),
  motivoDesacolhimentoAnterior: optionalString(),
  encaminhamentosFamiliaAnteriormenteAoAcolhimento: optionalString(),
  arranjoFamiliar: optionalString(),
  familiaAmpliada: optionalString(),
  interessadosNoIdoso: optionalString(),
  programaSocialDaFamilia: optionalString(),
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia: optionalString(),
  infraestutura: optionalString(),
  condicoesDeHabilidade: optionalString(),
  infraestruturaDeComunidade: optionalString(),
  familiaAtendidaPorServicosDeSaude: optionalString(),
  relacaoComFamilia: optionalString(),
  percepcaoDaFamiliaSobreIdoso: optionalString(),
  percepcaoIdosoSobreFamilia: optionalString(),
  percepcaoEquipeTecnicaSobreRelacaoFamiliar: optionalString(),
  IdosoRecebeVisita: z
    .preprocess(
      (v) => (v === "" ? undefined : v),
      z.union([z.string(), z.boolean()]).optional()
    )
    .transform((v) => (typeof v === "boolean" ? (v ? "sim" : "não") : v)),
  comportamentosIdosoDuranteVisita: optionalString(),
  comportamentosFamiliaresDuranteVisita: optionalString(),
  nomeIrmaos: optionalString(),
  idadeIrmaos: optionalString(),
  localIrmaos: optionalString(),
  parecerEquipeTecnica: optionalString(),
});

export type CreateIdosoDTO = z.infer<typeof createIdosoSchema>;
