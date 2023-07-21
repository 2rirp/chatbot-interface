import MessageRepository from "../repositories/messageRepository";

export default class MessageServices {
  private static repository = new MessageRepository();

  public static async getMessagesByUserId(date: string, userId: string) {
    try {
      const messages = await this.repository.getMessagesByUserId(date, userId);
      console.log(messages);

      return messages;
    } catch (error) {
      throw error;
    }
  }
}
