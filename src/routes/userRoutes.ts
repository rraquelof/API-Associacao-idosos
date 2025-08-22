import { Router } from 'express';
import { createUser, login, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticate } from '../middlewares/autenticacaoMiddleware';
import { verifyCoordenador } from '../middlewares/verificarCoordenador';

const routerUser = Router();

routerUser.post('/cadastrarUsuario', createUser);
routerUser.post('/login', login);
routerUser.get("/usuarios", authenticate, verifyCoordenador, getUsers);
routerUser.get("/usuarios/:id", authenticate, getUserById);
routerUser.put("/usuarios/:id", authenticate,verifyCoordenador, updateUser);
routerUser.delete("/usuarios/:id", authenticate, verifyCoordenador, deleteUser);

export default routerUser;