import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  id: number;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  totalRooms: number;
  amenities: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAvailableRooms(
    hotelId: number,
    checkIn: string,
    checkOut: string,
    guests: number
  ): Observable<Room[]> {

    const params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut)
      .set('guests', guests);

    const credentials = btoa('traveller:Traveller@123');

    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`
    });

    return this.http.get<Room[]>(
      `${this.apiUrl}/hotels/${hotelId}/rooms/availability`,
      { params, headers }
    );
  }
  updateRoomStatus(
  roomId: number,
  status: string
): Observable<Room> {
  const credentials = btoa('partner:Partner@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  const params = new HttpParams().set('status', status);

  return this.http.patch<Room>(
    `${this.apiUrl}/rooms/${roomId}/status`,
    null,
    { headers, params }
  );
}
  getRoomsByHotel(hotelId: number): Observable<Room[]> {
  const credentials = btoa('partner:Partner@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  return this.http.get<Room[]>(
    `${this.apiUrl}/hotels/${hotelId}/rooms`,
    { headers }
  );
}

createRoom(hotelId: number, room: Omit<Room, 'id'>): Observable<Room> {
  const credentials = btoa('partner:Partner@123');

  const headers = {
    Authorization: `Basic ${credentials}`
  };

  return this.http.post<Room>(
    `${this.apiUrl}/hotels/${hotelId}/rooms`,
    room,
    { headers }
  );
}

}