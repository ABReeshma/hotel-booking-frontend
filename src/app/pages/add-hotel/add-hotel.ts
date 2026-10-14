
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Hotel, HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-hotel.html',
  styleUrl: './add-hotel.css'
})
export class AddHotel {
  hotel = {
    name: '',
    location: '',
    address: '',
    description: '',
    starRating: 3,
    amenities: '',
    policies: '',
    status: 'ACTIVE'
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private hotelService: HotelService,
    private router: Router
  ) {}

  saveHotel(): void {
    if (
      !this.hotel.name.trim() ||
      !this.hotel.location.trim() ||
      !this.hotel.address.trim()
    ) {
      this.errorMessage = 'Please enter hotel name, location, and address.';
      return;
    }

    if (this.hotel.starRating < 1 || this.hotel.starRating > 5) {
      this.errorMessage = 'Star rating must be between 1 and 5.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.hotelService.createHotel(this.hotel).subscribe({
      next: (createdHotel: Hotel) => {
        this.loading = false;
        this.successMessage =
          `${createdHotel.name} added successfully!`;

        this.router.navigate(['/partner/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Unable to add hotel. Please try again.';
      }
    });
  }
}
