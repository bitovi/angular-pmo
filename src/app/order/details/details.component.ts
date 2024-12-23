import { Component, Input } from '@angular/core';
import { Order } from '../order.service';
import { ItemTotalPipe } from '../../shared/item-total.pipe';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'pmo-order-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [CurrencyPipe, ItemTotalPipe],
})
export class OrderDetailsComponent {
  @Input({ required: true }) order!: Order;
}
