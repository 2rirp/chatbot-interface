import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../errors";
import Websocket from "../websocket";
import ConversationServices from "../services/conversationService";
import IUser from "../interfaces/iuser";

export default class ConversationController {
  async getConversationsDates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dates = await ConversationServices.getAllConversationsDates();

      res.status(201).json({
        error: null,
        data: dates,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRedirectedConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversations =
        await ConversationServices.getRedirectedConversations();

      res.status(200).json({
        error: null,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const interfaceUser: IUser = req.user;

      const conversationId = req.body.conversation;
      const userId = req.body.user;
      const conversation = await ConversationServices.deactivateConversation(
        conversationId,
        userId
      );

      const websocket = Websocket.getIstance();
      websocket.broadcastToEveryone(
        "removeFromAttendance",
        conversationId,
        interfaceUser.id
      );

      res.status(200).json({
        error: null,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }
}
