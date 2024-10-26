import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { IServiceOfferPayload } from '../../interfaces/service-offer.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceOfferService {
  private apiUrl = `${environment.baseUrl}/v1/service/services/`;

  constructor(private http: HttpClient) { }

  getServices(): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(this.apiUrl);
  }

  getServiceById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.apiUrl}/${id}`);
  }

    createService(service: IServiceOfferPayload): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(this.apiUrl, service);
  }

  updateService(id: number, service: Partial<ServiceResponse>): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
