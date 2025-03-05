import { Injectable, Resource, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Config } from '../restaurant/restaurant.service';
import { Item } from '../restaurant/restaurant';

export interface Order {
  _id: string;
  name: string;
  address: string;
  phone: string;
  restaurant: string;
  status: string;
  items: Item[];
}

interface CreateOrderDto {
  restaurant: string;
  name: string;
  address: string;
  phone: string;
  items: Item[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  getOrders() {
    return this.http.get<Config<Order>>('/api/orders');
  }

  createOrder(
    request: () => { order: CreateOrderDto } | undefined,
  ): Resource<Order | undefined> {
    return httpResource<Order>(() => {
      const requestValue = request();
      if (!requestValue) {
        return undefined;
      }

      return {
        url: '/api/orders',
        method: 'POST',
        body: { ...requestValue.order, status: 'new' },
      };
    });
  }

  updateOrder(order: Order, action: string) {
    const orderData = Object.assign({}, order);
    orderData.status = action;
    return this.http.put('/api/orders/' + orderData._id, orderData);
  }

  deleteOrder(id: string) {
    return this.http.delete('/api/orders/' + id);
  }
}
