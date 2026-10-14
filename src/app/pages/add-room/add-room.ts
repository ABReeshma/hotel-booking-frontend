
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Hotel, HotelService } from '../../services/hotel.service';
import { Room, RoomService } from '../../services/room.service';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-room.html',
  styleUrl: './add-room.css'
})
export class AddRoom {
  hotels: Hotel[] = [];
  selectedHotelId: number | null = null;

  room = {
    roomType: '',
    pricePerNight: 1000,
    capacity: 2,
    totalRooms: 1,
    amenities: '',
    status: 'AVAILABLE'
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private hotelService: HotelService,
    private roomService: RoomService,
    private router: Router
  ) {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (hotels: Hotel[]) => {
        this.hotels = hotels;

        if (hotels.length > 0) {
          this.selectedHotelId = hotels[0].id;
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load hotels.';
      }
    });
  }

  saveRoom(): void {
    if (this.selectedHotelId === null) {
      this.errorMessage = 'Please select a hotel.';
      return;
    }

    if (!this.room.roomType.trim()) {
      this.errorMessage = 'Please enter a room type.';
      return;
    }

    if (
      this.room.pricePerNight <= 0 ||
      this.room.capacity < 1 ||
      this.room.totalRooms < 1
    ) {
      this.errorMessage =
        'Price, capacity, and total rooms must be valid positive values.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.roomService.createRoom(
      this.selectedHotelId,
      this.room
    ).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Room added successfully!';

        this.router.navigate(['/partner/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Unable to add room.';
      }
    });
  }
}
