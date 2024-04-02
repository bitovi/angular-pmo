import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../order.service';
import { ItemTotalPipe } from '../../shared/item-total.pipe';
import { NgFor, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'pmo-order-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [NgFor, CurrencyPipe, ItemTotalPipe],
})
export class OrderDetailsComponent implements OnInit {
  @Input({ required: true }) order!: Order;

  constructor() {}

  ngOnInit() {
    if (!this.order) {
      throw new Error('Order is not defined');
    }
  }
}
