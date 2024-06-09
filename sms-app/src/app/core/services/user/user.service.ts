import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from '../../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  async Userlogin(data: any): Promise<any> {
    try {
      const res = await this.http
        .post(`${this.serverUrl}login`, data, { withCredentials: false })
        .toPromise();
      return res;
    } catch (error) {
      return error;
    }
  }

  getAllUsers(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.serverUrl}get-user-details`)
      .pipe(catchError(this.handleError));
  }

  deleteuserById(userId: string): Observable<any[]> {
    const url = `${this.serverUrl}delete-user/${userId}`;
    return this.http.delete<any[]>(url).pipe(catchError(this.handleError));
  }

  createUser(payload: any): Observable<any> {
    const url = `${this.serverUrl}add-user`;
    return this.http.post(url, payload).pipe(catchError(this.handleError));
  }

  updateUser(userId: string, payload: any): Observable<any> {
    const url = `${this.serverUrl}update-user/${userId}`;
    return this.http.put(url, payload).pipe(catchError(this.handleError));
  }

  getuserById(userId: string): Observable<any> {
    const url = `${this.serverUrl}get-user-details-byId/${userId}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  mailUser(payload: any): Observable<any> {
    const url = `${this.serverUrl}send-mail`;
    return this.http.post(url, payload).pipe(catchError(this.handleError));
  }

  activeUserById(userId: string): Observable<any[]> {
    const url = `${this.serverUrl}activate-user/${userId}`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(Message.errorMsg));
  }
}
