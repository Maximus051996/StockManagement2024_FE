import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    // Initialize isAuthenticatedflag based on localStorage
    this.isAuthenticatedSubject.next(this.getJwtToken() !== null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  enableAuthenticationSubject(): void {
    this.isAuthenticatedSubject.next(true);
  }

  disableAuthenticationSubject(): void {
    this.isAuthenticatedSubject.next(false);
  }

  getJwtToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserDetails(): any {
    const token = this.getJwtToken();
    if (token) {
      return jwtDecode(token);
    } else {
      return null;
    }
  }
}
