import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'pmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink, NgClass, RouterOutlet],
})
export class AppComponent {
  title = 'sample-pmo';
}
