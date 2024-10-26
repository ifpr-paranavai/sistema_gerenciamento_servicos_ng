import { TestBed } from '@angular/core/testing';

import { ServiceOfferService } from './service-offer.service';

describe('ServiceService', () => {
  let service: ServiceOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
