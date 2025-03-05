import { Component, effect, inject, linkedSignal, Signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RestaurantService } from './restaurant.service';
import { ImageUrlPipe } from '../shared/image-url.pipe';
import { RouterLink } from '@angular/router';

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

  private readonly stateControlPrevCurr = linkedSignal<
    string,
    { prev: string | undefined; curr: string }
  >({
    source: this.stateControl,
    computation: (curr, prev) => ({ prev: prev?.source, curr }),
  });

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
    const { prev, curr } = this.stateControlPrevCurr();
    if (!prev || prev !== curr) {
      this.form.controls.city.patchValue('');
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
