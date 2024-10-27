import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthenticationRequest } from '../requests/authentication/authentication.request';
import { RoutesConstants } from '../constants/routes.constants';

describe('AuthGuard', () => {
    let mockAuthService: jasmine.SpyObj<AuthenticationRequest>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        mockAuthService = jasmine.createSpyObj('AuthenticationService', ['hasAuthenticationToken']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = { url: RoutesConstants.HOME } as RouterStateSnapshot;

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthenticationRequest, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });
    });

    it('Deve permitir o acesso se o usuário estiver autenticado', () => {
        mockAuthService.hasAuthenticationToken.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBeTrue();
    });

    it('Deve redirecionar para a página de autenticação se o usuário não estiver autenticado', () => {
        mockAuthService.hasAuthenticationToken.and.returnValue(false);

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith([RoutesConstants.AUTH]);
    });
});
