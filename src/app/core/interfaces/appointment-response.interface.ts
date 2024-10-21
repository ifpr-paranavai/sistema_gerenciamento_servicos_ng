import { ServiceResponse } from "./service-response.interface"
import { IUser } from "./user.interface";

export interface AppointmentResponse {
  id: string;
  appointment_date: string;
  status: string;
  client: IUser;
  provider: IUser;
  services: ServiceResponse[];
  is_completed: boolean;
  document: {
    id: number;
    url: string;
  }[];
  rating: number;
}