import { Component, effect, inject, Signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RestaurantService } from './restaurant.service';
import { map, pairwise, startWith } from 'rxjs/operators';
import { ImageUrlPipe } from '../shared/image-url.pipe';
import { RouterLink } from '@angular/router';

export interface Data<T> {
  value: Array<T>;
  isPending: boolean;
}

@Component({
  selector: 'pmo-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
  imports: [ReactiveFormsModule, RouterLink, ImageUrlPipe],
})
export class RestaurantComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly restaurantService: RestaurantService =
    inject(RestaurantService);

  readonly form: FormGroup<{
    state: FormControl<string>;
    city: FormControl<string>;
  }> = this.fb.nonNullable.group({
    state: { value: '', disabled: true },
    city: { value: '', disabled: true },
  });

  private readonly toggleStateControl = effect(() => {
    const isLoading = this.statesResource.isLoading();
    if (isLoading) {
      this.form.controls.state.disable();
    } else {
      this.form.controls.state.enable();
    }
  });

  private readonly stateControl: Signal<string> = toSignal(
    this.form.controls.state.valueChanges,
    { initialValue: this.form.controls.state.value },
  );

  private readonly stateControlPrevCurr: Signal<{
    prev: string;
    curr: string;
  }> = toSignal(
    this.form.controls.state.valueChanges.pipe(
      startWith(this.form.controls.state.value),
      pairwise(),
      map(([prev, curr]) => ({ prev, curr })),
    ),
    { initialValue: { prev: '', curr: this.form.controls.state.value } },
  );

  private readonly cityControl: Signal<string> = toSignal(
    this.form.controls.city.valueChanges,
    { initialValue: this.form.controls.city.value },
  );

  private readonly toggleCityControlOnCitiesChange = effect(() => {
    const isLoading = this.citiesResource.isLoading();

    if (isLoading) {
      this.form.controls.city.disable();
    } else {
      this.form.controls.city.enable();
    }
  });
  private readonly toggleCityControlOnStateChange = effect(() => {
    const state = this.stateControl();

    if (!state) {
      this.form.controls.city.disable();
    } else {
      this.form.controls.city.enable();
    }
  });

  private readonly resetCityControl = effect(() => {
    const state = this.stateControlPrevCurr();
    if (!state.curr || state.prev !== state.curr) {
      this.form.controls.city.patchValue('');
    }
  });

  private readonly resetRestaurants = effect(() => {
    const state = this.stateControlPrevCurr();
    if (!state.curr || state.prev !== state.curr) {
      this.restaurantsResource.set({ data: [] });
    }
  });

  readonly statesResource = this.restaurantService.getStates();
  readonly citiesResource = this.restaurantService.getCities(() => {
    const state = this.stateControl();
    return state ? { state } : undefined;
  });
  readonly restaurantsResource = this.restaurantService.getRestaurants(() => {
    const state = this.stateControl();
    const city = this.cityControl();
    return state && city ? { state, city } : undefined;
  });
}
