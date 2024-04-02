import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RestaurantDetailComponent } from './restaurant/detail/detail.component';
import { OrderComponent } from './order/order.component';
import { OrderHistoryComponent } from './order/history/history.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'restaurants',
    component: RestaurantComponent,
  },
  {
    path: 'restaurants/:slug',
    component: RestaurantDetailComponent,
  },
  {
    path: 'restaurants/:slug/:order',
    component: OrderComponent,
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent,
  },
];
