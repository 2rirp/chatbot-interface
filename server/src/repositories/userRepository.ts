import { Query, QueryResult } from "pg";
import dbConnect from "../database/dbConnect";
import IResponse from "../interfaces/iresponse";
import IUser from "../interfaces/iuser";

export default class UserRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }
  async login(user: Partial<IUser>): Promise<IResponse<IUser>> {
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

  async createNewUser(user: IUser) {
    try {
      const query = `INSERT INTO attendants (name, email, password, is_admin)
        VALUES ($1, $2, $3, $4) RETURNING id, email, is_admin`;
      const result = await this.db.pool.query(query, [
        user.name,
        user.email,
        user.password,
        user.is_admin,
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async getUserByEmail(email: string) {
    try {
      const query = `SELECT * FROM attendants WHERE email = $1;`;
      const result = await this.db.pool.query(query, [email]);

      if (result.rowCount !== 0) {
        return result.rows[0];
      }
      return null;
    } catch (error) {
      console.error("Failed to get user by email: ", error);
      throw error;
    }
  }
}
