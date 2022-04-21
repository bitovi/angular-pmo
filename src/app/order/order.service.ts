import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../restaurant/restaurant.service';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  getOrders() {
    return this.httpClient.get('/api/orders') as Observable<Config<Order>>;
  }

  createOrder(order: Order): Observable<Order> {
    const orderData = Object.assign({}, order);
    orderData.status = 'new';
    return this.httpClient.post('/api/orders', orderData) as Observable<Order>;
  }

  updateOrder(order: Order, action: string) {
    const orderData = Object.assign({}, order);
    orderData.status = action;
    return this.httpClient.put('/api/orders/' + orderData._id, orderData);
  }

  deleteOrder(id: string) {
    return this.httpClient.delete('/api/orders/' + id);
  }

}
