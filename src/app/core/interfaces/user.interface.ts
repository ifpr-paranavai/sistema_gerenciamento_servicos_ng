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
    profile?: IProfile | null;
}

export interface IProfile {
    id: number;
    street: string | null;
    number: string | null;
    city: string | null;
    state: string | null;
    'zip_code': string | null;
    'profile_picture': string | null;
}
