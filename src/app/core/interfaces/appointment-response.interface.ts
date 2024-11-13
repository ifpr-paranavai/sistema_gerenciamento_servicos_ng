import { PrimeNgSeverity } from "../types/primeng.types";
import { AppointmentStatusEnum } from "./appointment-status.interface";
import { ServiceResponse } from "./service-response.interface"
import { IUser } from "./user.interface";

export interface IAppointmentResponse {
    id: string;
    appointment_date: string;
    status: AppointmentStatusEnum;
    client: IUser;
    provider: IUser; 
    services: ServiceResponse[];
    is_completed: boolean;
    document: IDocument;
    observation: string;
    rating: number;
    severety?: PrimeNgSeverity;
    documents?: IDocument[];
}

export interface IDocument {
    id: number;
    file_content: string;
    file_name: string;
    file_type: string;
    file_size: number;
    created_at?: string;
    updated_at?: string;
}
