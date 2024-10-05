import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServiceResponse } from '../../interfaces/service-response.interface copy';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private baseUrl: string = environment.baseUrl;

    constructor(
        private http: HttpClient,
    ) {}

    getServices(): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(
            `${this.baseUrl}/v1/services/`,
        );
    }
}
