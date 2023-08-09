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
}
