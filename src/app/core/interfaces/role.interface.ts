import { IFeature } from "./feature.interface";

export interface Role {
    name: string;
    description: string;
    features: IFeature[];
}