import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { RoutesConstants } from '../constants/routes.constants';

export const loginGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    if (authService.hasAuthenticationToken()) {
        router.navigate([RoutesConstants.HOME]);
        return false;
    } 

    return true;    
};