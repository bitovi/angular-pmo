import { Injectable, resource } from '@angular/core';
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
  constructor(private httpClient: HttpClient) {}

  getStates() {
    return resource({
      request: () => ({}),
      loader: () =>
        firstValueFrom(this.httpClient.get<Config<State>>('/api/states')),
    });
  }

  getCities(request: () => { state: string } | undefined) {
    return resource({
      request,
      loader: ({ request }) => {
        const options = {
          params: new HttpParams().set('state', request!.state),
        };
        return firstValueFrom(
          this.httpClient.get<Config<City>>('/api/cities', options),
        );
      },
    });
  }

  getRestaurants(request: () => { state: string; city: string } | undefined) {
    return resource({
      request,
      loader: ({ request }) => {
        const options = {
          params: new HttpParams()
            .set('filter[address.state]', request!.state)
            .set('filter[address.city]', request!.city),
        };
        return firstValueFrom(
          this.httpClient.get<Config<Restaurant>>('/api/restaurants', options),
        );
      },
    });
  }

  getRestaurant(slug: string) {
    return this.httpClient.get<Restaurant>('/api/restaurants/' + slug + '?');
  }
}
