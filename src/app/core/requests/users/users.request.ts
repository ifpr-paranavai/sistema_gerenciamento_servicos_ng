import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IUser } from '../../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UsersRequest {

    private apiUrl = `${environment.baseUrl}/v1/user/users`;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<IUser[]> {
        return this.http.get<IUser[]>(this.apiUrl);
    }
}
