import { PrimeNgSeverity } from "../types/primeng.types";
import { AppointmentStatusEnum } from "./appointment-status.interface";
import { ServiceResponse } from "./service-response.interface"
import { IUser } from "./user.interface";

export interface IAppointmentResponse {
    id: string | number;
    appointment_date: string;
    status: AppointmentStatusEnum;
    client: IUser;
    provider: IUser; 
    services: ServiceResponse[];
    is_completed: boolean;
    document: IDocument;
    rating: number;
    severety?: PrimeNgSeverity;
}

export interface IDocument {
    id: number;
    url: string;
}
