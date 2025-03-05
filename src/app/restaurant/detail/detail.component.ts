import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RestaurantService } from '../restaurant.service';
import { ImageUrlPipe } from '../../shared/image-url.pipe';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'pmo-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  imports: [NgStyle, RouterLink, ImageUrlPipe],
})
export class RestaurantDetailComponent {
  private readonly restaurantService: RestaurantService =
    inject(RestaurantService);

  slug = input<string>();
  restaurantResource = this.restaurantService.getRestaurant(() => {
    const slug = this.slug();

    return slug ? { slug } : undefined;
  });
}
