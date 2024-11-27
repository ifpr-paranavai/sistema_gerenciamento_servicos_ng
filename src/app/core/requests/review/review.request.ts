import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.baseUrl}/v1/appointment/reviews/`;

  constructor(private http: HttpClient) { }

  createReview(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateReview(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}${id}`, data);
  }
}