import { NextFunction, Request, Response, response } from "express";
import UserServices from "../services/userServices";
import IResponse from "../interfaces/iresponse";
import IUser from "../interfaces/iuser";
import jwtLib from "jsonwebtoken";
import ErrorHandler from "../errors";
import UsersServices from "../services/userServices";

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
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendants = await UsersServices.getAllAttendants();

      res.status(200).json({
        error: null,
        data: attendants,
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
        data: user,
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
      if (admin.is_admin === true) {
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

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const updatedUser = await UserServices.updateUserPassword(
        email,
        password
      );
      if (updatedUser?.status === 201) {
        res.clearCookie("session");
        const user = {
          email: updatedUser.data.email,
          password: updatedUser.data.password,
        };
        const jwt = jwtLib.sign(user, process.env.JWTSECRET || "tulinho");
        res.cookie("session", jwt);
        res.status(201).json({
          error: null,
          data: user,
        });
        return updatedUser.data;
      }
    } catch (error) {
      next(error);
    }
  }
  
  async resetUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id: number = req.body.id;
      const updatedUser = await UserServices.resetAttendantPassword(id);
      if (updatedUser.status === 200) {
        res.status(200).json({
          error: null,
          data: null,
        });
        return;
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

  async getAttendantsName(req: Request, res: Response, next: NextFunction) {
    try {
      const attendantsId: number[] = req.body.attendantsId;

      const response = await UserServices.getAttendantsName(attendantsId);

      res.status(200).json({
        error: null,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
