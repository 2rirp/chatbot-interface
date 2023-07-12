import {Request, Response} from 'express';
import UserRepository from '../repositories/userRepository'
import { IUser, IResponse } from '../interfaces/interfaces';

export default class UserController {
    private repository : UserRepository;

    constructor() {
        this.repository = new UserRepository()
    }
    public async login(req: Request, res: Response) {
        const user = req.body;
        
        if(!user || !user.user || !user.password) {
            return res.status(400).json( { error: "Dados Incompletos" });
        }
        
        const serverResponse: IResponse<IUser> = await this.repository.login(user);

        if(serverResponse.status === 201 && serverResponse.data !== undefined) {
            return res.status(201).json();
        }
        else {
            res.status(serverResponse.status).json({ error: serverResponse.errors })
        }
    }

}