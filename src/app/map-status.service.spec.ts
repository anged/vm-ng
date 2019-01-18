import { TestBed, inject } from '@angular/core/testing';

import { MapStatusService } from './map-status.service';

describe('MapStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapStatusService]
    });
  });

  it('should be created', inject([MapStatusService], (service: MapStatusService) => {
    expect(service).toBeTruthy();
  }));
});
