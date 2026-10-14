
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Hotels } from './pages/hotels/hotels';
import { Rooms } from './pages/rooms/rooms';
import { MyBookings } from './pages/my-bookings/my-bookings';
import { PartnerDashboard } from './pages/partner-dashboard/partner-dashboard';
import { AddHotel } from './pages/add-hotel/add-hotel';
import { AddRoom } from './pages/add-room/add-room';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'hotels', component: Hotels },
  { path: 'rooms/:hotelId', component: Rooms },
  { path: 'my-bookings', component: MyBookings },
  { path: 'partner/dashboard', component: PartnerDashboard },
  { path: 'partner/hotels/new', component: AddHotel },
  { path: 'partner/rooms/new', component: AddRoom }
];
