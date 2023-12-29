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

  async getAttendantRedirectedConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversations =
        await ConversationServices.getRedirectedConversations("attendant");

      res.status(200).json({
        error: null,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLecturerRedirectedConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversations =
        await ConversationServices.getRedirectedConversations("lecturer");

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

  async changeConversationServedBy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversationId: number | number[] = req.body.conversationsId;
      const newServedBy: number | null = req.body.newServedBy;
      const attendantId: number = req.body.attendantId;
      const attendantName: string = req.body.attendantName;

      const response = await ConversationServices.changeConversationServedBy(
        conversationId,
        newServedBy,
        attendantId
      );

      const websocket = Websocket.getIstance();
      websocket.broadcastToEveryone(
        "applyAttendantToServe",
        { conversationId, newServedBy, attendantName },
        attendantId
      );

      console.log(
        `Attendant with ID ${attendantId} set served by = ${newServedBy} to conversations ${conversationId} `
      );

      res.status(200).json({
        error: null,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
