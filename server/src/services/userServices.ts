import ErrorHandler from "../errors";
import { IUser } from '../interfaces/interfaces';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/userRepository';

export default class UsersServices {
    private static repository = new UserRepository;

    public static async login() {
        try {
            
        } catch (error) {
            
        }
    }

    public static async createNewUser(user : IUser) {
        try {
            const userResponse = await this.repository.getUserByEmail(user.email);

            if(!userResponse) {
                throw ErrorHandler.createError(
					"UnauthorizedError",
					"Email já está em uso!"
				);
            }
            const passwordHash = await bcrypt.hash(user.password, 10);
            const newUser: IUser = {
                ...user,
                password: passwordHash
             }
             const createdUser = await this.repository.createNewUser(newUser);
			return createdUser;
        } catch (error) {
            throw error;
        }
    }
    
}