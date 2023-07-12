import { QueryResult } from 'pg';
import dbConnect from '../database/dbConnect'
import  { IUser, IResponse } from '../interfaces/interfaces';


export default class UserRepository {
    private db : dbConnect;
    constructor() {
        this.db = new dbConnect();
    }
    public async login(user : IUser) : Promise<IResponse<IUser>>{
        try {
            const queryText = `SELECT id FROM attendants WHERE user = $1 AND password = $2`;
            const result: QueryResult<IUser> = await this.db.pool.query(queryText, [user.username, user.password]);

            if (result.rowCount === 0) {
                const res = {
                    status: 404,
                    errors: "Usuário ou senha incorretos."
                };
                return res;
            }
            const res: IResponse<IUser> = {
                status: 201,
                data: result.rows[0],
            }
            return res;


        } catch (error) {
            const res : IResponse<any> = {
                status: 500,
                errors: String(error),
            }
            console.log('Failed to login: ', error)
            return res;
        }
    }
}