import { NextFunction, Request, Response } from "express";
import MessageServices from "../services/messageService";
import Websocket from "../websocket";
import IMessage from "../interfaces/imessage";
import ErrorHandler from "../errors";
import IUser from "../interfaces/iuser";

export default class MessageController {
  async getMessagesByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const botUserId = req.params.userId;
      const date = req.params.date;

      const messages = await MessageServices.getMessagesByUserId(
        date,
        botUserId
      );

      res.status(201).json({
        error: null,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessagesByConversationId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const admin : IUser = req.user
      const conversationId = Number(req.params.conversationId);
      if(admin.is_admin === true) {
      const messages = await MessageServices.getMessagesByConversationId(
        conversationId
      );

      res.status(201).json({
        error: null,
        data: messages,
      });
    } else {
      throw ErrorHandler.createError(
        "UnauthorizedError",
        "User is not admin."
      )
    }
    } catch (error) {
      next(error);
    }
  }

  async postMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;

      if (!user)
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Token does not contain the user's data"
        );

      const userId = user.id;

      const conversationId = Number(req.params.conversationId);
      const botUserId = req.params.botUserId;
      const messageBody = req.body;

      const createdMessage: IMessage | undefined =
        await MessageServices.createMessage(
          messageBody.textContent,
          conversationId
        );

      const websocketData = { ...createdMessage, botUserId };
      //websocket
      const websocket = Websocket.getIstance();
      websocket.broadcastToConversation(
        "newAttendantMessage",
        conversationId,
        websocketData,
        userId
      );

      res.status(200).json({ error: null, data: createdMessage });
    } catch (error) {
      next(error);
    }
  }
}
