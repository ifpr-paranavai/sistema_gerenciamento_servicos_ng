import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthenticationService', () => {
    let service: AuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule], 
            providers: [AuthenticationService]
        });
        service = TestBed.inject(AuthenticationService);
    });

    it('Deverá instanciar o service', () => {
        expect(service).toBeTruthy();
    });
});
