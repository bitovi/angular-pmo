import { Injectable, Resource, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from './restaurant';

export interface Config<T> {
  data: T[];
}

export interface State {
  name: string;
  short: string;
}

export interface City {
  name: string;
  state: string;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private http = inject(HttpClient);

  statesLoader(): Observable<Config<State>> {
    return this.http.get<Config<State>>('/api/states');
  }

  getStates(): Resource<Config<State>> {
    return rxResource({
      request: () => ({}),
      loader: () => this.statesLoader(),
    });
  }

  citiesLoader(request: { state: string }): Observable<Config<City>> {
    const options = { params: new HttpParams().set('state', request.state) };
    return this.http.get<Config<City>>('/api/cities', options);
  }

  getCities(
    request: () => { state: string } | undefined,
  ): Resource<Config<City>> {
    return rxResource({
      request,
      loader: ({ request }) => this.citiesLoader(request!),
    });
  }

  restaurantsLoader(request: {
    state: string;
    city: string;
  }): Observable<Config<Restaurant>> {
    const options = {
      params: new HttpParams()
        .set('filter[address.state]', request.state)
        .set('filter[address.city]', request.city),
    };
    return this.http.get<Config<Restaurant>>('/api/restaurants', options);
  }

  getRestaurants(
    request: () => { state: string; city: string } | undefined,
  ): Resource<Config<Restaurant>> {
    return rxResource({
      request,
      loader: ({ request }) => this.restaurantsLoader(request!),
    });
  }

  restaurantLoader(request: { slug: string }): Observable<Restaurant> {
    return this.http.get<Restaurant>('/api/restaurants/' + request.slug);
  }

  getRestaurant(
    request: () => { slug: string } | undefined,
  ): Resource<Restaurant> {
    return rxResource({
      request,
      loader: ({ request }) => this.restaurantLoader(request!),
    });
  }
}
