import ErrorHandler from "../errors";
import IUser from "../interfaces/iuser";
import BotUserRepository from "../repositories/botUserRepository";
import UsersArray from "../interfaces/usersArray";

export default class BotUserService {
  private static repository = new BotUserRepository();

  public static async orderUsersByLastConversation(date: string) {
    try {
      const users = await this.repository.getConversations(date);
      /* console.log(users); */

      return users;
    } catch (error) {
      throw error;
    }
  }
}
