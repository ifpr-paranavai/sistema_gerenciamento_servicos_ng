import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppointmentResponse } from '../../interfaces/appointment-response.interface';


@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private apiUrl = `${environment.baseUrl}/v1/appointment/appointments`;

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(this.apiUrl);
  }

  getAppointment(id: string): Observable<AppointmentResponse> {
    return this.http.get<AppointmentResponse>(`${this.apiUrl}/${id}`);
  }

  createAppointment(service: Omit<AppointmentResponse, 'id'>): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(this.apiUrl, service);
  }

  updateAppointment(id: string, service: Partial<AppointmentResponse>): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(`${this.apiUrl}/${id}`, service);
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}