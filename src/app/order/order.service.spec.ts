import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';

describe('OrderService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi())],
    }),
  );

  it('should be created', () => {
    const service: OrderService = TestBed.inject(OrderService);
    expect(service).toBeTruthy();
  });
});
