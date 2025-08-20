import { Router } from 'express';
import { createUser, login } from '../controllers/userController';

const routerUser = Router();

routerUser.post('/cadastrarUsuario', createUser);
routerUser.post('/login', login);

export default routerUser;