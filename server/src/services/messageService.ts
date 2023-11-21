import ErrorHandler from "../errors";
import { IMessage } from "../interfaces/imessage";
import MessageRepository from "../repositories/messageRepository";

export default class MessageServices {
  private static repository = new MessageRepository();

  public static async getMessagesByUserId(date: string, botUserId: string) {
    try {
      const messages = await this.repository.getMessagesByUserId(
        date,
        botUserId
      );
      /* console.log(messages); */

      return messages;
    } catch (error) {
      throw error;
    }
  }

  public static async getMessagesByConversationId(conversationId: number) {
    try {
      const messages = await this.repository.getMessagesByConversationId(
        conversationId
      );

      return messages;
    } catch (error) {
      throw error;
    }
  }

  public static async createMessage(
    message: string,
    conversationId: number
  ): Promise<IMessage | undefined> {
    try {
      const createdMessage = await this.repository.createMessage(
        message,
        conversationId
      );

      return createdMessage;
    } catch (error) {
      throw error;
    }
  }

  public static async getMessagesFromThreeDays(
    botUserId: string,
    dateLimit: string
  ) {
    try {
      const messages = await this.repository.getMessagesFromThreeDays(
        botUserId,
        dateLimit
      );
      /* console.log(messages); */

      return messages;
    } catch (error) {
      throw error;
    }
  }
}
