import { Router } from "express";
import UserController from "./controllers/userController";
import BotUserController from "./controllers/botUserController";
import MessageController from "./controllers/messageController";
import ConversationController from "./controllers/conversationController";
import ReportsController from "./controllers/reportsController";
import authenticate from "./middlewares/authenticator";

const router = Router();

const userController: UserController = new UserController();
const botUserController: BotUserController = new BotUserController();
const messageController: MessageController = new MessageController();
const reportsController: ReportsController = new ReportsController();
const conversationController: ConversationController =
  new ConversationController();

router.get(
  "/api/users/me",
  authenticate,
  userController.getMe.bind(userController)
);

router.post("/api/users/login", userController.login.bind(userController));

router.patch("/api/users/update-password", authenticate, userController.updateUser.bind(userController));

router.post(
  "/api/users/createuser",
  authenticate,
  userController.createUser.bind(userController)
);

router.delete(
  "/api/users/logout",
  authenticate,
  userController.logout.bind(userController)
);

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
  "/api/messages/:userId/:date",
  authenticate,
  messageController.getMessagesFromThreeDays.bind(messageController)
);

/* router.post(
  "/api/messages/:conversationId/:botUserId",
  authenticate,
  messageController.postMessage.bind(messageController)
); */

router.get(
  "/api/conversations/dates",
  authenticate,
  conversationController.getConversationsDates.bind(conversationController)
);

router.get(
  "/api/conversations/redirected",
  authenticate,
  conversationController.getRedirectedConversations.bind(conversationController)
);

router.post(
  "/api/conversations/end",
  authenticate,
  conversationController.deactivateConversation.bind(conversationController)
);

router.get(
  "/api/r/reports/all",
  authenticate,
  reportsController.getReports.bind(reportsController)
);

router.get(
  "/api/reports/users/:date",
  authenticate,
  reportsController.getUsersByDate.bind(reportsController)
);
router.get(
  "/api/reports/:date",
  authenticate,
  reportsController.getReportsByDate.bind(reportsController)
);
export default router;
