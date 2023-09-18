import { Query, QueryResult } from "pg";
import dbConnect from "../database/dbConnect";
import UsersArray, { User } from "../interfaces/usersArray";

export default class BotUserRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }

  async getConversations(date: string): Promise<UsersArray> {
    try {
      const queryText = `
            SELECT u.id AS "botUserId", c.last_conversation_created_at
            FROM users u
            INNER JOIN (
                SELECT user_id, MAX(created_at) AS last_conversation_created_at
                FROM conversations c WHERE c.created_at >= $1::timestamp
                    AND c.created_at < ($1::timestamp + INTERVAL '1 day')
                GROUP BY user_id
            ) c ON u.id = c.user_id;`;

      const result = await this.db.pool.query(queryText, [date]);

      const users: UsersArray = result.rows.map((row: User) => ({
        botUserId: row.botUserId,
        last_conversation_created_at: row.last_conversation_created_at,
      }));

      return users;
    } catch (error) {
      console.error("Failed to fetch conversations: ", error);
      throw error;
    }
  }
}
