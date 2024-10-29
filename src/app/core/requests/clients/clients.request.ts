import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IClient } from '../../interfaces/client.interface';

@Injectable({
    providedIn: 'root'
})
export class ClientRequest {

    private apiUrl = `${environment.baseUrl}/v1/user/clients`;

    constructor(private http: HttpClient) { }

    getClients(): Observable<IClient[]> {
        return this.http.get<IClient[]>(this.apiUrl);
    }
}
