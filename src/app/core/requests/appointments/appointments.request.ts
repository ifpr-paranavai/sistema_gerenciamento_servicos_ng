import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IAppointmentResponse } from '../../interfaces/appointment-response.interface';


@Injectable({
  providedIn: 'root'
})
export class AppointmentsRequest {
  private apiUrl = `${environment.baseUrl}/v1/appointment/appointments`;

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<IAppointmentResponse[]> {
    return this.http.get<IAppointmentResponse[]>(this.apiUrl);
  }

  getAppointment(id: string): Observable<IAppointmentResponse> {
    return this.http.get<IAppointmentResponse>(`${this.apiUrl}/${id}`);
  }

  createAppointment(service: Omit<IAppointmentResponse, 'id'>): Observable<IAppointmentResponse> {
    return this.http.post<IAppointmentResponse>(this.apiUrl, service);
  }

  updateAppointment(id: string, service: Partial<IAppointmentResponse>): Observable<IAppointmentResponse> {
    return this.http.put<IAppointmentResponse>(`${this.apiUrl}/${id}`, service);
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
