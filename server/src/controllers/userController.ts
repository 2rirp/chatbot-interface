import { Request, Response } from 'express';
import UserRepository from '../repositories/userRepository'
import { IUser, IResponse } from '../interfaces/interfaces';
import jwtLib from "jsonwebtoken";

export default class UserController {
    private repository : UserRepository;

    constructor() {
        this.repository = new UserRepository()
    }
    async login(req: Request, res: Response) {
        const user = {
            email: req.body.email,
            password: req.body.password
        };
        
        if(!user || !user.email || !user.password) {
            return res.status(400).json( { error: "Dados Incompletos" });
        }
        
        const serverResponse: IResponse<IUser> = await this.repository.login(user);

        if(serverResponse.status === 201 && serverResponse.data !== undefined) {
            
        const jwt = jwtLib.sign(user, process.env.JWTSECRET || "tulinho");

            res.cookie("session", jwt);
            res.status(201).json({
                error: null,
                data: "User logged in successfully!",
            });
        }
        else {
            res.status(serverResponse.status).json({ error: serverResponse.errors })
        }
    }

    async createUser() {
        
    }

    async getMessagesByDate(req: Request, res: Response) {
        const date = req.body.date;
        await this.repository.getConversations(date);

    }

    async getMessagesByUserId(req: Request, res: Response) {
        const id = req.body.id;
        const date = req.body.date;
        await this.repository.getMessagesByUserId(date, id)
    }

}