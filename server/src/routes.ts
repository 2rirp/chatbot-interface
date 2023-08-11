import { Router } from "express";
import UserController from "./controllers/userController";
import BotUserController from "./controllers/botUserController";
import MessageController from "./controllers/messageController";
import ConversationController from "./controllers/conversationController";
import authenticate from "./middlewares/authenticator";

const router = Router();

const userController: UserController = new UserController();
const botUserController: BotUserController = new BotUserController();
const messageController: MessageController = new MessageController();
const conversationController: ConversationController =
  new ConversationController();

router.get(
  "/api/users/me",
  authenticate,
  userController.getMe.bind(userController)
);

router.post("/api/users/login", userController.login.bind(userController));

router.post(
  "/api/users/createuser",
  authenticate,
  userController.createUser.bind(userController)
);

router.delete("/api/users/logout", userController.logout.bind(userController));

router.get(
  "/api/:date",
  authenticate,
  botUserController.orderUsersByLastConversation.bind(botUserController)
);

router.get(
  "/api/:userId/messages/:date",
  authenticate,
  messageController.getMessagesByUserId.bind(messageController)
);

router.get(
  "/api/messages/:conversationId",
  authenticate,
  messageController.getMessagesByConversationId.bind(messageController)
);

router.get(
  "/api/conversations/dates",
  authenticate,
  conversationController.getConversationsDates.bind(conversationController)
);

router.get(
  "/api/conversations",
  authenticate,
  conversationController.getRedirectedConversations.bind(conversationController)
);
export default router;
