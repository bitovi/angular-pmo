import { Component, OnInit, Input } from '@angular/core';
import {Order} from "../order.service";

@Component({
  selector: 'pmo-order-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  @Input({ required: true }) order!: Order;

  constructor() { }

  ngOnInit() {
    if (!this.order) {
      throw new Error('Order is not defined');
    }
  }
}
