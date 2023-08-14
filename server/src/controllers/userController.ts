import { NextFunction, Request, Response } from "express";
import UserServices from "../services/userServices";
import IResponse from "../interfaces/iresponse";
import IUser from "../interfaces/iuser";
import jwtLib from "jsonwebtoken";
import ErrorHandler from "../errors";

export default class UserController {
  public async getMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;

      res.status(200).json({
        error: null,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

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
      const admin = req.user;
      if(admin.is_admin === true) {
      const createdUser = await UserServices.createNewUser(user);
      res.status(200).json({
        error: null,
        data: `User with id ${createdUser.id} registered succesfully!`,
      });
    } else {
      throw ErrorHandler.createError(
        "UnauthorizedError",
        "User is not admin."
      );
    }
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user)
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Token does not contain the user's data"
        );

      const username: string = user.name;

      res.clearCookie("session");
      return res.status(200).json({
        message: `User '${username}' logged out successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}
