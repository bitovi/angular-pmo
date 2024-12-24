import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantComponent } from './restaurant.component';
import { provideHttpClient } from '@angular/common/http';

const statesMock = {
  data: [
    { short: 'IL', name: 'Illinois' },
    { short: 'WI', name: 'Wisconsin' },
    { short: 'MI', name: 'Michigan' },
  ],
};

const citiesMock = {
  data: [
    { name: 'Chicago', state: 'IL' },
    { name: 'Peoria', state: 'IL' },
  ],
};

const restaurantsMock = {
  data: [
    {
      name: 'Crab Place',
      slug: 'crab-place',
      images: {
        thumbnail: 'node_modules/place-my-order-assets/images/3-thumbnail.jpg',
        owner: 'node_modules/place-my-order-assets/images/4-owner.jpg',
        banner: 'node_modules/place-my-order-assets/images/3-banner.jpg',
      },
      menu: {
        lunch: [
          { _id: '1', name: 'Garlic Fries', price: 15.99 },
          { _id: '2', name: 'Crab Pancakes with Sorrel Syrup', price: 35.99 },
          { _id: '3', name: 'Ricotta Gnocchi', price: 15.99 },
        ],
        dinner: [
          { _id: '4', name: 'Spinach Fennel Watercress Ravioli', price: 35.99 },
          { _id: '5', name: 'Roasted Salmon', price: 23.99 },
          {
            _id: '6',
            name: 'Herring in Lavender Dill Reduction',
            price: 45.99,
          },
        ],
      },
      address: {
        street: '2451 W Washburne Ave',
        city: 'Chicago',
        state: 'IL',
        zip: '60632',
      },
      _id: '30KN1UX5eZ1GTEiR',
    },
    {
      name: 'Brunch Restaurant',
      slug: 'brunch-restaurant',
      images: {
        thumbnail: 'node_modules/place-my-order-assets/images/3-thumbnail.jpg',
        owner: 'node_modules/place-my-order-assets/images/2-owner.jpg',
        banner: 'node_modules/place-my-order-assets/images/3-banner.jpg',
      },
      menu: {
        lunch: [
          { _id: '4', name: 'Spinach Fennel Watercress Ravioli', price: 35.99 },
          { _id: '2', name: 'Crab Pancakes with Sorrel Syrup', price: 35.99 },
          { _id: '7', name: 'Steamed Mussels', price: 21.99 },
        ],
        dinner: [
          { _id: '8', name: 'Truffle Noodles', price: 14.99 },
          { _id: '9', name: 'Charred Octopus', price: 25.99 },
          { _id: '3', name: 'Ricotta Gnocchi', price: 15.99 },
        ],
      },
      address: {
        street: '1601-1625 N Campbell Ave',
        city: 'Chicago',
        state: 'IL',
        zip: '53205',
      },
      _id: 'AAwDVaoNge824m8N',
    },
    {
      name: 'Pig Shack',
      slug: 'pig-shack',
      images: {
        thumbnail: 'node_modules/place-my-order-assets/images/4-thumbnail.jpg',
        owner: 'node_modules/place-my-order-assets/images/3-owner.jpg',
        banner: 'node_modules/place-my-order-assets/images/2-banner.jpg',
      },
      menu: {
        lunch: [
          { _id: '2', name: 'Crab Pancakes with Sorrel Syrup', price: 35.99 },
          { _id: '10', name: 'Onion fries', price: 15.99 },
          { _id: '9', name: 'Charred Octopus', price: 25.99 },
        ],
        dinner: [
          { _id: '11', name: 'Gunthorp Chicken', price: 21.99 },
          {
            _id: '4',
            name: 'Spinach Fennel Watercress Ravioli',
            price: 35.99,
          },
          { _id: '1', name: 'Garlic Fries', price: 15.99 },
        ],
      },
      address: {
        street: '1601-1625 N Campbell Ave',
        city: 'Chicago',
        state: 'IL',
        zip: '53205',
      },
      _id: 'KPL90tWDr9REhn8U',
    },
  ],
};

describe('RestaurantComponent', () => {
  let component: RestaurantComponent;
  let fixture: ComponentFixture<RestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RestaurantComponent],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantComponent);
    component = fixture.componentInstance;

    spyOn(component['restaurantService'], 'statesLoader').and.returnValue(
      Promise.resolve(statesMock),
    );
    spyOn(component['restaurantService'], 'citiesLoader').and.returnValue(
      Promise.resolve(citiesMock),
    );
    spyOn(component['restaurantService'], 'restaurantsLoader').and.returnValue(
      Promise.resolve(restaurantsMock),
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a list of states', async () => {
    expect(component.statesResource.isLoading()).toBe(true);

    await fixture.whenStable();

    const states = component.statesResource.value();
    expect(states).toEqual(statesMock);
  });

  it('should enable the state input when states have been fetched', async () => {
    await fixture.whenStable();

    fixture.detectChanges();

    expect(component.form.controls.state.enabled).toBeTruthy();
  });

  it('should enable the cities input when state has a value', async () => {
    await fixture.whenStable();

    component.form.controls.state.patchValue('IL');

    await fixture.detectChanges();
    await fixture.detectChanges();

    expect(component.form.controls.city.enabled).toBeTruthy();
  });

  it('should fetch a list of cities when state has a value', async () => {
    await fixture.whenStable();

    expect(component.citiesResource.value()).toEqual(undefined);

    component.form.controls.state.patchValue('IL');
    await fixture.detectChanges();

    expect(component.citiesResource.value()).toEqual(citiesMock);
  });

  it('should fetch a list of restaurants when state and city have values', async () => {
    await fixture.whenStable();

    expect(component.restaurantsResource.value()).toEqual(undefined);

    component.form.controls.state.patchValue('IL');
    await fixture.detectChanges();

    component.form.controls.city.patchValue('Chicago');
    await fixture.detectChanges();

    expect(component.restaurantsResource.value()).toEqual(restaurantsMock);
  });
});
