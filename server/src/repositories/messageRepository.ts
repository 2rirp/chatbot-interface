import { Query, QueryResult } from "pg";
import dbConnect from "../database/dbConnect";
import { IMessage } from "../interfaces/imessage";

export default class MessageRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }

  async getMessagesByUserId(date: string, botUserId: string) {
    try {
      const queryText = `
            SELECT * FROM messages m
            INNER JOIN (
                SELECT id AS conv_id, status AS conversation_status FROM conversations c WHERE c.created_at >= $1::timestamp 
                    AND c.created_at < ($1::timestamp + INTERVAL '1 day')
                    AND c.user_id = $2 
            ) c ON c.conv_id = m.conversation_id 
            ORDER BY m.created_at, m.id;`;
      const result = await this.db.pool.query(queryText, [date, botUserId]);

      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error("Failed to fetch messages by userId: ", error);
      throw error;
    }
  }

  async getMessagesByConversationId(conversationId: number) {
    try {
      const queryText = `
            SELECT * FROM messages WHERE conversation_id = $1 ORDER BY id`;

      const result = await this.db.pool.query(queryText, [conversationId]);
      return result.rows;
    } catch (error) {
      console.error("Failed to fetch messages by conversationId: ", error);
      throw error;
    }
  }

  async createMessage(
    messageContent: string,
    conversationId: number
  ): Promise<IMessage | undefined> {
    try {
      const options = { timeZone: "America/Sao_Paulo" };
      const date = new Date().toLocaleString("en-US", options);
      const messageFromBot = true;

      const queryText = `INSERT INTO messages (content, conversation_id, created_at, message_from_bot)
            VALUES ($1, $2, $3, $4) RETURNING *`;

      const result = await this.db.pool.query(queryText, [
        messageContent,
        conversationId,
        date,
        messageFromBot,
      ]);

      const createdMessage = result.rows[0];
      return createdMessage;
    } catch (error) {
      console.log(error);
    }
  }

  async getMessagesFromThreeDays(botUserId: string, dateLimit: string) {
    try {
      const queryText = `
            SELECT * FROM messages m
            INNER JOIN (
                SELECT id AS conv_id FROM conversations c WHERE c.created_at < $1 
                    AND c.created_at > ($1 - INTERVAL '3 day')
                    AND c.user_id = $2 
            ) c ON c.conv_id = m.conversation_id 
            ORDER BY m.created_at, m.id;`;
      const result = await this.db.pool.query(queryText, [
        dateLimit,
        botUserId,
      ]);

      return result.rows;
    } catch (error) {
      console.error("Failed to fetch messages from three days ago: ", error);
      throw error;
    }
  }
}
