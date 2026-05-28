import { Router } from 'express';
import { createUser, login, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticate } from '../middlewares/autenticacaoMiddleware';
import { verifyCoordenador } from '../middlewares/verificarUser';

const routerUser = Router();

routerUser.post('/cadastrarUsuario', createUser);
routerUser.post('/login', login);
routerUser.get("/usuarios", authenticate, getUsers);
routerUser.get("/usuario/:id", authenticate, verifyCoordenador, getUserById);
routerUser.put("/usuario/:id", authenticate, verifyCoordenador, updateUser);
routerUser.delete("/usuario/:id", authenticate, verifyCoordenador, deleteUser);

export default routerUser;