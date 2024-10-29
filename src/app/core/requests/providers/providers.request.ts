import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IProvider } from '../../interfaces/provider.interface';

@Injectable({
    providedIn: 'root'
})
export class ProviderRequest {

    private apiUrl = `${environment.baseUrl}/v1/user/providers`;

    constructor(private http: HttpClient) { }

    getProviders(): Observable<IProvider[]> {
        return this.http.get<IProvider[]>(this.apiUrl);
    }
}
