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

  getDashboardStats(startDate?: string, endDate?: string): Observable<IDashboardResponse> {
    let url = this.apiUrl + 'stats/';

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    return this.http.get<IDashboardResponse>(url);
  }
}
