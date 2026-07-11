import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUser(): any {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  sendOtp(payload: { email: string, fullName?: string, mobileNo?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, payload);
  }

  verifyOtp(payload: { email: string, otp: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, payload);
  }

  signupWithPassword(payload: { email: string, fullName: string, mobileNo: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-password`, payload);
  }

  loginWithPassword(payload: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login-password`, payload);
  }

  saveToken(token: string) { localStorage.setItem('token', token); }
  saveUser(user: any) { localStorage.setItem('user', JSON.stringify(user)); }
}