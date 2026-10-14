
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Hotel, HotelService } from '../../services/hotel.service';
import { Room, RoomService } from '../../services/room.service';
import { Booking, BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-partner-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './partner-dashboard.html',
  styleUrl: './partner-dashboard.css'
})
export class PartnerDashboard {
  hotels: Hotel[] = [];

  partnerHotelId: number | null = null;
  partnerHotel: Hotel | null = null;

  partnerRooms: Room[] = [];
  partnerBookings: Booking[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private hotelService: HotelService,
    private roomService: RoomService,
    private bookingService: BookingService
  ) {
    this.loadHotels();
  }

  loadHotels(): void {
    this.errorMessage = '';

    this.hotelService.getAllHotels().subscribe({
      next: (hotels: Hotel[]) => {
        this.hotels = hotels;

        if (hotels.length > 0) {
          this.selectHotel(hotels[0].id);
        } else {
          this.partnerHotelId = null;
          this.partnerHotel = null;
          this.partnerRooms = [];
          this.partnerBookings = [];
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load hotels.';
      }
    });
  }

  selectHotel(hotelId: number): void {
    this.partnerHotelId = hotelId;

    this.partnerHotel = null;
    this.partnerRooms = [];
    this.partnerBookings = [];

    this.errorMessage = '';
    this.successMessage = '';

    this.loadHotel();
    this.loadRooms();
    this.loadBookings();
  }

  onHotelChange(value: string): void {
    const hotelId = Number(value);

    if (Number.isInteger(hotelId) && hotelId > 0) {
      this.selectHotel(hotelId);
    }
  }

  loadHotel(): void {
    if (this.partnerHotelId === null) {
      return;
    }

    this.hotelService.getHotelById(this.partnerHotelId).subscribe({
      next: (hotel: Hotel) => {
        this.partnerHotel = { ...hotel };
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load hotel details.';
      }
    });
  }

  saveHotel(): void {
    if (!this.partnerHotel || this.partnerHotelId === null) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.hotelService.updateHotel(
      this.partnerHotelId,
      this.partnerHotel
    ).subscribe({
      next: (updatedHotel: Hotel) => {
        this.partnerHotel = { ...updatedHotel };

        const index = this.hotels.findIndex(
          hotel => hotel.id === updatedHotel.id
        );

        if (index !== -1) {
          this.hotels[index] = updatedHotel;
          this.hotels = [...this.hotels];
        }

        this.successMessage = 'Hotel details updated successfully.';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to update hotel details.';
        this.loading = false;
      }
    });
  }

  loadRooms(): void {
    if (this.partnerHotelId === null) {
      return;
    }

    this.roomService.getRoomsByHotel(this.partnerHotelId).subscribe({
      next: (rooms: Room[]) => {
        this.partnerRooms = rooms;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load hotel rooms.';
      }
    });
  }

  updateRoomStatus(room: Room, status: string): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.roomService.updateRoomStatus(room.id, status).subscribe({
      next: (updatedRoom: Room) => {
        this.partnerRooms = this.partnerRooms.map(item =>
          item.id === updatedRoom.id ? updatedRoom : item
        );

        this.successMessage =
          `Room ${updatedRoom.id} status updated to ${updatedRoom.status}.`;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to update room status.';
      }
    });
  }

  loadBookings(): void {
    if (this.partnerHotelId === null) {
      return;
    }

    this.bookingService.getHotelBookings(this.partnerHotelId).subscribe({
      next: (bookings: Booking[]) => {
        this.partnerBookings = bookings;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load hotel reservations.';
      }
    });
  }
}
