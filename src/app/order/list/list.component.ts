import { Component, Input } from '@angular/core';
import { Order, OrderService } from '../order.service';
import { ItemTotalPipe } from '../../shared/item-total.pipe';
import { NgClass, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'pmo-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [NgClass, CurrencyPipe, ItemTotalPipe],
})
export class OrderListComponent {
  @Input() orders: Order[] = [];
  @Input() listTitle?: string;
  @Input() status?: string;
  @Input() statusTitle?: string;
  @Input() action?: string;
  @Input() actionTitle?: string;
  @Input() emptyMessage?: string;
  isPending = false;

  constructor(private orderService: OrderService) {}

  markAs(order: Order, action: string) {
    this.orderService.updateOrder(order, action).subscribe();
  }

  delete(id: string) {
    this.orderService.deleteOrder(id).subscribe();
  }
}
