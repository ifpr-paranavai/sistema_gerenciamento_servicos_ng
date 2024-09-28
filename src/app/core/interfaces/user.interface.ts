import { IFeature } from "./feature.interface";
import { Role } from "./role.interface";

export interface IUser {
    id: string;
    email: string;
    name: string;
    password: string;
    cpf: string;
    role: Role[] | number;
    features: IFeature[];
}