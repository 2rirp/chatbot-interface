import { NextFunction, Request, Response } from "express";
import MessageServices from "../services/messageService";

export default class MessageController {
  async getMessagesByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const date = req.body.date;

      const messages = await MessageServices.getMessagesByUserId(date, userId);

      res.status(201).json({
        error: null,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }
}
