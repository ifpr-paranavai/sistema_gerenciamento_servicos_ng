import { IUser } from "./user.interface";

export interface IAuthResponse {
    user: IUser;
    access_token: string;
    refresh_token: string;
}