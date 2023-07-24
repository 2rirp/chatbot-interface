import { Router } from "express";
import UserController from "./controllers/userController";
import BotUserController from "./controllers/botUserController";
import MessageController from "./controllers/messageController";

const router = Router();

const userController: UserController = new UserController();
const botUserController: BotUserController = new BotUserController();
const messageController: MessageController = new MessageController();

router.post("/login", userController.login.bind(userController));
router.post("/createuser", userController.createUser.bind(userController));
router.get(
  "/",
  botUserController.orderUsersByLastConversation.bind(botUserController)
);
router.get(
  "/:userId",
  messageController.getMessagesByUserId.bind(messageController)
);

export default router;
