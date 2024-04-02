import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  AbstractControl,
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/restaurant';
import { OrderService, Order, Item } from './order.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ItemTotalPipe } from '../shared/item-total.pipe';
import { OnlyNumbersDirective } from '../shared/only-numbers.directive';
import { MenuItemsComponent } from './menu-items/menu-items.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { OrderDetailsComponent } from './details/details.component';
import { NgIf, CurrencyPipe } from '@angular/common';

interface OrderForm {
  restaurant: FormControl<string | undefined>;
  name: FormControl<string>;
  address: FormControl<string>;
  phone: FormControl<string>;
  items: FormControl<Item[]>;
}

const minLengthArray =
  (min: number) =>
  (c: AbstractControl): { [key: string]: any } | null => {
    if (c.value.length >= min) {
      return null;
    }
    return { minLengthArray: { valid: false } };
  };

@Component({
  selector: 'pmo-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: true,
  imports: [
    NgIf,
    OrderDetailsComponent,
    ReactiveFormsModule,
    TabsModule,
    MenuItemsComponent,
    OnlyNumbersDirective,
    CurrencyPipe,
  ],
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm?: FormGroup<OrderForm>;
  restaurant?: Restaurant;
  isLoading = true;
  orderTotal = 0.0;
  completedOrder?: Order;
  orderComplete = false;
  orderProcessing = false;
  private unSubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private itemTotal: ItemTotalPipe
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') as string;

    this.restaurantService.getRestaurant(slug).subscribe((data: Restaurant) => {
      this.restaurant = data;
      this.isLoading = false;
      this.createOrderForm();
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  createOrderForm() {
    const restaurantId = this.restaurant && this.restaurant._id;
    this.orderForm = this.formBuilder.nonNullable.group({
      restaurant: [restaurantId],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      items: [[] as Item[], minLengthArray(1)],
    });
    this.onChanges();
  }

  onChanges() {
    this.orderForm
      ?.get('items')
      ?.valueChanges.pipe(takeUntil(this.unSubscribe))
      .subscribe((val: Item[]) => {
        this.orderTotal = this.itemTotal.transform(val);
      });
  }

  onSubmit() {
    if (!this.orderForm?.valid) {
      return;
    }
    this.orderProcessing = true;
    this.orderService
      .createOrder(this.orderForm.getRawValue())
      .subscribe((newOrder) => {
        this.completedOrder = newOrder;
        this.orderComplete = true;
        this.orderProcessing = false;
      });
  }

  startNewOrder() {
    this.orderComplete = false;
    this.createOrderForm();
  }
}
