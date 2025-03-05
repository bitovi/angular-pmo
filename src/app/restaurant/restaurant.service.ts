import { Injectable, Resource } from '@angular/core';
import {
  HttpParams,
  httpResource,
  HttpResourceRef,
} from '@angular/common/http';
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
  getStates(): HttpResourceRef<Config<State>> {
    return httpResource<Config<State>>('/api/states', {
      defaultValue: { data: [] },
    });
  }

  getCities(
    request: () => { state: string } | undefined,
  ): Resource<Config<City>> {
    return httpResource<Config<City>>(
      () => {
        const requestValue = request();
        if (!requestValue) {
          return undefined;
        }

        const params = new HttpParams().set('state', requestValue.state);
        return { url: '/api/cities', params };
      },
      { defaultValue: { data: [] } },
    );
  }

  getRestaurants(
    request: () => { state: string; city: string } | undefined,
  ): Resource<Config<Restaurant>> {
    return httpResource<Config<Restaurant>>(
      () => {
        const requestValue = request();
        if (!requestValue) {
          return undefined;
        }

        const params = new HttpParams()
          .set('filter[address.state]', requestValue.state)
          .set('filter[address.city]', requestValue.city);

        return { url: '/api/restaurants', params };
      },
      { defaultValue: { data: [] } },
    );
  }

  getRestaurant(
    request: () => { slug: string } | undefined,
  ): Resource<Restaurant | undefined> {
    return httpResource<Restaurant>(() => {
      const slug = request()?.slug;
      if (!slug) {
        return undefined;
      }
      return `/api/restaurants/${slug}`;
    });
  }
}
