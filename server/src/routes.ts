import { Router } from 'express';
import UserController from './controllers/userController'

const router = Router();

const user : UserController = new UserController();

router.post('/login', user.login.bind(user))
router.get('/', user.getMessagesByDate.bind(user));
router.get('/:id', user.getMessagesByUserId.bind(user))

export default router;