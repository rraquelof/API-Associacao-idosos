import { Router } from 'express';
import { createUser, login, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticate } from '../middlewares/autenticacaoMiddleware';

const routerUser = Router();

routerUser.post('/cadastrarUsuario', createUser);
routerUser.post('/login', login);
routerUser.get("/usuarios", authenticate, getUsers);
// Controle de "só o próprio usuário ou coordenador" fica dentro do controller,
// pra permitir que cada usuário veja/edite/exclua a própria conta.
routerUser.get("/usuario/:id", authenticate, getUserById);
routerUser.put("/usuario/:id", authenticate, updateUser);
routerUser.delete("/usuario/:id", authenticate, deleteUser);

export default routerUser;