import { Router } from "express";
import UserController from "./controllers/userController";
import BotUserController from "./controllers/botUserController";
import MessageController from "./controllers/messageController";
import authenticate from "./middlewares/authenticator";

const router = Router();

const userController: UserController = new UserController();
const botUserController: BotUserController = new BotUserController();
const messageController: MessageController = new MessageController();

router.post("/login", userController.login.bind(userController));

router.post(
  "/createuser",
  authenticate,
  userController.createUser.bind(userController)
);

router.get(
  "/",
  authenticate,
  botUserController.orderUsersByLastConversation.bind(botUserController)
);

router.get(
  "/:userId",
  authenticate,
  messageController.getMessagesByUserId.bind(messageController)
);

export default router;
