"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const usuario_1 = __importDefault(require("../models/usuario"));
const userValidations_1 = require("../validations/userValidations");
const createUser = async (req, res) => {
    const data = userValidations_1.createUserSchema.parse(req.body);
    const userExists = await usuario_1.default.findOne({ email: data.email });
    if (userExists)
        return res.status(400).json({ message: 'Email já cadastrado' });
    const cpfExists = await usuario_1.default.findOne({ cpf: data.cpf });
    if (cpfExists)
        return res.status(400).json({ message: 'CPF já cadastrado' });
    const passwordHash = await bcrypt_1.default.hash(data.senha, 10);
    const newUser = new usuario_1.default({ ...data, senha: passwordHash });
    await newUser.save();
    res.status(201).json({ message: "Usuário criado com sucesso", newUser });
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    const users = await usuario_1.default.find().select("-senha"); // não retorna senha
    res.status(200).json(users);
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const user = await usuario_1.default.findById(req.params.id).select("-senha");
    if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json(user);
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const { id } = req.params;
    // só coordenador OU o próprio usuário pode editar
    if (req.user?.tipo !== "coordenador" && req.user?.id !== id) {
        return res.status(403).json({ message: "Acesso negado" });
    }
    const updates = userValidations_1.createUserSchema.parse(req.body);
    ;
    if (updates.senha) {
        updates.senha = await bcrypt_1.default.hash(updates.senha, 10);
    }
    const user = await usuario_1.default.findByIdAndUpdate(id, updates, { new: true }).select("-senha");
    if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json({ message: "Usuário atualizado com sucesso", user });
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await usuario_1.default.findByIdAndDelete(id);
    if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json({ message: "Usuário deletado com sucesso" });
};
exports.deleteUser = deleteUser;
const login = async (req, res) => {
    try {
        const data = userValidations_1.loginSchema.parse(req.body);
        const user = await usuario_1.default.findOne({ email: data.email });
        if (!user)
            return res.status(404).json({ message: "Usuário não encontrado" });
        const validPassword = await bcrypt_1.default.compare(data.senha, user.senha);
        if (!validPassword)
            return res.status(401).json({ message: "Senha inválida" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ message: "Dados inválidos", errors: error.issues });
        }
        res.status(500).json({ message: "Erro ao fazer login" });
    }
};
exports.login = login;
