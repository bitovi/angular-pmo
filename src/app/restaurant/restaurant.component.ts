import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RestaurantService, Config, City, State } from './restaurant.service';
import { Restaurant } from './restaurant';
import { tap } from 'rxjs/operators';
import { ImageUrlPipe } from '../shared/image-url.pipe';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

export interface Data<T> {
  value: Array<T>;
  isPending: boolean;
}

@Component({
    selector: 'pmo-restaurant',
    templateUrl: './restaurant.component.html',
    styleUrls: ['./restaurant.component.css'],
    imports: [
        ReactiveFormsModule,
        NgIf,
        NgFor,
        RouterLink,
        ImageUrlPipe,
    ]
})
export class RestaurantComponent implements OnInit {
  form!: FormGroup<{
    state: FormControl<string>;
    city: FormControl<string>;
  }>;

  public restaurants: Data<Restaurant> = {
    value: [],
    isPending: false,
  };
  public states: Data<State> = {
    value: [],
    isPending: true,
  };

  public cities: Data<City> = {
    value: [],
    isPending: false,
  };

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.createForm();
    this.states.isPending = true;
    this.restaurantService
      .getStates()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res: Config<State>) => {
          this.states.value = res.data;
          this.states.isPending = false;
          this.form.controls.state.enable();
        })
      )
      .subscribe();
  }

  createForm() {
    this.form = this.fb.nonNullable.group({
      state: { value: '', disabled: true },
      city: { value: '', disabled: true },
    });

    this.onChanges();
  }

  onChanges(): void {
    let state: string;
    this.form.controls.state.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        console.log('state', state, val);
        if (val) {
          this.form.controls.city.enable({
            onlySelf: true,
            emitEvent: false,
          });
          // eslint-disable-next-line eqeqeq
          if (state != val) {
            this.form.controls.city.patchValue('');
            this.restaurants.value = [];
          }
          this.getCities(val);
          state = val;
        } else {
          this.form.controls.city.disable({
            onlySelf: true,
            emitEvent: false,
          });
          state = '';
          this.restaurants.value = [];
        }
      });

    this.form.controls.city.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (val) {
          this.getRestaurants(state, val);
        }
      });
  }

  getCities(state: string) {
    this.cities.isPending = true;
    this.restaurantService
      .getCities(state)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res: Config<City>) => {
          this.cities.value = res.data;
          this.cities.isPending = false;
          this.form.controls.city.enable({
            onlySelf: true,
            emitEvent: false,
          });
        })
      )
      .subscribe();
  }

  getRestaurants(state: string, city: string) {
    this.restaurants.isPending = true;
    this.restaurantService
      .getRestaurants(state, city)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res: Config<Restaurant>) => {
          this.restaurants.value = res.data;
          this.restaurants.isPending = false;
        })
      )
      .subscribe();
  }
}
