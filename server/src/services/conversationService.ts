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

  public static async getRedirectedConversations(
    typeOfRedirected: "attendant" | "lecturer"
  ) {
    try {
      const conversations = await this.repository.getRedirectedConversations(
        typeOfRedirected
      );

      return conversations;
    } catch (error) {
      throw error;
    }
  }

  public static async deactivateConversation(
    conversationId: string,
    userId: string
  ) {
    try {
      const conversation = await this.repository.deactivateConversation(
        conversationId,
        userId
      );
      return conversation;
    } catch (error) {
      throw error;
    }
  }

  public static async changeConversationServedBy(
    conversationsId: number | number[],
    newServedBy: number | null
  ) {
    try {
      let response = false;
      if (Array.isArray(conversationsId)) {
        response = await this.repository.changeMultipleConversationsServedBy(
          conversationsId,
          newServedBy
        );
      } else {
        response = await this.repository.changeConversationServedBy(
          conversationsId,
          newServedBy
        );
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}
