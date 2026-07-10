import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HostelService {
  private apiUrl = 'http://localhost:3000/api/hostels';

  constructor(private http: HttpClient) {}

  // Fetch list of hostels by city from backend
  getHostels(city: string): Observable<any> {
    return this.http.get<{ hostels: any[] }>(`${this.apiUrl}`, {
      params: { city }
    });
  }

  // Submit hostel booking form details to backend
  bookHostel(bookingData: {
    hostelId: number;
    fullName: string;
    email: string;
    mobileNo: string;
    checkInDate: string;
    roomType: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, bookingData);
  }
}
