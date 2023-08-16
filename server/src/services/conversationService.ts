import ConversationRepository from "../repositories/conversationRepository";

export default class ConversationServices {
  private static repository = new ConversationRepository();

  public static async getAllConversationsDates() {
    try {
      const dates = await this.repository.getAllConversationsDates();

      return dates;
    } catch (error) {
      throw error;
    }
  }

  public static async getRedirectedConversations() {
    try {
      const conversations = await this.repository.getRedirectedConversations();

      return conversations;
    } catch (error) {
      throw error;
    }
  }

  public static async deactivateConversation(conversationId: string, userId: string) {
    try {
      const conversation = await this.repository.deactivateConversation(conversationId, userId);
      return conversation;
    } catch (error) {
      throw error;
    }
  }
}
