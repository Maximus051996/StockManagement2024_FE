import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

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
}
