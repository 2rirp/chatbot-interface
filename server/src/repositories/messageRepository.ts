import { Query, QueryResult } from "pg";
import dbConnect from "../database/dbConnect";

export default class MessageRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }
  async getMessagesByUserId(date: string, userId: string) {
    try {
      const queryText = `
            SELECT * FROM messages m
            INNER JOIN (
                SELECT * FROM conversations c WHERE c.created_at >= $1::timestamp 
                    AND c.created_at < ($1::timestamp + INTERVAL '1 day')
                    AND c.user_id = $2 
            ) c ON c.id = m.conversation_id;`;
      const result = await this.db.pool.query(queryText, [date, userId]);
      return result.rows;
    } catch (error) {
      console.error("Failed to fetch messages by userId: ", error);
      throw error;
    }
  }
}
