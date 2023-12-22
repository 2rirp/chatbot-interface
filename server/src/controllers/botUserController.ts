import { NextFunction, Request, Response } from "express";
import UsersArray from "../interfaces/usersArray";
import BotUserService from "../services/botUserService";

export default class BotUserController {
  async orderUsersByLastConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const date: string = req.params.date;
      const users = await BotUserService.orderUsersByLastConversation(date);

      res.status(200).json({
        error: null,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}
