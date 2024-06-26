import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private httpClient: HttpClient) { }

  getStates() {
    return this.httpClient.get<Config<State>>('/api/states');
  }

  getCities(state: string) {
    const options = { params: new HttpParams().set('state', state)};
    return this.httpClient.get<Config<City>>('/api/cities', options);
  }

  getRestaurants(state: string, city: string) {
    const options = { params: new HttpParams().set('filter[address.state]', state).set('filter[address.city]', city) };
    return this.httpClient.get<Config<Restaurant>>('/api/restaurants', options);
  }

  getRestaurant(slug: string) {
    return this.httpClient.get<Restaurant>('/api/restaurants/' + slug + '?');
  }
}
