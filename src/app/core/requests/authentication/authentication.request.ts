import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IAuthResponse } from '../../interfaces/auth-response.interface';
import { environment } from '../../../../environments/environment';
import { IFeature } from '../../interfaces/feature.interface';
import { IUser } from '../../interfaces/user.interface';
import { IEditUserPayload } from '../../interfaces/edit-user-payload.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationRequest {
    private baseUrl: string = environment.baseUrl;
    private authenticationKeyLocalStorage = 'authentication';
    private currentUserSubject: BehaviorSubject<IAuthResponse | null>;
    public currentUser: Observable<IAuthResponse | null>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<IAuthResponse | null>(this.getUserFromLocalStorage());
        this.currentUser = this.currentUserSubject.asObservable();
    }

    private getUserFromLocalStorage(): IAuthResponse | null {
        const userString = localStorage.getItem(this.authenticationKeyLocalStorage);
        return userString ? JSON.parse(userString) : null;
    }

    public get currentUserValue(): IAuthResponse | null {
        return this.currentUserSubject.value;
    }

    public get token(): string | null {
        return this.currentUserValue?.access_token || null;
    }

    doUserLogin(email: string, password: string): Observable<IAuthResponse> {
        return this.http.post<IAuthResponse>(
            `${this.baseUrl}/v1/authentication/login/`, { email, password }
        ).pipe(
            tap(user => {
                this.setUserLocalStorage(user);
                this.currentUserSubject.next(user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.authenticationKeyLocalStorage);
        this.currentUserSubject.next(null);
    }

    setUserLocalStorage(user: IAuthResponse): void {
        localStorage.setItem(this.authenticationKeyLocalStorage, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    hasAuthenticationToken(): boolean {
        return !!this.token;
    }

    getUserFeatures(): IFeature[] {
        return this.currentUserValue?.user.features || [];
    }

    getUserById(pk: string): Observable<IAuthResponse> {
        return this.http.get<IAuthResponse>(`${this.baseUrl}/v1/authentication/${pk}/`);
    }

    updateUserById(userId: string, payload: IEditUserPayload): Observable<IUser> {
        return this.http.put<IUser>(`${this.baseUrl}/v1/user/${userId}/update-user/`, payload);
    }
}
