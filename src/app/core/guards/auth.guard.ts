import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, Route, UrlSegment } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { RoutesConstants } from '../constants/routes.constants';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    if (authService.hasAuthenticationToken()) {
        return true;
    } 

    router.navigate([RoutesConstants.AUTH]);
    return false; 
};


export const authMatch: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    const authService = inject(AuthenticationService);
    if (authService.hasAuthenticationToken()) {
        return true;
    } 

    const userFeatures = authService.getUserFeatures();

    return false;    
};