import ErrorHandler from "../errors";
import IUser from "../interfaces/iuser";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/userRepository";
import { response } from "express";

export default class UsersServices {
  private static repository = new UserRepository();

  public static async login(
    email: string,
    plainTextPassword: string
  ): Promise<IUser> {
    try {
      const user: IUser | null = await this.repository.getUserByEmail(email);

      if (user === null)
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Incorrect e-mail and/or password"
        );

      if (await bcrypt.compare(plainTextPassword, user.password)) {
        return user;
      } else {
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Incorrect e-mail and/or password"
        );
      }
    } catch (error) {
      throw error;
    }
  }

  public static async createNewUser(user: IUser) {
    try {
      const userResponse = await this.repository.getUserByEmail(user.email);

      if (userResponse !== null) {
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Email já está em uso!"
        );
      }
      const passwordHash = await bcrypt.hash(user.password, 10);
      const newUser: IUser = {
        ...user,
        password: passwordHash,
      };
      const createdUser = await this.repository.createNewUser(newUser);
      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  public static async updateUserPassword(email: string, newPassword: string) {
    try {
      const user: IUser = await this.repository.getUserByEmail(email);
      const compare = await bcrypt.compare(newPassword, user.password);
      if (!compare) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const response = await this.repository.updateUserPassword(
          email,
          passwordHash
        );

        return response;
      }
      throw ErrorHandler.createError(
        "ForbiddenError",
        "A nova senha não deve ser igual a senha previamente cadastrada!"
      );
    } catch (error) {
      throw error;
    }
  }

  public static async getAttendantsName(attendantsId: number[]) {
    try {
      let response = null;
      if (attendantsId.length > 0) {
        response = await this.repository.getAttendantsName(attendantsId);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}
