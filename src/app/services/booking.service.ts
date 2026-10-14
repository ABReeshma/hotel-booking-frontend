import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(
    roomId: number,
    booking: {
      guestName: string;
      guestEmail: string;
      checkInDate: string;
      checkOutDate: string;
      numberOfGuests: number;
    }
  ): Observable<Booking> {
    const credentials = btoa('traveller:Traveller@123');

    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`
    });

    return this.http.post<Booking>(
      `${this.apiUrl}/rooms/${roomId}`,
      booking,
      { headers }
    );
  }
  getBookingHistory(guestEmail: string): Observable<Booking[]> {
  const credentials = btoa('traveller:Traveller@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  return this.http.get<Booking[]>(
    `${this.apiUrl}?guestEmail=${encodeURIComponent(guestEmail)}`,
    { headers }
  );
}

cancelBooking(id: number): Observable<Booking> {
  const credentials = btoa('traveller:Traveller@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  return this.http.patch<Booking>(
    `${this.apiUrl}/${id}/cancel`,
    {},
    { headers }
  );
}
getHotelBookings(hotelId: number): Observable<Booking[]> {
  const credentials = btoa('partner:Partner@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  return this.http.get<Booking[]>(
    `${this.apiUrl}/hotel/${hotelId}`,
    { headers }
  );
}
}