
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Room, RoomService } from '../../services/room.service';
import { Booking, BookingService } from '../../services/booking.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class Rooms {
  hotelId = 0;

  checkIn = '';
  checkOut = '';
  guests = 2;

  rooms: Room[] = [];
  loading = false;
  errorMessage = '';

  selectedRoom: Room | null = null;
  guestName = '';
  guestEmail = '';

  bookingLoading = false;
  bookingError = '';
  bookingSuccess: Booking | null = null;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private bookingService: BookingService
  ) {
    this.route.paramMap.subscribe(params => {
      this.hotelId = Number(params.get('hotelId'));
    });
  }

  searchRooms(): void {
    if (!this.checkIn || !this.checkOut || this.checkOut <= this.checkIn) {
      this.errorMessage = 'Please select valid check-in and check-out dates.';
      this.rooms = [];
      return;
    }

    if (this.guests < 1) {
      this.errorMessage = 'At least one guest is required.';
      this.rooms = [];
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.rooms = [];
    this.selectedRoom = null;
    this.bookingSuccess = null;

    this.roomService.getAvailableRooms(
      this.hotelId,
      this.checkIn,
      this.checkOut,
      this.guests
    ).subscribe({
      next: (data: Room[]) => {
        this.rooms = data;
        this.loading = false;

        if (data.length === 0) {
          this.errorMessage = 'No rooms available for the selected dates.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Unable to load available rooms.';
      }
    });
  }

  selectRoom(room: Room): void {
    this.selectedRoom = room;
    this.guestName = '';
    this.guestEmail = '';
    this.bookingError = '';
    this.bookingSuccess = null;
  }

  bookRoom(): void {
    if (!this.selectedRoom) {
      return;
    }

    if (!this.guestName.trim() || !this.guestEmail.trim()) {
      this.bookingError = 'Please enter your name and email.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.guestEmail.trim())) {
      this.bookingError = 'Please enter a valid email address.';
      return;
    }

    if (!this.checkIn || !this.checkOut || this.checkOut <= this.checkIn) {
      this.bookingError = 'Please select valid check-in and check-out dates.';
      return;
    }

    this.bookingLoading = true;
    this.bookingError = '';
    this.bookingSuccess = null;

    this.bookingService.createBooking(this.selectedRoom.id, {
      guestName: this.guestName.trim(),
      guestEmail: this.guestEmail.trim(),
      checkInDate: this.checkIn,
      checkOutDate: this.checkOut,
      numberOfGuests: this.guests
    }).subscribe({
      next: (booking: Booking) => {
        this.bookingSuccess = booking;
        this.bookingLoading = false;
      },
      error: (error) => {
        this.bookingLoading = false;

        if (error.status === 409) {
          this.bookingError =
            error.error?.message || 'No rooms available for these dates.';
        } else if (error.status === 400) {
          this.bookingError =
            error.error?.message || 'Please check your booking details.';
        } else {
          this.bookingError =
            error.error?.message || 'Booking failed. Please try again.';
        }
      }
    });
  }
}
