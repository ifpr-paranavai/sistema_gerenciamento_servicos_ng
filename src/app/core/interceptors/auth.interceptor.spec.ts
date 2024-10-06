import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';


describe('authInterceptor', () => {
  const interceptor = () =>{
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor
      ]
    });
  }
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
