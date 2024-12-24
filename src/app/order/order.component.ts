import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  ResourceStatus,
  signal,
  Signal,
} from '@angular/core';
import {
  AbstractControl,
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  NonNullableFormBuilder,
} from '@angular/forms';

import { RestaurantService } from '../restaurant/restaurant.service';
import { OrderService } from './order.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ItemTotalPipe } from '../shared/item-total.pipe';
import { OnlyNumbersDirective } from '../shared/only-numbers.directive';
import { MenuItemsComponent } from './menu-items/menu-items.component';
import { OrderDetailsComponent } from './details/details.component';
import { CurrencyPipe } from '@angular/common';
import { Item } from '../restaurant/restaurant';

interface OrderForm {
  name: FormControl<string>;
  address: FormControl<string>;
  phone: FormControl<string>;
  items: FormControl<Item[]>;
}

const minLengthArray =
  (min: number) =>
  (c: AbstractControl): ValidationErrors | null => {
    if (c.value.length >= min) {
      return null;
    }
    return { minLengthArray: { valid: false } };
  };

@Component({
  selector: 'pmo-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [
    OrderDetailsComponent,
    ReactiveFormsModule,
    MenuItemsComponent,
    OnlyNumbersDirective,
    CurrencyPipe,
  ],
})
export class OrderComponent {
  private readonly restaurantService = inject(RestaurantService);
  private readonly orderService = inject(OrderService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly itemTotal = inject(ItemTotalPipe);

  slug = input<string>();

  readonly ResourceStatus = ResourceStatus;

  readonly orderForm: FormGroup<OrderForm> = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    phone: this.fb.control('', [Validators.required]),
    items: this.fb.control<Item[]>([], [minLengthArray(1)]),
  });

  private readonly itemsControl: Signal<Item[]> = toSignal(
    this.orderForm.controls.items.valueChanges,
    { initialValue: this.orderForm.controls.items.value },
  );

  readonly orderTotal = computed(() => {
    const items = this.itemsControl();
    return this.itemTotal.transform(items);
  });

  readonly restaurantResource = this.restaurantService.getRestaurant(() => {
    const slug = this.slug();

    return slug ? { slug } : undefined;
  });

  readonly submitClicked = signal<number>(0);

  readonly formStatus = toSignal(this.orderForm.statusChanges, {
    initialValue: this.orderForm.status,
  });

  readonly shouldCreateOrder = linkedSignal<
    { clicked: number; valid: boolean },
    boolean
  >({
    source: () => ({
      clicked: this.submitClicked(),
      valid: this.formStatus() === 'VALID',
    }),
    computation: (source, previous) =>
      source.clicked !== previous?.source.clicked && source.valid,
  });

  readonly createOrderResource = this.orderService.createOrder(() => {
    const restaurantId = this.restaurantResource.value()?._id;

    if (!this.shouldCreateOrder() || !restaurantId) {
      return;
    }

    return {
      order: {
        ...this.orderForm.getRawValue(),
        restaurant: restaurantId,
      },
    };
  });

  onSubmit() {
    this.submitClicked.set(this.submitClicked() + 1);
  }

  startNewOrder() {
    this.orderForm.controls.items.setValue([]);
  }
}
