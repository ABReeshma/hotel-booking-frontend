import { Injectable } from '@angular/core';
import { HttpClient, HttpParams ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id: number;
  name: string;
  location: string;
  address: string;
  description: string;
  starRating: number;
  amenities: string;
  policies: string | null;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private readonly apiUrl = 'http://localhost:8080/api/hotels';

  constructor(private http: HttpClient) {}

  searchHotels(location: string): Observable<Hotel[]> {
  const params = new HttpParams().set('location', location);

  const credentials = btoa('traveller:Traveller@123');

  return this.http.get<Hotel[]>(
    `${this.apiUrl}/search`,
    {
      params,
      headers: {
        Authorization: `Basic ${credentials}`
      }
    }
  );
}
updateHotel(hotelId: number, hotel: any): Observable<any> {
  const credentials = btoa('partner:Partner@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  return this.http.put<any>(
    `${this.apiUrl}/${hotelId}`,
    hotel,
    { headers }
  );
}
getHotelById(id: number): Observable<Hotel> {
  const credentials = btoa('partner:Partner@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  return this.http.get<Hotel>(
    `${this.apiUrl}/${id}`,
    { headers }
  );
}

getAllHotels(): Observable<Hotel[]> {
  const credentials = btoa('partner:Partner@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  return this.http.get<Hotel[]>(
    this.apiUrl,
    { headers }
  );
}

createHotel(hotel: Omit<Hotel, 'id'>): Observable<Hotel> {
  const credentials = btoa('partner:Partner@123');

  const headers = new HttpHeaders({
    Authorization: `Basic ${credentials}`
  });

  return this.http.post<Hotel>(
    this.apiUrl,
    hotel,
    { headers }
  );
}

}