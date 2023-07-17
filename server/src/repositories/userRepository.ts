import { Query, QueryResult } from "pg";
import dbConnect from "../database/dbConnect";
import { IUser, IResponse } from "../interfaces/interfaces";

export default class UserRepository {
  private db: dbConnect;
  constructor() {
    this.db = new dbConnect();
  }
  async login(user: IUser): Promise<IResponse<IUser>> {
    try {
      const queryText = `SELECT id FROM attendants WHERE user = $1 AND password = $2`;
      const result: QueryResult<IUser> = await this.db.pool.query(queryText, [
        user.email,
        user.password,
      ]);

      if (result.rowCount === 0) {
        const res = {
          status: 404,
          errors: "Usuário ou senha incorretos.",
        };
        return res;
      }
      const res: IResponse<IUser> = {
        status: 201,
        data: result.rows[0],
      };
      return res;
    } catch (error) {
      const res: IResponse<any> = {
        status: 500,
        errors: String(error),
      };
      console.log("Failed to login: ", error);
      return res;
    }
  }

  async getConversations(date: string) {
    try {
      const queryText = `
            SELECT u.id, c.last_conversation_created_at
            FROM users u
            INNER JOIN (
                SELECT user_id, MAX(created_at) AS last_conversation_created_at
                FROM conversations c WHERE c.created_at >= $1::00:00:00
                    AND c.created_at < $1::23:59:59
                GROUP BY user_id
            ) c ON u.id = c.user_id;`;

      const result = await this.db.pool.query(queryText, [date]);

      return result.rows;
    } catch (error) {
      console.error("Failed to fetch conversations: ", error);
      throw error;
    }
  }

  async getMessagesByUserId(date: string, userId: string) {
    try {
      const queryText = `
            SELECT * FROM messages m
            INNER JOIN (
                SELECT * FROM conversations c WHERE c.created_at >= $1::00:00:00
                    AND c.created_at < $1::23:59:59
                    AND c.user_id = $2 
            ) c ON c.id = m.conversation_id
            ;`;
      const result = await this.db.pool.query(queryText, [date, userId]);

      return result.rows;
    } catch (error) {
      console.error("Failed to fetch messages by userId: ", error);
      throw error;
    }
  }
}
