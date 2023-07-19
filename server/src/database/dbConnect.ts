import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: "./config/.env" });
export default class dbConnect {
  private _pool: Pool;
  constructor() {
    this._pool = new Pool({
      user: process.env.DBUSER,
      host: process.env.DBHOST,
      database: process.env.DBNAME,
      password: process.env.DBPASSWORD,
      port: Number(process.env.DBPORT),
      max: 20,
      idleTimeoutMillis: 100,
    });
  }

  get pool() {
    return this._pool;
  }
}
