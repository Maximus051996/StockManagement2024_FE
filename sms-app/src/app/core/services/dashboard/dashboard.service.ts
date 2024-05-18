import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { Message } from '../../constants/messages';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  serverUrl = environment.serverUrl;
  constructor(private http: HttpClient, private sharedService: SharedService) {}

  async getTotalCompanyCountDetails(): Promise<number> {
    try {
      const res = await this.http
        .get<any>(`${this.serverUrl}total-company-count`)
        .toPromise();
      return res.activecompanyCount;
    } catch (error) {
      this.sharedService.openSnackBar(Message.errorMsg, 'OK');
      return 0; // Return default value or handle the error accordingly
    }
  }

  async getActiveUserCountDetails(): Promise<number> {
    try {
      const res = await this.http
        .get<any>(`${this.serverUrl}active-user-count`)
        .toPromise();
      return res.userCount;
    } catch (error) {
      this.sharedService.openSnackBar(Message.errorMsg, 'OK');
      return 0; // Return default value or handle the error accordingly
    }
  }

  async getDamageProductCountDetails(): Promise<number> {
    try {
      const res = await this.http
        .get<any>(`${this.serverUrl}damage-product-count`)
        .toPromise();
      return res.productCount;
    } catch (error) {
      this.sharedService.openSnackBar(Message.errorMsg, 'OK');
      return 0; // Return default value or handle the error accordingly
    }
  }

  async top5CompanyDetails(): Promise<any> {
    try {
      const res = await this.http
        .get<any>(`${this.serverUrl}top-five-productCountAsc-list`)
        .toPromise();
      return res;
    } catch (error) {
      this.sharedService.openSnackBar(Message.errorMsg, 'OK');
      return 0; // Return default value or handle the error accordingly
    }
  }
}
