import { TestBed } from '@angular/core/testing';

import { OpenShopsService } from './open-shops.service';

describe('OpenShopsService', () => {
  let service: OpenShopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenShopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
