import { Injectable, Resource, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  HttpClient,
  HttpParams,
  httpResource,
  HttpResourceRef,
} from '@angular/common/http';
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

  getStates(): HttpResourceRef<Config<State> | undefined> {
    return httpResource<Config<State>>({
      url: '/api/states',
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
      defaultValue: { data: [] },
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
      defaultValue: { data: [] },
    });
  }

  restaurantLoader(request: { slug: string }): Observable<Restaurant> {
    return this.http.get<Restaurant>('/api/restaurants/' + request.slug);
  }

  getRestaurant(
    request: () => { slug: string } | undefined,
  ): Resource<Restaurant | undefined> {
    return rxResource({
      request,
      loader: ({ request }) => this.restaurantLoader(request!),
    });
  }
}
