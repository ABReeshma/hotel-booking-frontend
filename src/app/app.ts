import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hotel, HotelService } from './services/hotel.service';
import { Room, RoomService } from './services/room.service';
import { Booking, BookingService } from './services/booking.service';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  location = '';
  hotels: Hotel[] = [];
  loading = false;
  errorMessage = '';
checkIn = '';
checkOut = '';
guests = 2;

selectedHotel: Hotel | null = null;
rooms: Room[] = [];
roomLoading = false;
roomError = '';
selectedRoom: Room | null = null;

guestName = '';
guestEmail = '';

bookingLoading = false;
bookingError = '';
bookingSuccess: Booking | null = null;
partnerHotelId = 1;

partnerRooms: Room[] = [];
partnerBookings: Booking[] = [];

partnerLoading = false;
partnerError = '';
partnerMessage = '';

partnerHotel: any = null;

hotelEditMessage = '';
hotelEditError = '';
hotelEditLoading = false;
  constructor(
  private hotelService: HotelService,
  private roomService: RoomService,
  private bookingService: BookingService
) {}

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
      next: (data) => {
        this.hotels = data;
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
  selectRoom(room: Room): void {
  this.selectedRoom = room;
  this.bookingError = '';
  this.bookingSuccess = null;
  this.guestName = '';
  this.guestEmail = '';
}

bookRoom(): void {
  if (!this.selectedRoom) {
    return;
  }

  if (!this.guestName.trim() || !this.guestEmail.trim()) {
    this.bookingError = 'Please enter your name and email.';
    return;
  }

  if (!this.checkIn || !this.checkOut || this.checkOut <= this.checkIn) {
    this.bookingError = 'Please select valid check-in and check-out dates.';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.guestEmail.trim())) {
    this.bookingError = 'Please enter a valid email address.';
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
    next: (booking) => {
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
      } else if (error.status === 401 || error.status === 403) {
        this.bookingError = 'You are not authorized to make this booking.';
      } else {
        this.bookingError = 'Booking failed. Please try again.';
      }
    }
  });
}
bookingEmail = '';
myBookings: Booking[] = [];
bookingsLoading = false;
bookingsError = '';
bookingsMessage = '';

loadBookings(): void {
  if (!this.bookingEmail.trim()) {
    this.bookingsError = 'Please enter your email address.';
    this.myBookings = [];
    return;
  }

  this.bookingsLoading = true;
  this.bookingsError = '';
  this.bookingsMessage = '';
  this.myBookings = [];

  this.bookingService.getBookingHistory(
    this.bookingEmail.trim()
  ).subscribe({
    next: (data) => {
      this.myBookings = data;
      this.bookingsLoading = false;

      if (data.length === 0) {
        this.bookingsMessage = 'No bookings found for this email.';
      }
    },
    error: (error) => {
      this.bookingsLoading = false;
      this.bookingsError =
        error.error?.message || 'Unable to load bookings.';
    }
  });
}
loadPartnerRooms(): void {
  this.partnerLoading = true;
  this.partnerError = '';
  this.partnerMessage = '';

  this.roomService.getRoomsByHotel(this.partnerHotelId).subscribe({
    next: (rooms) => {
      this.partnerRooms = rooms;
      this.partnerLoading = false;
    },
    error: (error) => {
      this.partnerError =
        error.error?.message || 'Unable to load hotel rooms.';
      this.partnerLoading = false;
    }
  });
}

loadPartnerBookings(): void {
  this.partnerLoading = true;
  this.partnerError = '';
  this.partnerMessage = '';

  this.bookingService.getHotelBookings(this.partnerHotelId).subscribe({
    next: (bookings) => {
      this.partnerBookings = bookings;
      this.partnerLoading = false;
    },
    error: (error) => {
      this.partnerError =
        error.error?.message || 'Unable to load hotel reservations.';
      this.partnerLoading = false;
    }
  });
}
openPartnerPortal(): void {
  document.getElementById('partner-dashboard')
    ?.scrollIntoView({ behavior: 'smooth' });
}
updatePartnerRoomStatus(room: Room, status: string): void {
  this.partnerError = '';
  this.partnerMessage = '';

  this.roomService.updateRoomStatus(room.id, status).subscribe({
    next: (updatedRoom) => {
      this.partnerRooms = this.partnerRooms.map(item =>
        item.id === updatedRoom.id ? updatedRoom : item
      );

      this.partnerMessage =
        `Room ${updatedRoom.id} status updated to ${updatedRoom.status}.`;
    },
    error: (error) => {
      this.partnerError =
        error.error?.message || 'Unable to update room status.';
    }
  });
}
cancelMyBooking(booking: Booking): void {
  if (booking.status === 'CANCELLED') {
    this.bookingsError = 'This booking is already cancelled.';
    return;
  }

  this.bookingService.cancelBooking(booking.id).subscribe({
    next: (updatedBooking) => {
      const index = this.myBookings.findIndex(
        item => item.id === updatedBooking.id
      );

      if (index !== -1) {
        this.myBookings[index] = updatedBooking;
      }

      this.myBookings = [...this.myBookings];
      this.bookingsError = '';
      this.bookingsMessage =
        `Booking ${updatedBooking.id} cancelled successfully.`;
    },
    error: (error) => {
      this.bookingsError =
        error.error?.message || 'Unable to cancel booking.';
    }
  });
}
  viewRooms(hotel: Hotel): void {
  if (!this.checkIn || !this.checkOut) {
    this.roomError = 'Please select check-in and check-out dates.';
    return;
  }

  if (this.checkOut <= this.checkIn) {
    this.roomError = 'Check-out must be after check-in.';
    return;
  }

  this.selectedHotel = hotel;
  this.rooms = [];
  this.roomError = '';
  this.roomLoading = true;

  this.roomService.getAvailableRooms(
    hotel.id,
    this.checkIn,
    this.checkOut,
    this.guests
  ).subscribe({
    next: (data) => {
      this.rooms = data;
      this.roomLoading = false;

      if (data.length === 0) {
        this.roomError = 'No rooms available for the selected dates.';
      }
    },
    error: () => {
      this.roomLoading = false;
      this.roomError = 'Unable to load rooms. Check backend and security.';
    }
  });
}
loadPartnerHotel(): void {
  this.hotelEditMessage = '';
  this.hotelEditError = '';

  this.hotelService.getHotelById(this.partnerHotelId).subscribe({
    next: (hotel: Hotel) => {
      this.partnerHotel = { ...hotel };
    },
    error: () => {
      this.hotelEditError = 'Unable to load hotel details.';
    }
  });
}

saveHotelDetails(): void {
  if (!this.partnerHotel) {
    return;
  }

  this.hotelEditLoading = true;
  this.hotelEditMessage = '';
  this.hotelEditError = '';

  this.hotelService.updateHotel(
    this.partnerHotelId,
    this.partnerHotel
  ).subscribe({
    next: (updatedHotel: Hotel) => {
      this.partnerHotel = { ...updatedHotel };
      this.hotelEditMessage = 'Hotel details updated successfully.';
      this.hotelEditLoading = false;
    },
    error: (error: any) => {
      this.hotelEditError =
        error.error?.message || 'Unable to update hotel details.';
      this.hotelEditLoading = false;
    }
  });
}
}