"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversarComAgente = void 0;
const idoso_1 = __importDefault(require("../models/idoso"));
const Saude_1 = __importDefault(require("../models/Saude"));
const evento_1 = __importDefault(require("../models/evento"));
const Visita_1 = __importDefault(require("../models/Visita"));
const Usuario_1 = __importDefault(require("../models/Usuario"));
const idosoValidations_1 = require("../validations/idosoValidations");
const saudeValidations_1 = require("../validations/saudeValidations");
const eventoValidations_1 = require("../validations/eventoValidations");
const visitaValidation_1 = require("../validations/visitaValidation");
const ACESSO_POR_TIPO = {
    coordenador: ["idosos", "eventos", "saude", "visitas"],
    enfermeiro: ["idosos", "saude"],
    voluntario: ["eventos", "idosos", "visitas"],
    familiar: ["idosos", "eventos", "saude", "visitas"],
};
const MODELOS_GRATUITOS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
];
const CAMPOS_SENSIVEIS_LGPD = new Set(["cpf", "rg", "sus", "senha"]);
function sanitizarParaGemini(valor) {
    if (valor === null || valor === undefined)
        return valor;
    if (Array.isArray(valor)) {
        return valor.map((item) => sanitizarParaGemini(item));
    }
    if (valor instanceof Date) {
        return valor.toISOString();
    }
    if (typeof valor === "object") {
        const obj = typeof valor.toObject === "function"
            ? valor.toObject()
            : valor;
        const limpo = {};
        for (const [chave, val] of Object.entries(obj)) {
            if (CAMPOS_SENSIVEIS_LGPD.has(chave))
                continue;
            if (chave === "_id" || chave === "id" || chave === "idosoVinculado") {
                limpo[chave] = val ? String(val) : val;
            }
            else {
                limpo[chave] = sanitizarParaGemini(val);
            }
        }
        return limpo;
    }
    return valor;
}
function obterPermissoes(tipo) {
    const chave = tipo.toLowerCase();
    return ACESSO_POR_TIPO[chave] ?? ["idosos", "eventos", "saude", "visitas"];
}
function usuarioPodeAcessarRota(rota, tipo, permissoes) {
    const rotaLimpa = rota.split("?")[0].trim();
    const tipoLower = tipo.toLowerCase();
    if (rotaLimpa === "/menu" || rotaLimpa === "/perfil") {
        return { permitido: true };
    }
    if (rotaLimpa === "/lista/idosos" ||
        rotaLimpa.startsWith("/dados/idoso/")) {
        return permissoes.includes("idosos")
            ? { permitido: true }
            : { permitido: false, motivo: "Seu perfil não tem acesso ao módulo de idosos." };
    }
    if (rotaLimpa === "/cadastro/idoso" ||
        rotaLimpa.startsWith("/atualizar/idoso/") ||
        rotaLimpa.startsWith("/deletar/idoso/")) {
        if (tipoLower !== "coordenador") {
            return {
                permitido: false,
                motivo: "Apenas coordenadores podem cadastrar, editar ou excluir idosos.",
            };
        }
        return { permitido: true };
    }
    if (rotaLimpa === "/lista/registro/saude" ||
        rotaLimpa.startsWith("/dados/saude/") ||
        rotaLimpa.startsWith("/relatorio/idoso/")) {
        return permissoes.includes("saude")
            ? { permitido: true }
            : { permitido: false, motivo: "Seu perfil não tem acesso aos registros de saúde." };
    }
    if (rotaLimpa === "/registro/saude" ||
        rotaLimpa.startsWith("/atualizar/registro/saude/") ||
        rotaLimpa.startsWith("/deletar/registro/saude/")) {
        if (tipoLower !== "coordenador" && tipoLower !== "enfermeiro") {
            return {
                permitido: false,
                motivo: "Apenas coordenadores ou enfermeiros podem gerenciar registros de saúde.",
            };
        }
        return { permitido: true };
    }
    if (rotaLimpa === "/eventos" || rotaLimpa.startsWith("/eventos/detalhes/")) {
        return permissoes.includes("eventos")
            ? { permitido: true }
            : { permitido: false, motivo: "Seu perfil não tem acesso a eventos." };
    }
    if (rotaLimpa === "/eventos/novo" || rotaLimpa.startsWith("/eventos/editar/")) {
        if (tipoLower !== "coordenador" && tipoLower !== "voluntario") {
            return {
                permitido: false,
                motivo: "Seu perfil não tem permissão para criar ou editar eventos.",
            };
        }
        return { permitido: true };
    }
    if (rotaLimpa === "/lista/visitas" ||
        rotaLimpa === "/cadastro/visita" ||
        rotaLimpa.startsWith("/dados/visita/") ||
        rotaLimpa.startsWith("/atualizar/visita/") ||
        rotaLimpa.startsWith("/deletar/visita/")) {
        return permissoes.includes("visitas")
            ? { permitido: true }
            : { permitido: false, motivo: "Seu perfil não tem acesso ao módulo de visitas." };
    }
    return {
        permitido: false,
        motivo: `A rota "${rotaLimpa}" não existe no sistema SIGAAI.`,
    };
}
function construirDeclaracoesFerramentas(tipoUsuario, permissoes) {
    const tipo = tipoUsuario.toLowerCase();
    const ehCoordenador = tipo === "coordenador";
    const ehEnfermeiro = tipo === "enfermeiro";
    const ehVoluntario = tipo === "voluntario";
    const declaracoes = [
        {
            name: "obter_resumo_sistema",
            description: "Retorna contagens gerais permitidas ao perfil logado (idosos visíveis, eventos, visitas e registros de saúde, incluindo ocorrências de hoje).",
            parameters: {
                type: "OBJECT",
                properties: {},
            },
        },
        {
            name: "navegar_para_pagina",
            description: "Navega o usuário para uma página válida do sistema SIGAAI (ex: /menu, /lista/idosos, /cadastro/idoso, /dados/idoso/:id, /relatorio/idoso/:id, /eventos, /eventos/novo, /lista/registro/saude, /registro/saude, /lista/visitas, /cadastro/visita, /perfil).",
            parameters: {
                type: "OBJECT",
                properties: {
                    rota: {
                        type: "STRING",
                        description: "Caminho exato da rota no frontend React.",
                    },
                },
                required: ["rota"],
            },
        },
    ];
    if (permissoes.includes("idosos")) {
        declaracoes.push({
            name: "listar_idosos",
            description: "Lista os residentes (idosos) do Abrigo Luca Zorn acessíveis ao usuário logado. Para familiares, retorna apenas o idoso vinculado.",
            parameters: {
                type: "OBJECT",
                properties: {
                    busca: {
                        type: "STRING",
                        description: "Filtro opcional por parte do nome do residente.",
                    },
                },
            },
        }, {
            name: "detalhar_idoso",
            description: "Busca detalhes cadastrais (sem dados sensíveis como CPF/RG/SUS por LGPD) de um idoso específico pelo ID.",
            parameters: {
                type: "OBJECT",
                properties: {
                    idosoId: { type: "STRING", description: "ID do idoso." },
                },
                required: ["idosoId"],
            },
        });
        if (ehCoordenador) {
            declaracoes.push({
                name: "cadastrar_idoso",
                description: "Cadastra um novo idoso no abrigo (exclusivo para coordenadores). Exige dados básicos obrigatórios.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        nome: { type: "STRING" },
                        cpf: { type: "STRING", description: "Formato xxx.xxx.xxx-xx" },
                        rg: { type: "STRING", description: "Formato xx.xxx.xxx ou x.xxx.xxx" },
                        sus: { type: "STRING", description: "15 dígitos numéricos" },
                        dataNascimento: { type: "STRING", description: "Data ISO YYYY-MM-DD" },
                        sexo: { type: "STRING", description: "masculino ou feminino" },
                        nacionalidade: { type: "STRING" },
                        naturalidade: { type: "STRING" },
                        responsavel: { type: "STRING" },
                        contato: { type: "STRING" },
                        localAcolhimento: { type: "STRING" },
                        parecerEquipeTecnica: { type: "STRING" },
                    },
                    required: [
                        "nome",
                        "cpf",
                        "rg",
                        "sus",
                        "dataNascimento",
                        "sexo",
                        "nacionalidade",
                        "naturalidade",
                    ],
                },
            }, {
                name: "atualizar_idoso",
                description: "Atualiza dados cadastrais de um idoso existente (exclusivo para coordenadores).",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        idosoId: { type: "STRING" },
                        nome: { type: "STRING" },
                        responsavel: { type: "STRING" },
                        contato: { type: "STRING" },
                        cidade: { type: "STRING" },
                        localAcolhimento: { type: "STRING" },
                        parecerEquipeTecnica: { type: "STRING" },
                    },
                    required: ["idosoId"],
                },
            }, {
                name: "deletar_idoso",
                description: "Exclui o cadastro de um idoso (exclusivo para coordenadores). Na primeira chamada envie confirmado=false para solicitar confirmação explícita.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        idosoId: { type: "STRING" },
                        confirmado: { type: "BOOLEAN" },
                    },
                    required: ["idosoId"],
                },
            });
        }
    }
    if (permissoes.includes("saude")) {
        declaracoes.push({
            name: "listar_registros_saude",
            description: "Lista acompanhamentos clínicos/registros de saúde dos idosos (pressão, glicemia, peso, altura, estado nutricional).",
            parameters: {
                type: "OBJECT",
                properties: {
                    idosoId: {
                        type: "STRING",
                        description: "ID opcional do idoso para filtrar seus registros.",
                    },
                },
            },
        });
        if (ehCoordenador || ehEnfermeiro) {
            declaracoes.push({
                name: "cadastrar_registro_saude",
                description: "Registra um novo acompanhamento de saúde para um idoso (coordenador ou enfermeiro).",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        idosoId: { type: "STRING" },
                        altura: { type: "NUMBER", description: "Altura em metros, ex: 1.65" },
                        peso: { type: "NUMBER", description: "Peso em kg, ex: 68.5" },
                        pressao: { type: "STRING", description: "Formato xxx/xx, ex: 120/80" },
                        glicemia: { type: "NUMBER", description: "Glicemia em mg/dL, ex: 98" },
                        estadoNutricional: {
                            type: "STRING",
                            description: "normal, baixo peso ou sobrepeso",
                        },
                        alergias: {
                            type: "ARRAY",
                            items: { type: "STRING" },
                        },
                        doencasCronicas: {
                            type: "ARRAY",
                            items: { type: "STRING" },
                        },
                    },
                    required: [
                        "idosoId",
                        "altura",
                        "peso",
                        "pressao",
                        "glicemia",
                        "estadoNutricional",
                    ],
                },
            }, {
                name: "atualizar_registro_saude",
                description: "Atualiza um registro de saúde existente (coordenador ou enfermeiro).",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        registroId: { type: "STRING" },
                        altura: { type: "NUMBER" },
                        peso: { type: "NUMBER" },
                        pressao: { type: "STRING" },
                        glicemia: { type: "NUMBER" },
                        estadoNutricional: {
                            type: "STRING",
                            description: "normal, baixo peso ou sobrepeso",
                        },
                        alergias: {
                            type: "ARRAY",
                            items: { type: "STRING" },
                        },
                        doencasCronicas: {
                            type: "ARRAY",
                            items: { type: "STRING" },
                        },
                    },
                    required: ["registroId"],
                },
            }, {
                name: "deletar_registro_saude",
                description: "Exclui um registro de saúde. Na primeira chamada envie confirmado=false para solicitar confirmação explícita.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        registroId: { type: "STRING" },
                        confirmado: { type: "BOOLEAN" },
                    },
                    required: ["registroId"],
                },
            });
        }
    }
    if (permissoes.includes("eventos")) {
        declaracoes.push({
            name: "listar_eventos",
            description: "Lista os eventos cadastrados no abrigo.",
            parameters: {
                type: "OBJECT",
                properties: {},
            },
        });
        if (ehCoordenador || ehVoluntario) {
            declaracoes.push({
                name: "cadastrar_evento",
                description: "Cadastra um novo evento do abrigo (coordenador ou voluntário).",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        nome: { type: "STRING" },
                        descricao: { type: "STRING" },
                        data: { type: "STRING", description: "Data/hora em formato ISO" },
                        latitude: { type: "NUMBER" },
                        longitude: { type: "NUMBER" },
                    },
                    required: ["nome", "data"],
                },
            }, {
                name: "atualizar_evento",
                description: "Atualiza um evento existente (coordenador ou voluntário).",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        eventoId: { type: "STRING" },
                        nome: { type: "STRING" },
                        descricao: { type: "STRING" },
                        data: { type: "STRING" },
                        latitude: { type: "NUMBER" },
                        longitude: { type: "NUMBER" },
                    },
                    required: ["eventoId"],
                },
            });
        }
        if (ehCoordenador) {
            declaracoes.push({
                name: "deletar_evento",
                description: "Exclui um evento (exclusivo para coordenadores). Na primeira chamada envie confirmado=false para pedir confirmação.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        eventoId: { type: "STRING" },
                        confirmado: { type: "BOOLEAN" },
                    },
                    required: ["eventoId"],
                },
            });
        }
    }
    if (permissoes.includes("visitas")) {
        declaracoes.push({
            name: "listar_visitas",
            description: "Lista as visitas agendadas ou registradas no abrigo.",
            parameters: {
                type: "OBJECT",
                properties: {},
            },
        }, {
            name: "cadastrar_visita",
            description: "Agenda ou registra uma nova visita ao abrigo.",
            parameters: {
                type: "OBJECT",
                properties: {
                    nomeVisitante: { type: "STRING" },
                    dataIso: { type: "STRING", description: "Data/hora ISO da visita" },
                    telefone: { type: "STRING" },
                },
                required: ["nomeVisitante", "dataIso"],
            },
        }, {
            name: "atualizar_visita",
            description: "Atualiza os dados de uma visita agendada.",
            parameters: {
                type: "OBJECT",
                properties: {
                    visitaId: { type: "STRING" },
                    nomeVisitante: { type: "STRING" },
                    dataIso: { type: "STRING" },
                    telefone: { type: "STRING" },
                },
                required: ["visitaId"],
            },
        }, {
            name: "deletar_visita",
            description: "Exclui um registro de visita. Na primeira chamada envie confirmado=false para pedir confirmação.",
            parameters: {
                type: "OBJECT",
                properties: {
                    visitaId: { type: "STRING" },
                    confirmado: { type: "BOOLEAN" },
                },
                required: ["visitaId"],
            },
        });
    }
    return declaracoes;
}
function ehMesmoDia(dataValor, referencia) {
    if (!dataValor)
        return false;
    const d = new Date(String(dataValor));
    if (Number.isNaN(d.getTime()))
        return false;
    return (d.getDate() === referencia.getDate() &&
        d.getMonth() === referencia.getMonth() &&
        d.getFullYear() === referencia.getFullYear());
}
async function executarFerramenta(nome, args, ctx) {
    const tipoLower = ctx.tipoUsuario.toLowerCase();
    const ehFamiliar = tipoLower === "familiar";
    const ehCoordenador = tipoLower === "coordenador";
    const ehEnfermeiro = tipoLower === "enfermeiro";
    const ehVoluntario = tipoLower === "voluntario";
    switch (nome) {
        case "obter_resumo_sistema": {
            const hoje = new Date();
            const resumo = {
                usuarioLogado: {
                    nome: ctx.nomeUsuario,
                    tipo: ctx.tipoUsuario,
                    permissoes: ctx.permissoes,
                },
            };
            if (ctx.permissoes.includes("idosos")) {
                if (ehFamiliar) {
                    resumo.totalIdososVisiveis = ctx.idosoVinculado
                        ? await idoso_1.default.countDocuments({ _id: ctx.idosoVinculado })
                        : 0;
                }
                else {
                    resumo.totalIdososVisiveis = await idoso_1.default.countDocuments();
                }
            }
            if (ctx.permissoes.includes("saude")) {
                const filtroSaude = ehFamiliar
                    ? { idosoId: ctx.idosoVinculado || null }
                    : {};
                const registros = await Saude_1.default.find(filtroSaude).select("dataConsulta idosoId");
                resumo.totalRegistrosSaude = registros.length;
                resumo.registrosSaudeHoje = registros.filter((r) => ehMesmoDia(r.dataConsulta, hoje)).length;
            }
            if (ctx.permissoes.includes("eventos")) {
                const eventos = await evento_1.default.find().select("nome data");
                resumo.totalEventos = eventos.length;
                resumo.eventosHoje = eventos.filter((e) => ehMesmoDia(e.data, hoje)).length;
            }
            if (ctx.permissoes.includes("visitas")) {
                const visitas = await Visita_1.default.find().select("nome data");
                resumo.totalVisitas = visitas.length;
                resumo.visitasHoje = visitas.filter((v) => ehMesmoDia(v.data, hoje)).length;
            }
            return resumo;
        }
        case "navegar_para_pagina": {
            const rota = String(args.rota || "").trim();
            const validacao = usuarioPodeAcessarRota(rota, ctx.tipoUsuario, ctx.permissoes);
            if (!validacao.permitido) {
                return { erro: validacao.motivo };
            }
            ctx.acaoNavegacao = rota;
            return { sucesso: true, rotaDestino: rota };
        }
        case "listar_idosos": {
            if (!ctx.permissoes.includes("idosos")) {
                return { erro: "Sem permissão para visualizar idosos." };
            }
            let query = {};
            if (ehFamiliar) {
                if (!ctx.idosoVinculado)
                    return { idosos: [], aviso: "Nenhum idoso vinculado à sua conta familiar." };
                query = { _id: ctx.idosoVinculado };
            }
            const lista = await idoso_1.default.find(query).select("nome sexo dataNascimento naturalidade cidade responsavel localAcolhimento IdosoRecebeVisita");
            const termo = String(args.busca || "").trim().toLowerCase();
            const filtrados = termo
                ? lista.filter((i) => i.nome.toLowerCase().includes(termo))
                : lista;
            return { idosos: sanitizarParaGemini(filtrados) };
        }
        case "detalhar_idoso": {
            if (!ctx.permissoes.includes("idosos")) {
                return { erro: "Sem permissão para visualizar idosos." };
            }
            const idosoId = String(args.idosoId || "");
            if (ehFamiliar && idosoId !== ctx.idosoVinculado) {
                return { erro: "Familiares só podem visualizar o idoso vinculado à sua conta." };
            }
            const idoso = await idoso_1.default.findById(idosoId);
            if (!idoso)
                return { erro: "Idoso não encontrado." };
            return { idoso: sanitizarParaGemini(idoso) };
        }
        case "cadastrar_idoso": {
            if (!ehCoordenador) {
                return { erro: "Apenas coordenadores podem cadastrar idosos." };
            }
            const dadosValidados = idosoValidations_1.createIdosoSchema.parse({
                ...args,
                sexo: String(args.sexo || "").toLowerCase(),
            });
            const novo = await idoso_1.default.create(dadosValidados);
            ctx.dadosAlterados = true;
            return {
                sucesso: true,
                mensagem: "Idoso cadastrado com sucesso.",
                idoso: sanitizarParaGemini(novo),
            };
        }
        case "atualizar_idoso": {
            if (!ehCoordenador) {
                return { erro: "Apenas coordenadores podem atualizar idosos." };
            }
            const { idosoId, ...campos } = args;
            const atualizacao = idosoValidations_1.createIdosoSchema.partial().parse(campos);
            const atualizado = await idoso_1.default.findByIdAndUpdate(idosoId, atualizacao, {
                new: true,
            });
            if (!atualizado)
                return { erro: "Idoso não encontrado." };
            ctx.dadosAlterados = true;
            return {
                sucesso: true,
                mensagem: "Cadastro do idoso atualizado com sucesso.",
                idoso: sanitizarParaGemini(atualizado),
            };
        }
        case "deletar_idoso": {
            if (!ehCoordenador) {
                return { erro: "Apenas coordenadores podem excluir idosos." };
            }
            const idosoId = String(args.idosoId || "");
            const alvo = await idoso_1.default.findById(idosoId).select("nome");
            if (!alvo)
                return { erro: "Idoso não encontrado." };
            if (args.confirmado !== true) {
                ctx.confirmacaoPendente = {
                    ferramenta: "deletar_idoso",
                    argumentos: { idosoId, confirmado: true },
                    titulo: "Confirmar exclusão de residente",
                    descricao: `Excluir permanentemente o cadastro de ${alvo.nome}?`,
                };
                return {
                    requerConfirmacao: true,
                    mensagem: `Aguardando confirmação explícita do usuário para excluir ${alvo.nome}.`,
                };
            }
            await idoso_1.default.findByIdAndDelete(idosoId);
            ctx.dadosAlterados = true;
            return { sucesso: true, mensagem: `Idoso ${alvo.nome} excluído com sucesso.` };
        }
        case "listar_registros_saude": {
            if (!ctx.permissoes.includes("saude")) {
                return { erro: "Sem permissão para visualizar registros de saúde." };
            }
            const filtro = {};
            if (ehFamiliar) {
                if (!ctx.idosoVinculado)
                    return { registros: [] };
                filtro.idosoId = ctx.idosoVinculado;
            }
            else if (args.idosoId) {
                filtro.idosoId = String(args.idosoId);
            }
            const registros = await Saude_1.default.find(filtro)
                .populate("idosoId", "nome")
                .populate("usuarioId", "nome")
                .sort({ dataConsulta: -1 });
            return { registros: sanitizarParaGemini(registros) };
        }
        case "cadastrar_registro_saude": {
            if (!ehCoordenador && !ehEnfermeiro) {
                return { erro: "Apenas coordenadores ou enfermeiros podem registrar saúde." };
            }
            const idoso = await idoso_1.default.findById(args.idosoId).select("nome");
            if (!idoso)
                return { erro: "Idoso não encontrado." };
            const dados = saudeValidations_1.createSaudeSchema.parse({
                usuarioId: ctx.usuarioId,
                idosoId: String(args.idosoId),
                altura: Number(args.altura),
                peso: Number(args.peso),
                pressao: String(args.pressao),
                glicemia: Number(args.glicemia),
                estadoNutricional: String(args.estadoNutricional),
                alergias: Array.isArray(args.alergias) ? args.alergias : [],
                doencasCronicas: Array.isArray(args.doencasCronicas)
                    ? args.doencasCronicas
                    : [],
            });
            const registro = await Saude_1.default.create(dados);
            ctx.dadosAlterados = true;
            return {
                sucesso: true,
                mensagem: `Registro de saúde salvo para ${idoso.nome}.`,
                registro: sanitizarParaGemini(registro),
            };
        }
        case "atualizar_registro_saude": {
            if (!ehCoordenador && !ehEnfermeiro) {
                return { erro: "Apenas coordenadores ou enfermeiros podem atualizar registros de saúde." };
            }
            const existente = await Saude_1.default.findById(args.registroId);
            if (!existente)
                return { erro: "Registro de saúde não encontrado." };
            const dados = saudeValidations_1.createSaudeSchema.parse({
                usuarioId: String(existente.usuarioId),
                idosoId: String(existente.idosoId),
                altura: args.altura !== undefined ? Number(args.altura) : existente.altura,
                peso: args.peso !== undefined ? Number(args.peso) : existente.peso,
                pressao: args.pressao !== undefined ? String(args.pressao) : existente.pressao,
                glicemia: args.glicemia !== undefined ? Number(args.glicemia) : existente.glicemia,
                estadoNutricional: args.estadoNutricional !== undefined
                    ? String(args.estadoNutricional)
                    : existente.estadoNutricional,
                alergias: Array.isArray(args.alergias) ? args.alergias : existente.alergias,
                doencasCronicas: Array.isArray(args.doencasCronicas)
                    ? args.doencasCronicas
                    : existente.doencasCronicas,
            });
            const atualizado = await Saude_1.default.findByIdAndUpdate(args.registroId, dados, {
                new: true,
            });
            ctx.dadosAlterados = true;
            return {
                sucesso: true,
                mensagem: "Registro de saúde atualizado com sucesso.",
                registro: sanitizarParaGemini(atualizado),
            };
        }
        case "deletar_registro_saude": {
            if (!ehCoordenador && !ehEnfermeiro) {
                return { erro: "Apenas coordenadores ou enfermeiros podem excluir registros de saúde." };
            }
            const registro = await Saude_1.default.findById(args.registroId).populate("idosoId", "nome");
            if (!registro)
                return { erro: "Registro de saúde não encontrado." };
            if (args.confirmado !== true) {
                const nomeIdoso = registro.idosoId?.nome || "residente";
                ctx.confirmacaoPendente = {
                    ferramenta: "deletar_registro_saude",
                    argumentos: { registroId: String(args.registroId), confirmado: true },
                    titulo: "Confirmar exclusão de registro de saúde",
                    descricao: `Excluir o registro de saúde de ${nomeIdoso} (pressão ${registro.pressao})?`,
                };
                return {
                    requerConfirmacao: true,
                    mensagem: "Aguardando confirmação explícita do usuário para excluir o registro.",
                };
            }
            await Saude_1.default.findByIdAndDelete(args.registroId);
            ctx.dadosAlterados = true;
            return { sucesso: true, mensagem: "Registro de saúde excluído com sucesso." };
        }
        case "listar_eventos": {
            if (!ctx.permissoes.includes("eventos")) {
                return { erro: "Sem permissão para visualizar eventos." };
            }
            const eventos = await evento_1.default.find().sort({ data: 1 });
            return { eventos: sanitizarParaGemini(eventos) };
        }
        case "cadastrar_evento": {
            if (!ehCoordenador && !ehVoluntario) {
                return { erro: "Apenas coordenadores ou voluntários podem cadastrar eventos." };
            }
            const lng = args.longitude !== undefined ? Number(args.longitude) : -38.5586;
            const lat = args.latitude !== undefined ? Number(args.latitude) : -6.8894;
            const dados = eventoValidations_1.createEventoSchema.parse({
                nome: String(args.nome),
                descricao: args.descricao ? String(args.descricao) : "",
                data: args.data,
                local: { type: "Point", coordinates: [lng, lat] },
            });
            const evento = await evento_1.default.create(dados);
            ctx.dadosAlterados = true;
            return {
                sucesso: true,
                mensagem: "Evento cadastrado com sucesso.",
                evento: sanitizarParaGemini(evento),
            };
        }
        case "atualizar_evento": {
            if (!ehCoordenador && !ehVoluntario) {
                return { erro: "Apenas coordenadores ou voluntários podem atualizar eventos." };
            }
            const atualizacao = {};
            if (args.nome !== undefined)
                atualizacao.nome = String(args.nome);
            if (args.descricao !== undefined)
                atualizacao.descricao = String(args.descricao);
            if (args.data !== undefined)
                atualizacao.data = new Date(String(args.data));
            if (args.latitude !== undefined && args.longitude !== undefined) {
                atualizacao.local = {
                    type: "Point",
                    coordinates: [Number(args.longitude), Number(args.latitude)],
                };
            }
            const evento = await evento_1.default.findByIdAndUpdate(args.eventoId, atualizacao, {
                new: true,
            });
            if (!evento)
                return { erro: "Evento não encontrado." };
            ctx.dadosAlterados = true;
            return {
                sucesso: true,
                mensagem: "Evento atualizado com sucesso.",
                evento: sanitizarParaGemini(evento),
            };
        }
        case "deletar_evento": {
            if (!ehCoordenador) {
                return { erro: "Apenas coordenadores podem excluir eventos." };
            }
            const evento = await evento_1.default.findById(args.eventoId);
            if (!evento)
                return { erro: "Evento não encontrado." };
            if (args.confirmado !== true) {
                ctx.confirmacaoPendente = {
                    ferramenta: "deletar_evento",
                    argumentos: { eventoId: String(args.eventoId), confirmado: true },
                    titulo: "Confirmar exclusão de evento",
                    descricao: `Excluir o evento "${evento.nome}"?`,
                };
                return {
                    requerConfirmacao: true,
                    mensagem: `Aguardando confirmação explícita do usuário para excluir o evento "${evento.nome}".`,
                };
            }
            await evento_1.default.findByIdAndDelete(args.eventoId);
            ctx.dadosAlterados = true;
            return { sucesso: true, mensagem: `Evento "${evento.nome}" excluído com sucesso.` };
        }
        case "listar_visitas": {
            if (!ctx.permissoes.includes("visitas")) {
                return { erro: "Sem permissão para visualizar visitas." };
            }
            const visitas = await Visita_1.default.find().sort({ data: 1 });
            return { visitas: sanitizarParaGemini(visitas) };
        }
        case "cadastrar_visita": {
            if (!ctx.permissoes.includes("visitas")) {
                return { erro: "Sem permissão para cadastrar visitas." };
            }
            const dados = visitaValidation_1.createVisitaSchema.parse({
                nome: String(args.nomeVisitante),
                data: args.dataIso,
                telefone: args.telefone ? String(args.telefone) : undefined,
            });
            const visita = await Visita_1.default.create(dados);
            ctx.dadosAlterados = true;
            return {
                sucesso: true,
                mensagem: "Visita registrada com sucesso.",
                visita: sanitizarParaGemini(visita),
            };
        }
        case "atualizar_visita": {
            if (!ctx.permissoes.includes("visitas")) {
                return { erro: "Sem permissão para atualizar visitas." };
            }
            const atualizacao = {};
            if (args.nomeVisitante !== undefined)
                atualizacao.nome = String(args.nomeVisitante);
            if (args.dataIso !== undefined)
                atualizacao.data = new Date(String(args.dataIso));
            if (args.telefone !== undefined)
                atualizacao.telefone = String(args.telefone);
            const visita = await Visita_1.default.findByIdAndUpdate(args.visitaId, atualizacao, {
                new: true,
            });
            if (!visita)
                return { erro: "Visita não encontrada." };
            ctx.dadosAlterados = true;
            return {
                sucesso: true,
                mensagem: "Visita atualizada com sucesso.",
                visita: sanitizarParaGemini(visita),
            };
        }
        case "deletar_visita": {
            if (!ctx.permissoes.includes("visitas")) {
                return { erro: "Sem permissão para excluir visitas." };
            }
            const visita = await Visita_1.default.findById(args.visitaId);
            if (!visita)
                return { erro: "Visita não encontrada." };
            if (args.confirmado !== true) {
                ctx.confirmacaoPendente = {
                    ferramenta: "deletar_visita",
                    argumentos: { visitaId: String(args.visitaId), confirmado: true },
                    titulo: "Confirmar exclusão de visita",
                    descricao: `Excluir a visita de "${visita.nome}"?`,
                };
                return {
                    requerConfirmacao: true,
                    mensagem: `Aguardando confirmação explícita do usuário para excluir a visita de "${visita.nome}".`,
                };
            }
            await Visita_1.default.findByIdAndDelete(args.visitaId);
            ctx.dadosAlterados = true;
            return { sucesso: true, mensagem: `Visita de "${visita.nome}" excluída com sucesso.` };
        }
        default:
            return { erro: `Ferramenta desconhecida: ${nome}` };
    }
}
function montarSystemInstruction(ctx) {
    const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    return [
        "Você é o assistente oficial de IA do sistema SIGAAI — Abrigo Luca Zorn (Associação de Idosos).",
        "",
        "REGRAS RÍGIDAS DE ESCOPO:",
        "1. Você deve responder EXCLUSIVAMENTE sobre o gerenciamento e os dados deste sistema (residentes/idosos, registros de saúde, visitas, eventos, perfil e navegação nas páginas do SIGAAI).",
        "2. Se o usuário perguntar qualquer assunto fora deste sistema (culinária, clima, notícias, programação, política, piadas, conhecimentos gerais), recuse educadamente informando que você opera exclusivamente com os dados e ações do SIGAAI — Abrigo Luca Zorn.",
        "3. NUNCA invente dados ou responda com suposições. Sempre consulte as ferramentas (tools) disponíveis antes de afirmar qualquer dado sobre idosos, saúde, visitas ou eventos.",
        "4. Por proteção de dados (LGPD) no plano gratuito, CPF, RG, SUS e senha nunca são compartilhados com você; informe isso se o usuário solicitar esses documentos pelo chat e oriente abrir a ficha no sistema.",
        "5. Para qualquer exclusão (deletar_idoso, deletar_registro_saude, deletar_evento, deletar_visita), chame primeiro com confirmado=false e aguarde confirmação explícita do usuário antes de efetivar.",
        "6. Responda sempre em português do Brasil, de forma objetiva, clara e respeitosa.",
        "",
        `CONTEXTO DO USUÁRIO LOGADO: Nome="${ctx.nomeUsuario}", Perfil="${ctx.tipoUsuario}", Permissões=[${ctx.permissoes.join(", ")}]${ctx.idosoVinculado ? `, IdosoVinculado="${ctx.idosoVinculado}"` : ""}.`,
        `DATA E HORA ATUAL: ${agora}.`,
        "ROTAS VÁLIDAS DO SISTEMA: /menu, /lista/idosos, /cadastro/idoso, /dados/idoso/:id, /relatorio/idoso/:id, /eventos, /eventos/novo, /lista/registro/saude, /registro/saude, /lista/visitas, /cadastro/visita, /perfil.",
    ].join("\n");
}
async function chamarGeminiComFallback(apiKey, payload) {
    let ultimoErro = { status: 500, mensagem: "Erro ao consultar a API do Gemini.", codigo: "ERRO_GEMINI" };
    for (const modelo of MODELOS_GRATUITOS) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const resposta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (resposta.ok) {
            const dados = await resposta.json();
            return { ok: true, dados, modelo };
        }
        const erroJson = await resposta.json().catch(() => ({}));
        const msgApi = erroJson?.error?.message || resposta.statusText;
        if (resposta.status === 429 || resposta.status === 503 || resposta.status === 404) {
            ultimoErro = {
                status: resposta.status === 404 ? 503 : resposta.status,
                mensagem: "O limite temporário do plano gratuito do Google Gemini foi atingido. Aguarde alguns instantes e tente novamente.",
                codigo: "LIMITE_PLANO_GRATUITO",
            };
            continue;
        }
        if (resposta.status === 400 || resposta.status === 401 || resposta.status === 403) {
            return {
                ok: false,
                status: resposta.status,
                mensagem: `Chave da API do Google Gemini inválida ou sem permissão (${msgApi}).`,
                codigo: "CHAVE_GEMINI_INVALIDA",
            };
        }
        ultimoErro = {
            status: resposta.status,
            mensagem: `Erro ao consultar o Gemini: ${msgApi}`,
            codigo: "ERRO_GEMINI",
        };
    }
    return { ok: false, ...ultimoErro };
}
const conversarComAgente = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        const headerKey = req.headers["x-gemini-api-key"];
        const apiKeyHeader = Array.isArray(headerKey) ? headerKey[0] : headerKey;
        const apiKey = (process.env.GEMINI_API_KEY || apiKeyHeader || "").trim();
        if (!apiKey) {
            return res.status(400).json({
                message: "Chave gratuita da API do Google Gemini não configurada. Configure GEMINI_API_KEY no servidor ou informe a chave nas configurações do assistente.",
                codigo: "CHAVE_GEMINI_AUSENTE",
            });
        }
        const usuario = await Usuario_1.default.findById(req.user.id).select("-senha");
        const tipoUsuario = usuario?.tipo || req.user.tipo || "coordenador";
        const nomeUsuario = usuario?.nome || "Usuário";
        const idosoVinculado = usuario?.idosoVinculado
            ? String(usuario.idosoVinculado)
            : undefined;
        const permissoes = obterPermissoes(tipoUsuario);
        const ctx = {
            usuarioId: String(req.user.id),
            nomeUsuario,
            tipoUsuario,
            idosoVinculado,
            permissoes,
            acaoNavegacao: null,
            dadosAlterados: false,
            confirmacaoPendente: null,
        };
        const { mensagem, historico, confirmacaoExecucao } = req.body;
        if (confirmacaoExecucao?.ferramenta) {
            const resultado = (await executarFerramenta(confirmacaoExecucao.ferramenta, { ...(confirmacaoExecucao.argumentos || {}), confirmado: true }, ctx));
            if (resultado?.erro) {
                return res.status(403).json({
                    resposta: resultado.erro,
                    acaoNavegacao: null,
                    dadosAlterados: false,
                    confirmacaoPendente: null,
                });
            }
            return res.status(200).json({
                resposta: resultado?.mensagem || "Ação confirmada e executada com sucesso.",
                acaoNavegacao: ctx.acaoNavegacao,
                dadosAlterados: ctx.dadosAlterados,
                confirmacaoPendente: null,
            });
        }
        if (!mensagem || !String(mensagem).trim()) {
            return res.status(400).json({ message: "Envie uma mensagem para o assistente." });
        }
        const historicoRecente = Array.isArray(historico) ? historico.slice(-10) : [];
        const contents = historicoRecente
            .filter((h) => h && (h.papel === "user" || h.papel === "model") && h.texto)
            .map((h) => ({
            role: h.papel,
            parts: [{ text: String(h.texto) }],
        }));
        contents.push({
            role: "user",
            parts: [{ text: String(mensagem).trim() }],
        });
        const declaracoes = construirDeclaracoesFerramentas(tipoUsuario, permissoes);
        const systemInstruction = {
            parts: [{ text: montarSystemInstruction(ctx) }],
        };
        let modeloUtilizado = MODELOS_GRATUITOS[0];
        let respostaTexto = "";
        for (let rodada = 0; rodada < 4; rodada++) {
            const resultadoGemini = await chamarGeminiComFallback(apiKey, {
                systemInstruction,
                contents,
                tools: [{ functionDeclarations: declaracoes }],
                generationConfig: { temperature: 0.1 },
            });
            if (!resultadoGemini.ok) {
                return res.status(resultadoGemini.status).json({
                    message: resultadoGemini.mensagem,
                    codigo: resultadoGemini.codigo,
                });
            }
            modeloUtilizado = resultadoGemini.modelo;
            const candidato = resultadoGemini.dados?.candidates?.[0];
            const parts = candidato?.content?.parts || [];
            const chamadas = parts.filter((p) => p.functionCall);
            if (chamadas.length === 0) {
                respostaTexto = parts
                    .map((p) => p.text || "")
                    .join("\n")
                    .trim();
                break;
            }
            contents.push({
                role: "model",
                parts,
            });
            const respostasFerramentas = [];
            for (const parte of chamadas) {
                const fc = parte.functionCall;
                let resultadoTool;
                try {
                    resultadoTool = await executarFerramenta(fc.name, fc.args || {}, ctx);
                }
                catch (err) {
                    resultadoTool = { erro: err?.message || "Erro ao executar operação." };
                }
                respostasFerramentas.push({
                    functionResponse: {
                        name: fc.name,
                        response: { result: resultadoTool },
                    },
                });
            }
            contents.push({
                role: "user",
                parts: respostasFerramentas,
            });
        }
        if (!respostaTexto) {
            respostaTexto = ctx.confirmacaoPendente
                ? ctx.confirmacaoPendente.descricao
                : "Operação concluída no sistema.";
        }
        return res.status(200).json({
            resposta: respostaTexto,
            acaoNavegacao: ctx.acaoNavegacao,
            dadosAlterados: ctx.dadosAlterados,
            confirmacaoPendente: ctx.confirmacaoPendente,
            modeloUtilizado,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Erro interno no assistente de IA.",
            error: error?.message || String(error),
        });
    }
};
exports.conversarComAgente = conversarComAgente;
