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
      const queryText = `SELECT id, updated_at FROM attendants WHERE user = $1 AND password = $2`;
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
      const query = `INSERT INTO attendants (name, email, password, is_admin, is_attendant, is_lecturer)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, is_admin`;
      const result = await this.db.pool.query(query, [
        user.name,
        user.email,
        user.password,
        user.is_admin,
        user.is_attendant,
        user.is_lecturer
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

  public async updateUserPassword(email: string, newPassword: string) {
    try {
      const options = { timeZone: "America/Sao_Paulo" };
      const date = new Date().toLocaleString("en-US", options);
      
      const queryText = `UPDATE attendants SET password = $2, updated_at = $3 WHERE email = $1 RETURNING email;`;
      const result = await this.db.pool.query(queryText, [email, newPassword, date]);
        if(result.rowCount === 1) {
          const res: IResponse<IUser> = {
            status: 201,
            data: result.rows[0],
          };
          return res;
        }
        return null;

    } catch (error) {
      const res: IResponse<any> = {
        status: 500,
        errors: String(error),
      }
      console.error("Failed to UPDATE attendant: ", error)
      return res;
    }
  }
}
