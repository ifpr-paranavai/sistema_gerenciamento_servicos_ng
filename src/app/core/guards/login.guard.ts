import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationRequest } from '../requests/authentication/authentication.request';
import { RoutesConstants } from '../constants/routes.constants';

export const loginGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationRequest);
    const router = inject(Router);

    if (authService.hasAuthenticationToken()) {
        router.navigate([RoutesConstants.HOME]);
        return false;
    }

    return true;
};
