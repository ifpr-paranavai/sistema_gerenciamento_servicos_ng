import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, Route, UrlSegment } from '@angular/router';
import { AuthenticationRequest } from '../requests/authentication/authentication.request';
import { RoutesConstants } from '../constants/routes.constants';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationRequest);
    const router = inject(Router);

    if (authService.hasAuthenticationToken()) {
        return true;
    }

    router.navigate([RoutesConstants.AUTH]);
    return false;
};


export const authMatch: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    const authService = inject(AuthenticationRequest);
    if (authService.hasAuthenticationToken()) {
        return true;
    }

    const userFeatures = authService.getUserFeatures();

    return false;
};
