import { NextFunction, Request, Response } from "express";
import MessageServices from "../services/messageService";

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
}
