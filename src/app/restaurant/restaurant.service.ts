import { Injectable, Resource, resource } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Restaurant } from './restaurant';
import { firstValueFrom } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  statesLoader(): PromiseLike<Config<State>> {
    return firstValueFrom(this.http.get<Config<State>>('/api/states'));
  }

  getStates(): Resource<Config<State>> {
    return resource({
      request: () => ({}),
      loader: () => this.statesLoader(),
    });
  }

  citiesLoader(request: { state: string }): PromiseLike<Config<City>> {
    const options = { params: new HttpParams().set('state', request.state) };
    return firstValueFrom(this.http.get<Config<City>>('/api/cities', options));
  }

  getCities(
    request: () => { state: string } | undefined,
  ): Resource<Config<City>> {
    return resource({
      request,
      loader: ({ request }) => this.citiesLoader(request!),
    });
  }

  restaurantsLoader(request: {
    state: string;
    city: string;
  }): PromiseLike<Config<Restaurant>> {
    const options = {
      params: new HttpParams()
        .set('filter[address.state]', request.state)
        .set('filter[address.city]', request.city),
    };
    return firstValueFrom(
      this.http.get<Config<Restaurant>>('/api/restaurants', options),
    );
  }

  getRestaurants(
    request: () => { state: string; city: string } | undefined,
  ): Resource<Config<Restaurant>> {
    return resource({
      request,
      loader: ({ request }) => this.restaurantsLoader(request!),
    });
  }

  restaurantLoader(request: { slug: string }): PromiseLike<Restaurant> {
    return firstValueFrom(
      this.http.get<Restaurant>('/api/restaurants/' + request.slug),
    );
  }

  getRestaurant(
    request: () => { slug: string } | undefined,
  ): Resource<Restaurant> {
    return resource({
      request,
      loader: ({ request }) => this.restaurantLoader(request!),
    });
  }
}
