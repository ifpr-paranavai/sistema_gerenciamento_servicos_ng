import { ServiceResponse } from "./service-response.interface"
import { IUser } from "./user.interface";

export interface IAppointmentResponse {
  id: string;
  appointment_date: string;
  status: string;
  client: IUser;
  provider: IUser;
  services: ServiceResponse[];
  is_completed: boolean;
  document: IDocument;
  rating: number;
}

export interface IDocument {
  id: number;
  url: string;
}