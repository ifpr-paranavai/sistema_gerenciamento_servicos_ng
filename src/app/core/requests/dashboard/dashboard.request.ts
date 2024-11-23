import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IDashboardResponse } from '../../interfaces/dashboard-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardRequest {
  private apiUrl = `${environment.baseUrl}/v1/dashboard/`;

  constructor(private http: HttpClient) { }

  getDashboardStats(startDate?: Date, endDate?: Date): Observable<IDashboardResponse> {
    let url = this.apiUrl + 'stats/';
    
    if (startDate && endDate) {
      url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    }

    return this.http.get<IDashboardResponse>(url);
  }
}