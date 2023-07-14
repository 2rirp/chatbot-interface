export interface IUser {
    username: string,
    password: string
}

export interface IResponse<T> {
    status: number;
    data?: T;
    errors?: any;
}