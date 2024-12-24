import { Injectable, Resource, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  createOrderLoader(request: { order: CreateOrderDto }): Observable<Order> {
    const orderData = { ...request.order, status: 'new' };
    return this.http.post<Order>('/api/orders', orderData);
  }

  createOrder(
    request: () => { order: CreateOrderDto } | undefined,
  ): Resource<Order> {
    return rxResource({
      request,
      loader: ({ request }) => this.createOrderLoader(request!),
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
