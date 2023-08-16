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
  
  async deactivateConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversationId = req.body.conversation;
      const userId = req.body.user;
      const conversation = await ConversationServices.deactivateConversation(conversationId, userId)
      
      res.status(200).json({
        error: null,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }
}
