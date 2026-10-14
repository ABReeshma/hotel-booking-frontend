
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Booking, BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings {
  bookingEmail = '';
  myBookings: Booking[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private bookingService: BookingService) {}

  loadBookings(): void {
    if (!this.bookingEmail.trim()) {
      this.errorMessage = 'Please enter your email address.';
      this.myBookings = [];
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.myBookings = [];

    this.bookingService.getBookingHistory(
      this.bookingEmail.trim()
    ).subscribe({
      next: (data: Booking[]) => {
        this.myBookings = data;
        this.loading = false;

        if (data.length === 0) {
          this.successMessage = 'No bookings found for this email.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Unable to load bookings.';
      }
    });
  }

  cancelBooking(booking: Booking): void {
    if (booking.status === 'CANCELLED') {
      this.errorMessage = 'This booking is already cancelled.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.bookingService.cancelBooking(booking.id).subscribe({
      next: (updatedBooking: Booking) => {
        this.myBookings = this.myBookings.map(item =>
          item.id === updatedBooking.id ? updatedBooking : item
        );

        this.successMessage =
          `Booking ${updatedBooking.id} cancelled successfully.`;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to cancel booking.';
      }
    });
  }
}
