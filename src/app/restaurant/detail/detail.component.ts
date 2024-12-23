import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../restaurant';
import { ImageUrlPipe } from '../../shared/image-url.pipe';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'pmo-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  imports: [NgStyle, RouterLink, ImageUrlPipe],
})
export class RestaurantDetailComponent implements OnInit {
  restaurant?: Restaurant;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') as string;
    this.restaurantService.getRestaurant(slug).subscribe((data: Restaurant) => {
      this.restaurant = data;
      this.isLoading = false;
    });
  }

  getUrl(image: string): string {
    return image.replace('node_modules/place-my-order-assets', './assets');
  }
}
