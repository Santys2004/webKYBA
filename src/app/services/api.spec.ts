import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient()]
  }));

  it('should be created', () => {
    const service: ApiService = TestBed.inject(ApiService);
    expect(service).toBeTruthy();
  });
});