import { NextFunction, Request, Response } from "express";
import UserServices from "../services/userServices";
import IResponse from "../interfaces/iresponse";
import IUser from "../interfaces/iuser";
import jwtLib from "jsonwebtoken";

export default class UserController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userCredentials = {
        email: req.body.email,
        password: req.body.password,
      };

      const user = await UserServices.login(
        userCredentials.email,
        userCredentials.password
      );

      const jwt = jwtLib.sign(user, process.env.JWTSECRET || "tulinho");

      res.cookie("session", jwt);
      res.status(201).json({
        error: null,
        data: `User with id ${user.id} logged in succesfully!`,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUser = req.body;

      const createdUser = await UserServices.createNewUser(user);
      res.status(200).json({
        error: null,
        data: `User with id ${createdUser.id} registered succesfully!`,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessagesByDate(req: Request, res: Response) {
    const date = req.body.date;
    /* await this.repository.getConversations(date); */
  }

  async getMessagesByUserId(req: Request, res: Response) {
    const id = req.body.id;
    const date = req.body.date;
    /* await this.repository.getMessagesByUserId(date, id); */
  }
}
