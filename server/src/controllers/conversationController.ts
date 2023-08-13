import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../errors";
import ConversationServices from "../services/conversationService";

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
}
