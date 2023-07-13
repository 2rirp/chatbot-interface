import { Router } from 'express';
import UserController from './controllers/userController'

const router = Router();

const user : UserController = new UserController();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', user.login.bind(user))
router.get('/');

export default router;