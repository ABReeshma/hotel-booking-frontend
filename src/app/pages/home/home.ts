
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hotel, HotelService } from '../../services/hotel.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  location = '';
  hotels: Hotel[] = [];
  loading = false;
  errorMessage = '';

  constructor(private hotelService: HotelService, private router: Router) {}

  searchHotels(): void {
    if (!this.location.trim()) {
      this.errorMessage = 'Please enter a destination.';
      this.hotels = [];
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.hotels = [];

    this.hotelService.searchHotels(this.location.trim()).subscribe({
      next: (data: Hotel[]) => {
        this.hotels = data;
        if (data.length > 0) {
  this.router.navigate(['/hotels'], {
    state: { hotels: data, location: this.location.trim() }
  });
}
        this.loading = false;

        if (data.length === 0) {
          this.errorMessage = 'No hotels found for this destination.';
        }
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Authentication required.';
        } else {
          this.errorMessage =
            'Unable to load hotels. Check backend and CORS settings.';
        }
      }
    });
  }
}
