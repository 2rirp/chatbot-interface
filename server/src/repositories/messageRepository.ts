import { Query, QueryResult } from "pg";
import dbConnect from "../database/dbConnect";

export default class MessageRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }

  async getMessagesByUserId(date: string, botUserId: string) {
    try {
      const queryText = `
            SELECT m.id as message_id, m.content, m.conversation_id, m.created_at, m.message_from_bot FROM messages m
            INNER JOIN (
                SELECT id, user_id FROM conversations c WHERE c.created_at >= $1::timestamp 
                    AND c.created_at < ($1::timestamp + INTERVAL '1 day')
                    AND c.user_id = $2 
            ) c ON c.id = m.conversation_id;`;
      const result = await this.db.pool.query(queryText, [date, botUserId]);
      return result.rows;
    } catch (error) {
      console.error("Failed to fetch messages by userId: ", error);
      throw error;
    }
  }

  async getMessagesByConversationId(conversationId: number) {
    try {
      const queryText = `
            SELECT * FROM messages WHERE conversation_id = $1`;

      const result = await this.db.pool.query(queryText, [conversationId]);
      return result.rows;
    } catch (error) {
      console.error("Failed to fetch messages by conversationId: ", error);
      throw error;
    }
  }
}
