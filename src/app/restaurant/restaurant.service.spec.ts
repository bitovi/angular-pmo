import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { RestaurantService } from './restaurant.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

// let fakeStates = {
//   "data":
//   [{"short":"IL","name":"Illinois"},
//   {"short":"WI","name":"Wisconsin"},
//   {"short":"MI","name":"Michigan"}
// ]};

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  //let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        RestaurantService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    restaurantService = TestBed.get(RestaurantService);
    //httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(restaurantService).toBeTruthy();
  });
});
