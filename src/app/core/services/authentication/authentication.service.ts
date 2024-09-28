import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthResponse } from '../../interfaces/auth-response.interface';
import { environment } from '../../../../environments/environment';
import { IFeature } from '../../interfaces/feature.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private baseUrl: string = environment.baseUrl;

    authenticationKeyLocalStorage = 'authentication';

    constructor(
        private http: HttpClient,
    ) {}

    doUserLogin(email: string, password: string): Observable<IAuthResponse> {
        return this.http.post<IAuthResponse>(
            `${this.baseUrl}/v1/authentication/login/`, { email, password }
        );
    }

    logout(): void {
        localStorage.removeItem(this.authenticationKeyLocalStorage);
    }

    setUserLocalStorage(user: IAuthResponse): void {
        localStorage.setItem(this.authenticationKeyLocalStorage, JSON.stringify(user));
    }

    hasAuthenticationToken(): boolean {
        return !!localStorage.getItem(this.authenticationKeyLocalStorage);
    }

    getUserFeatures(): IFeature[] {
        const token = JSON.parse(localStorage.getItem(this.authenticationKeyLocalStorage)!);
        return token.user.features;
    }
}
