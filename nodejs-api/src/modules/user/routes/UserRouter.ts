import { Router } from 'express';
import { UserController } from '../controller/UserController';
const userRouters = Router();
const userController = new UserController();

userRouters.get('/', (req, res) => userController.listAllUsers(req, res));

userRouters.get('/:id', (req, res) => userController.getUserById(req, res));

userRouters.post('/', (req, res) => userController.createUser(req, res));

userRouters.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default userRouters;
