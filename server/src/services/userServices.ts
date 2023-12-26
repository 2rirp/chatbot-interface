import ErrorHandler from "../errors";
import IUser, { IUserResponse } from "../interfaces/iuser";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/userRepository";

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

  public static async getAllAttendants() {
    try {
      const users = await this.repository.getAllAttendants();
      if(users) {
        const filtered = users.map(attendants => ({
          id: attendants.id,
          name: attendants.name,
          email: attendants.email,
        }))
        return filtered;
      }
      else
        throw ErrorHandler.createError(
          "InternalServerError",
          "Something went wrong..."
      );
    } catch (error) {
      
    }
  }

  public static async updateUserPassword(email: string, newPassword: string) {
    try {
      const user: IUser = await this.repository.getUserByEmail(email);
      const compare = await bcrypt.compare(newPassword, user.password);
      if (!compare) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const response = await this.repository.updateUserPassword(email, passwordHash);

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

  public static async resetAttendantPassword(userId: number) {
    const defaultPassword = 'mudarsenha';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    try {
      const response = await this.repository.resetAttendantPasswordById(passwordHash, userId)
      if(response)
        return response 
          else
        throw ErrorHandler.createError(
          "InternalServerError",
          "Something went wrong..."
      );
    } catch (error) {
      throw error;
    }
  }
}
