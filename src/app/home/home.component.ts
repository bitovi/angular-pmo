import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pmo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class HomeComponent {}
