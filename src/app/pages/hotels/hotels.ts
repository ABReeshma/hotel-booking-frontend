
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Hotel } from '../../services/hotel.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css'
})
export class Hotels {
  hotels: Hotel[] = [];
  location = '';

  constructor(public router: Router) {
  const state = this.router.currentNavigation()?.extras.state;

  this.hotels = state?.['hotels'] ?? [];
  this.location = state?.['location'] ?? '';
}
}
